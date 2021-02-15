import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Select, Row, Col, Form, Table, Input } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { userList } from '@/services/user/list';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import styles from './index.less';
import { ColumnsType } from 'antd/lib/table/Table';

/**
 * 添加节点
 *
 * @param fields
 */
/* const handleAdd = async (fields: any ) => {
   const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
*/

const pageSize: number = 6;
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
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [dataSource, setDataSource] = useState([]);
  // const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

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
      title: '密码',
      dataIndex: 'password',
      width: 320,
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
      dataIndex: 'role',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      width: 160,
      render: () => {
        return (
          <div className={styles.operationList}>
            <a
              onClick={() => {
                handleModalVisible(true);
                // setCurrentRow(record);
              }}
            >
              修改密码
            </a>
            <a
              onClick={() => {
                // handleModalVisible(true);
                // setCurrentRow(record);
                Modal.confirm({
                  title: '确认',
                  icon: <ExclamationCircleOutlined />,
                  content: '确认删除这条用户信息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {},
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
    const params = {
      pageSize,
      pageNum: 1,
    };
    searchList(params);
  }, []);

  return (
    <div className={styles.container}>
      <PageContainer>
        <article>
          <section className={styles.rowStyle}>
            <Form form={form} name="global_state" onFinish={onFinish}>
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
              <Button type="primary">
                <PlusOutlined /> 新增
              </Button>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: 1600 }}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                onChange: changePage,
              }}
            />
          </section>
        </article>

        <ModalForm
          title="新建用户"
          width="400px"
          visible={modalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async () => {
            /* const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } */
          }}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '规则名称为必填项',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" />
        </ModalForm>

        <ModalForm
          title="修改密码"
          width="400px"
          visible={modalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async () => {
            /* const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } */
          }}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '规则名称为必填项',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" />
        </ModalForm>
      </PageContainer>
    </div>
  );
};

export default AuthList;
