import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
// import { rule, addRule } from '@/services/ant-design-pro/rule';
import { userList } from '@/services/user/list';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import styles from './index.less';

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

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  /** 弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      // search: false
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      // valueType: 'textarea',
    },
    {
      title: '密码',
      dataIndex: 'password',
      // valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      // valueType: 'textarea',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '微信用户',
          status: 'Default',
        },
        1: {
          text: '后台用户',
          status: 'Default',
        },
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 160,
      render: () => [
        <a
          key="config"
          onClick={() => {
            handleModalVisible(true);
            // setCurrentRow(record);
          }}
        >
          修改密码
        </a>,
        <a
          key="config"
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
        </a>,
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <PageContainer>
        <ProTable<any, API.PageParams>
          options={false}
          headerTitle="查询结果"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={async (params) => {
            const { current, pageSize, keyword, ...otherParams } = params;
            const newParams = {
              pageSize,
              pageNum: current,
              keyword,
              ...otherParams,
              // type: userType
            };
            const result = await userList(newParams);
            return {
              data: result.list,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result.total,
            };
          }}
          columns={columns}
          scroll={{ x: 1400 }}
        />

        <ModalForm
          title="新建用户"
          width="400px"
          visible={modalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={
            async (/* value */) => {
              /* const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } */
            }
          }
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
          onFinish={
            async (/* value */) => {
              /* const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } */
            }
          }
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

export default UserList;
