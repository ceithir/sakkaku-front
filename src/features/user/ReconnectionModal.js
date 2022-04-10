import React from "react";
import { Modal, Alert } from "antd";
import styles from "./ReconnectionModal.module.less";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  selectShowReconnectionModal,
  setShowReconnectionModal,
} from "./reducer";
import useInterval from "useInterval";
import useTimeout from "useTimeout";

const Mod = () => {
  const dispatch = useDispatch();

  // To avoid an infinity of calls, close the modal after three minutes
  useTimeout(() => {
    dispatch(setShowReconnectionModal(false));
  }, 3 * 60 * 1000);

  useInterval(() => {
    fetchUser(dispatch);
  }, 1 * 1000);

  return (
    <Modal
      visible={true}
      title={`Session expired`}
      footer={null}
      closable={false}
    >
      <Alert
        message={`You have been disconnected. Please reconnect, then try again.`}
        type="warning"
        showIcon
        className={styles.message}
      />
      <iframe title={`Login page`} src="/login" className={styles.iframe} />
    </Modal>
  );
};

const ReconnectionModal = () => {
  const show = useSelector(selectShowReconnectionModal);

  if (!show) {
    return null;
  }

  return <Mod />;
};

export default ReconnectionModal;
