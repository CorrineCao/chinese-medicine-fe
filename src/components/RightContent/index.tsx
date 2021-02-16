import { sysCodeName } from '@/utils/utils';
import { Tag, Space, Modal, Select, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<{ label: string; value: string }>();

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const changeSysCode = () => {
    if (!selectValue) {
      message.error('请选择系统！');
      return;
    }
    const value = `${selectValue?.value},${selectValue?.label}`;
    localStorage.setItem(sysCodeName, value);
    setInitialState({
      ...initialState,
      sysInfo: value,
    });
    setModalVisible(false);
  };

  const getSysName = () => {
    const { sysInfo } = initialState;
    return sysInfo?.substring(sysInfo.indexOf(',') + 1);
  };
  return (
    <Space className={className}>
      <div className={styles.sysName} onClick={() => setModalVisible(true)}>
        {getSysName()}
      </div>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}

      <Modal
        title="切换系统"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={changeSysCode}
        destroyOnClose
      >
        <Select
          labelInValue
          style={{ width: 150 }}
          onChange={(value) => setSelectValue(value)}
          value={selectValue}
        >
          {(initialState?.sysCodeList || []).map((item) => (
            <Select.Option key={item.sysCode} value={item.sysCode}>
              {item.sysName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </Space>
  );
};
export default GlobalHeaderRight;
