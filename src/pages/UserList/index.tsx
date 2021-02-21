import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Select, Row, Col, Form, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { userList, addUser, delUser, editUser, setRole, allRoleList } from '@/services/user/list';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/lib/table/Table';
import styles from './index.less';
import { formLayout } from '@/utils/utils';

const pageSize: number = 10;
const typeOptions = [
  {
    label: '微信用户',
    value: '0',
  },
  {
    label: '后台用户',
    value: '1',
  },
];
const AuthList: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState<any>(null);
  const [roleOptionList, setRoleOptionList] = useState<any[]>([]);
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [roleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const sysCode = initialState?.sysInfo?.split(',')?.[1];

  const searchList = async (params: API.PageApiParams) => {
    const result = await userList(params);
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
      const roleResult = await allRoleList({ sysCode });
      setRoleOptionList(roleResult || []);
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
        await editUser({
          ...current,
          ...values,
        });
        changePage(pageNum);
      } else {
        await addUser(values);
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

  const submitRoleModal = () => {
    roleForm.validateFields().then(async (values) => {
      const params = { ...values, sysCode };
      params.roleIds = JSON.stringify(params.roleIds);
      await setRole(params);
      changePage(pageNum);
      roleForm.resetFields();
      setCurrent(null);
      handleRoleModalVisible(false);
    });
  };

  const cancelRoleModal = () => {
    roleForm.resetFields();
    setCurrent(null);
    handleRoleModalVisible(false);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 160,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 140,
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      width: 100,
      render: (text: number) =>
        text || text === 0
          ? typeOptions.find((item) => String(item.value) === String(text))?.label
          : '',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
    },
    {
      title: '角色',
      dataIndex: 'roleList',
      width: 140,
      render: (text) => (text ? text.map((item: any) => item.nameCn).join(',') : ''),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text: number) => (text === 1 ? '有效' : '无效'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      width: 180,
      render: (text, record) => {
        return (
          <div className={styles.operationList}>
            <a
              onClick={() => {
                handleModalVisible(true);
                addForm.setFieldsValue(record);
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
                    await delUser({ id: record.id });
                    changePage(pageNum);
                    message.info('删除成功', 1);
                  },
                });
              }}
            >
              删除
            </a>
            <a
              onClick={() => {
                handleRoleModalVisible(true);
                roleForm.setFieldsValue({
                  userId: record.id,
                  roleIds: JSON.parse(record.role),
                });
                setCurrent(record);
              }}
            >
              设置角色
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
                  <Form.Item name="type" label="用户类型">
                    <Select style={{ width: '90%' }} options={typeOptions} allowClear />
                  </Form.Item>
                </Col>
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
              scroll={{ x: 1400 }}
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
          title={`${current?.id ? '编辑' : '新增'}用户`}
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
              name="userName"
              label="用户名"
              rules={[{ required: true, message: '姓名必填' }]}
            >
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '密码必填' }]}
            >
              <Input type="password" style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: '密码必填' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码必须相同'));
                  },
                }),
              ]}
            >
              <Input type="password" style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item
              name="nickName"
              label="昵称"
              rules={[{ required: true, message: '昵称必填' }]}
            >
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item name="email" label="邮箱">
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
            <Form.Item name="phone" label="手机" rules={[{ required: true, message: '手机必填' }]}>
              <Input style={{ width: '90%' }} allowClear />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="设置角色"
          destroyOnClose
          visible={roleModalVisible}
          onOk={submitRoleModal}
          onCancel={cancelRoleModal}
        >
          <Form {...formLayout} form={roleForm} name="add-form" initialValues={{}}>
            <Form.Item name="userId" label="用户ID">
              <Input style={{ width: '90%' }} allowClear disabled />
            </Form.Item>
            <Form.Item
              name="roleIds"
              label="角色"
              rules={[{ required: true, message: '权限必填' }]}
            >
              <Select mode="multiple" style={{ width: '90%' }}>
                {(roleOptionList || []).map((item: any) => (
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

export default AuthList;
