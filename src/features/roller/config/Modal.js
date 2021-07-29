import React from "react";
import { Modal as AntdModal, Form, Radio, Switch } from "antd";
import ExplainOptions from "../glitter/ExplainOptions";
import { useSelector, useDispatch } from "react-redux";
import { selectConfig, updateConfig } from "./reducer";

const behaviorOptions = [
  {
    value: "semiauto",
    label: `Semi-automatic`,
    description: `The roller will try to preselect the best dice to reroll/keep.`,
  },
  {
    value: "manual",
    label: `Manual`,
    description: `All dice must be picked by hand.`,
  },
];

const Modal = ({ visible, hide }) => {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();

  return (
    <AntdModal
      title={`Roller Config`}
      visible={visible}
      onCancel={hide}
      footer={null}
    >
      <Form
        layout="vertical"
        initialValues={config}
        onValuesChange={(changedValues) => {
          dispatch(updateConfig(changedValues));
        }}
      >
        <Form.Item name="help" valuePropName="checked" label={`Display`}>
          <Switch />
        </Form.Item>
        <Form.Item name="mode" label={`Picking strategy`}>
          <Radio.Group options={behaviorOptions} optionType="button" />
        </Form.Item>
        <ExplainOptions options={behaviorOptions} />
      </Form>
    </AntdModal>
  );
};

export default Modal;
