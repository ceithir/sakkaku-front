import React, { useState } from "react";
import Title from "./Title";
import { Form, Input, Typography, Button, InputNumber, Checkbox } from "antd";
import { parse, cap } from "./formula";
import { postOnServer, authentifiedPostOnServer } from "server";
import DefaultErrorMessage from "DefaultErrorMessage";
import styles from "./D10Roller.module.less";
import UserContext from "components/form/UserContext";
import { addCampaign, addCharacter, selectUser } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import RollResult from "./RollResult";
import StandardButtons from "./StandardButtons";
import TextSummary from "./TextSummary";

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
        onFinish={({
          formula,
          tn,
          explosions,
          rerolls,
          campaign,
          character,
          description,
          testMode,
        }) => {
          setLoading(true);
          setResult(undefined);
          setContext(undefined);

          const parameters = {
            ...cap(parse(formula)),
            tn,
            explosions,
            rerolls,
          };
          const metadata = {
            original: formula,
          };
          const error = () => {
            setError(true);
            setLoading(false);
          };

          if (!user || testMode) {
            postOnServer({
              uri: "/public/aeg/l5r/rolls/create",
              body: {
                parameters,
                metadata,
              },
              success: (data) => {
                setResult(data);
                setLoading(false);
              },
              error,
            });
            return;
          }

          authentifiedPostOnServer({
            uri: "/aeg/l5r/rolls/create",
            body: {
              parameters,
              campaign,
              character,
              description,
              metadata,
            },
            success: ({ roll, ...context }) => {
              setResult(roll);
              setContext(context);
              setLoading(false);
            },
            error,
          });

          dispatch(addCampaign(campaign));
          dispatch(addCharacter(character));
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
      {!!result && (
        <div className={styles.result}>
          <RollResult {...result} />
          <div className={styles.buttons}>
            <StandardButtons
              id={context?.id}
              description={context?.description}
              roll={result}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default D10Roller;
