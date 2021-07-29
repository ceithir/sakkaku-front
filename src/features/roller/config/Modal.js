import React from "react";
import { Modal as AntdModal, Form, Radio } from "antd";
import ExplainOptions from "../glitter/ExplainOptions";
import { useSelector, useDispatch } from "react-redux";
import { selectConfig, updateConfig } from "./reducer";
import Dice from "../Dice";
import styles from "./Modal.module.less";
import TextDice from "../glitter/TextDice";

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

const displayOptions = [
  {
    value: "compact",
    label: "Compact",
    description: (
      <>
        {`Dice will be shown as:`}
        <div className={styles["compact-dice"]}>
          <Dice dice={{ type: "ring", value: { explosion: 1, strife: 1 } }} />
          <Dice
            dice={{ type: "skill", value: { opportunity: 1, success: 1 } }}
          />
        </div>
      </>
    ),
  },
  {
    value: "verbose",
    label: "Captioned",
    description: (
      <>
        {`Dice will be shown as:`}
        <div className={styles["captioned-dice"]}>
          <div>
            <Dice dice={{ type: "ring", value: { explosion: 1, strife: 1 } }} />
            <TextDice explosion={1} strife={1} />
          </div>
          <div>
            <Dice
              dice={{ type: "skill", value: { opportunity: 1, success: 1 } }}
            />
            <TextDice opportunity={1} success={1} />
          </div>
        </div>
      </>
    ),
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
        <Form.Item name="displayMode" label={`Display mode`}>
          <Radio.Group options={displayOptions} optionType="button" />
        </Form.Item>
        <ExplainOptions options={displayOptions} />
        <Form.Item name="mode" label={`Picking strategy`}>
          <Radio.Group options={behaviorOptions} optionType="button" />
        </Form.Item>
        <ExplainOptions options={behaviorOptions} />
      </Form>
    </AntdModal>
  );
};

export default Modal;
