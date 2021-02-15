import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Select, Row, Col, Form, Table } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { authList } from '@/services/auth/list';
import { getSysCode } from '@/services/common';
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

const pageSize: number = 10;
const AuthList: React.FC = () => {
  const [form] = Form.useForm();
  const [sysCodeOptions, setSysCodeOptions] = useState([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [dataSource, setDataSource] = useState([]);
  // const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const getSysCodeList = async () => {
      const result = await getSysCode();
      const optionList = result.map((item: any) => ({
        label: item.sysName,
        value: item.sysCode,
      }));
      setSysCodeOptions(optionList);
    };
    getSysCodeList();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '系统',
      dataIndex: 'sysCode',
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      width: 160,
      render: () => [
        <a
          key="config"
          onClick={() => {
            // handleModalVisible(true);
            // setCurrentRow(record);
            Modal.confirm({
              title: '确认',
              icon: <ExclamationCircleOutlined />,
              content: '确认删除这条权限吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {},
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const onFinish = async (values: any) => {
    const params = {
      ...values,
      pageSize,
      pageNum,
    };
    const result = await authList(params);
    setDataSource(result.list || []);
    setTotal(result.total);
  };

  return (
    <div className={styles.container}>
      <PageContainer>
        <article>
          <section className={styles.rowStyle}>
            <Form form={form} name="global_state" onFinish={onFinish}>
              <Row>
                <Col span={8}>
                  <Form.Item
                    name="sysCode"
                    label="系统"
                    rules={[{ required: true, message: '系统必选!' }]}
                  >
                    <Select style={{ width: '90%' }} options={sysCodeOptions} allowClear />
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
              columns={columns}
              dataSource={dataSource}
              pagination={{ current: pageNum, pageSize, total, simple: true }}
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
