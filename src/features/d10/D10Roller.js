import React, { useState } from "react";
import Title from "./Title";
import { Form, Input, Typography, Button, InputNumber, Checkbox } from "antd";
import { parse } from "./formula";
import DefaultErrorMessage from "DefaultErrorMessage";
import styles from "./D10Roller.module.less";
import UserContext from "components/form/UserContext";
import { selectUser } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import TextSummary from "./TextSummary";
import { prepareFinish } from "./form";
import FormResult from "./FormResult";

const { Paragraph } = Typography;

const initialValues = { explosions: [10], rerolls: [] };

const D10Roller = () => {
  const [parsedFormula, setParsedFormula] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [explosions, setExplosions] = useState(initialValues.explosions);
  const [rerolls, setRerolls] = useState(initialValues.rerolls);
  const [context, setContext] = useState();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div className={styles.background}>
      <Title />
      <Form
        onValuesChange={(_, { formula, explosions, rerolls }) => {
          setParsedFormula(parse(formula));
          setExplosions(explosions);
          setRerolls(rerolls);
          setResult(undefined);
        }}
        onFinish={(values) => {
          const { formula } = values;

          prepareFinish({
            setLoading,
            setResult,
            setContext,
            setError,
            dispatch,
            user,
          })({
            ...values,
            metadata: {
              original: formula,
            },
          });
        }}
        className={classNames(styles.form, {
          [styles["fix-user-switch"]]: !!user,
        })}
        initialValues={initialValues}
      >
        <UserContext />
        <Form.Item
          label={`Your dice pool`}
          name="formula"
          rules={[
            { required: true, message: `Please enter what you wish to roll` },
          ]}
        >
          <Input placeholder={`5k4 +1k0 -5`} />
        </Form.Item>
        <Form.Item label={`TN`} name="tn">
          <InputNumber />
        </Form.Item>
        <Form.Item label={`Dice explode on`} name="explosions">
          <Checkbox.Group
            options={[
              { label: 8, value: 8 },
              { label: 9, value: 9 },
              { label: 10, value: 10 },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={`Reroll (once)`}
          name="rerolls"
          tooltip={`Check "1" to apply a 4th edition Emphasis [see Core, page 133]`}
        >
          <Checkbox.Group
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
          />
        </Form.Item>
        {!!parsedFormula ? (
          <TextSummary
            original={parsedFormula}
            explosions={explosions}
            rerolls={rerolls}
          />
        ) : (
          <Paragraph type="secondary">{`Waiting for complete formula…`}</Paragraph>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!parsedFormula}
            loading={loading}
          >
            {`Roll`}
          </Button>
        </Form.Item>
      </Form>
      <FormResult result={result} context={context} />
    </div>
  );
};

export default D10Roller;
