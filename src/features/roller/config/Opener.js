import React, { useState } from "react";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Modal from "./Modal";

const Opener = ({ className }) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setModal(true)}>
        <SettingOutlined />
      </Button>
      <Modal visible={modal} hide={() => setModal(false)} />
    </>
  );
};

export default Opener;
