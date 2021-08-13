import React, { useState } from "react";
import { Form, InputNumber, Typography, Button, Alert } from "antd";
import styles from "./Advanced.module.less";
import { useSelector, useDispatch } from "react-redux";
import { addCampaign, addCharacter } from "features/user/reducer";
import UserContext from "./UserContext";
import classNames from "classnames";
import DynamicDiceSelector from "./DynamicDiceSelector";
import Dice from "../Dice";
import { selectLoading } from "../reducer";

const { Paragraph, Title } = Typography;

const defaultRules = [{ required: true, message: "Please fill this field" }];

const buildDiceList = ({ ring, skill, channeled }) => {
  let list = [];
  for (let i = 0; i < ring; i++) {
    list.push({
      dice: {
        type: "ring",
        value: {},
      },
      className: styles["undefined-ring-die"],
    });
  }
  channeled
    .filter(({ type }) => type === "ring")
    .forEach((dice) => {
      list.push({ dice });
    });
  for (let i = 0; i < skill; i++) {
    list.push({
      dice: { type: "skill", value: {} },
      className: styles["undefined-skill-die"],
    });
  }
  channeled
    .filter(({ type }) => type === "skill")
    .forEach((dice) => {
      list.push({ dice });
    });

  return list;
};

const Advanced = ({
  onFinish,
  initialValues,
  onComplete,
  className,
  cancel,
}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [ring, setRing] = useState(initialValues.ring);
  const [skill, setSkill] = useState(initialValues.skill);
  const [channeled, setChanneled] = useState([]);

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const { ring, skill, channeled = [] } = data;

    onFinish({
      ...data,
      ring: ring + channeled.filter(({ type }) => type === "ring").length,
      skill: skill + channeled.filter(({ type }) => type === "skill").length,
      modifiers: ["unrestricted"],
    });
  };

  const diceList = buildDiceList({ ring, skill, channeled });

  return (
    <Form
      className={classNames(styles.form, { [className]: !!className })}
      initialValues={initialValues}
      onFinish={wrappedOnFinish}
      scrollToFirstError
      form={form}
      onValuesChange={(changedValues) => {
        if (
          Object.keys(changedValues).some((name) => ["ring"].includes(name))
        ) {
          setRing(form.getFieldValue("ring"));
        }
        if (
          Object.keys(changedValues).some((name) => ["skill"].includes(name))
        ) {
          setSkill(form.getFieldValue("skill"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["channeled"].includes(name)
          )
        ) {
          setChanneled(form.getFieldValue("channeled"));
        }
      }}
    >
      <Alert
        message={`With great powers…`}
        description={
          <>
            <p>{`In this mode, the roller will grant you full control. You can roll anything, reroll anything, change any result to any other result, keep everything or nothing…`}</p>
            <p>{`However, this also means you'll have to handle each step of the roll "by hand", without guidance and safeguard.`}</p>
            <p>{`So, for the sake of your GM's sanity, please double-check the rules before proceeding.`}</p>
          </>
        }
        type="warning"
        showIcon
        closable
        className={styles.warning}
      />

      <Title level={2}>{`Fully customized roll`}</Title>

      <UserContext />
      <Form.Item label={`TN`} name="tn">
        <InputNumber min={1} />
      </Form.Item>

      <Title level={3}>{`Parameters`}</Title>
      <Form.Item
        label={`That many ring dice will be rolled`}
        name="ring"
        rules={defaultRules}
      >
        <InputNumber min={0} max={10} />
      </Form.Item>
      <Form.Item
        label={`That many skill dice will be rolled`}
        name="skill"
        rules={defaultRules}
      >
        <InputNumber min={0} max={10} />
      </Form.Item>
      <p>
        {`The following dice will be added to the result, without being randomly rolled but instead set to a specific value: `}
      </p>
      {channeled.length > 0 ? (
        <div className={styles["dice-list"]}>
          {channeled
            .sort(({ type: a }, { type: b }) => a > b)
            .map((dice, index) => {
              return <Dice key={index.toString()} dice={dice} />;
            })}
        </div>
      ) : (
        <Paragraph type="success">{`None at the moment.`}</Paragraph>
      )}
      <Form.List name="channeled">
        {(fields, { add, remove }, { errors }) => {
          return (
            <DynamicDiceSelector
              fields={fields}
              defaultValue={{ type: "skill", value: { success: 1 } }}
              errors={errors}
              buttonText={`Add a die set to a specific value`}
              add={add}
              remove={remove}
              className={styles.channeled}
            />
          );
        }}
      </Form.List>

      <Title level={3}>{`Preview`}</Title>
      {diceList.length > 0 ? (
        <div className={styles["dice-list"]}>
          {diceList.map(({ dice, className }, index) => {
            return (
              <span key={index.toString()} className={className}>
                <Dice dice={dice} />
              </span>
            );
          })}
        </div>
      ) : (
        <Paragraph type="danger">{`You aren't rolling a single die at the moment.`}</Paragraph>
      )}
      <div className={styles.buttons}>
        <Button onClick={cancel}>{`Cancel`}</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={diceList.length === 0}
          loading={loading}
        >
          {`Roll`}
        </Button>
      </div>
    </Form>
  );
};

export default Advanced;