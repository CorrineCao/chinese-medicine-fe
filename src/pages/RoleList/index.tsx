import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Select, Row, Col, Form, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { roleList, addRole, editRole, delRole, allAuthList } from '@/services/role/list';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/lib/table/Table';
import styles from './index.less';
import moment from 'moment';
import { formLayout } from '@/utils/utils';

const pageSize: number = 10;

const RoleList: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState<any>(null);
  const [authOptionList, setAuthOptionList] = useState<any[]>([]);
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const sysCode = initialState?.sysInfo?.split(',')?.[1];

  const searchList = async (params: API.PageApiParams) => {
    const newParams = {
      ...params,
      sysCode,
    };
    const result = await roleList(newParams);
    setDataSource(result.list || []);
    setTotal(result.total);
  };

  const onFinish = (values: API.PageApiParams) => {
    setPageNum(1);
    const params = {
      ...values,
      pageSize,
      pageNum: 1,
    };
    searchList(params);
  };

  const changePage = (pageNo: number) => {
    const values = form.getFieldsValue();
    setPageNum(pageNo);
    const params = {
      ...values,
      pageSize,
      pageNum: pageNo,
    };
    searchList(params);
  };

  useEffect(() => {
    const initData = async () => {
      const authResult = await allAuthList({ sysCode });
      setAuthOptionList(authResult || []);
      const params = {
        pageSize,
        pageNum: 1,
      };
      searchList(params);
    };
    initData();
  }, []);

  const submitModal = () => {
    addForm.validateFields().then(async (values) => {
      if (values.id) {
        // 编辑
        await editRole({
          ...current,
          ...values,
          sysCode,
        });
        changePage(pageNum);
      } else {
        await addRole({
          ...values,
          sysCode,
        });
        changePage(1);
      }
      addForm.resetFields();
      setCurrent(null);
      handleModalVisible(false);
    });
  };

  const cancelModal = () => {
    addForm.resetFields();
    setCurrent(null);
    handleModalVisible(false);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色值',
      dataIndex: 'name',
    },
    {
      title: '角色名',
      dataIndex: 'nameCn',
    },
    {
      title: '权限',
      dataIndex: 'permissionList',
      width: '20%',
      render: (text) => (text ? text.map((item: any) => item.nameCn).join(',') : ''),
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '更新时间',
      dataIndex: 'mtime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <div className={styles.operationList}>
            <a
              onClick={() => {
                handleModalVisible(true);
                const fieldsValue = { ...record };
                fieldsValue.permission = JSON.parse(fieldsValue.permission);
                addForm.setFieldsValue(fieldsValue);
                setCurrent(record);
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                Modal.confirm({
                  title: '确认',
                  icon: <ExclamationCircleOutlined />,
                  content: '确认删除这条用户信息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    await delRole({ id: record.id });
                    changePage(pageNum);
                    message.info('删除成功', 1);
                  },
                });
              }}
            >
              删除
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <PageContainer>
        <article>
          <section className={styles.rowStyle}>
            <Form {...formLayout} form={form} name="list-form" onFinish={onFinish}>
              <Row>
                <Col span={8}>
                  <Form.Item name="keyword" label="关键字">
                    <Input style={{ width: '90%' }} allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </section>
          <section className={styles.rowStyle}>
            <div className={styles.searchResult}>
              <strong>查询结果</strong>
              <Button
                type="primary"
                onClick={() => {
                  addForm.resetFields();
                  setCurrent(null);
                  handleModalVisible(true);
                }}
              >
                <PlusOutlined /> 新增
              </Button>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                onChange: changePage,
                showTotal: (all) => `共${all}条 `,
              }}
            />
          </section>
        </article>

        <Modal
          title={`${current?.id ? '编辑' : '新增'}角色`}
          destroyOnClose
          visible={modalVisible}
          onOk={submitModal}
          onCancel={cancelModal}
        >
          <Form {...formLayout} form={addForm} name="add-form" initialValues={{}}>
            {current?.id ? (
              <Form.Item name="id" label="ID">
                <Input style={{ width: '90%' }} allowClear disabled />
              </Form.Item>
            ) : null}
            <Form.Item
              name="name"
              label="角色值"
              rules={[{ required: true, message: '角色值必填' }]}
            >
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="nameCn"
              label="角色名"
              rules={[{ required: true, message: '角色名必填' }]}
            >
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item name="desc" label="描述" rules={[{ required: true, message: '描述必填' }]}>
              <Input.TextArea style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="permission"
              label="权限"
              rules={[{ required: true, message: '权限必填' }]}
            >
              <Select mode="multiple" style={{ width: '90%' }}>
                {(authOptionList || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.nameCn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default RoleList;
