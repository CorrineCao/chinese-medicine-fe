import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Row, Col, Form, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { authList, addAuth, delAuth } from '@/services/auth/list';
import type { ColumnsType } from 'antd/lib/table/Table';
import { useModel } from 'umi';
import styles from './index.less';
import moment from 'moment';
import { formLayout } from '@/utils/utils';

const pageSize: number = 10;

const AuthList: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [dataSource, setDataSource] = useState([]);
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const sysCode = initialState?.sysInfo?.split(',')?.[1];

  const searchList = async (params: API.PageApiParams) => {
    const newParams = {
      ...params,
      sysCode,
    };
    const result = await authList(newParams);
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
      await addAuth({
        ...values,
        sysCode,
      });
      changePage(1);
      addForm.resetFields();
      handleModalVisible(false);
    });
  };

  const cancelModal = () => {
    addForm.resetFields();
    handleModalVisible(false);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '权限名',
      dataIndex: 'name',
    },
    {
      title: '显示名',
      dataIndex: 'nameCn',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '更新时间',
      dataIndex: 'mtime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      width: 160,
      render: (text, record) => {
        return (
          <div className={styles.operationList}>
            <a
              onClick={() => {
                Modal.confirm({
                  title: '确认',
                  icon: <ExclamationCircleOutlined />,
                  content: '确认删除这条用户信息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    await delAuth({ id: record.id });
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
          title="新增权限"
          destroyOnClose
          visible={modalVisible}
          onOk={submitModal}
          onCancel={cancelModal}
        >
          <Form {...formLayout} form={addForm} name="add-form" initialValues={{}}>
            <Form.Item name="name" label="权限名" rules={[{ required: true, message: '名称必填' }]}>
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="nameCn"
              label="显示名"
              rules={[{ required: true, message: '显示名必填' }]}
            >
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item name="desc" label="描述" rules={[{ required: true, message: '描述必填' }]}>
              <Input.TextArea style={{ width: '90%' }} allowClear />
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default AuthList;
