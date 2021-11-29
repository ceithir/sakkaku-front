import React, { useState } from "react";
import Title from "./Title";
import { Form, Input, Typography, Button, InputNumber, Checkbox } from "antd";
import { parse, cap, stringify } from "./formula";
import { postOnServer, authentifiedPostOnServer } from "server";
import DefaultErrorMessage from "DefaultErrorMessage";
import styles from "./D10Roller.module.less";
import UserContext from "components/form/UserContext";
import { addCampaign, addCharacter, selectUser } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import RollResult from "./RollResult";

const { Paragraph } = Typography;

const TextSummary = ({ original, capped, explosions, rerolls }) => {
  const wasCapped =
    original.roll !== capped.roll ||
    original.keep !== capped.keep ||
    original.modifier !== capped.modifier;

  return (
    <>
      <Paragraph>
        <strong>
          {stringify(original)}
          {wasCapped && (
            <>
              {` ⇒ `}
              {stringify(capped)}
            </>
          )}
          {`:`}
        </strong>
        {` You will roll `}
        <strong>{capped.roll}</strong>
        {` ten-sided dice, keeping the `}
        <strong>{capped.keep}</strong>
        {` highest values`}
        {!!capped.modifier && (
          <>
            {`, adding `}
            <strong>{capped.modifier}</strong>
            {` to the result`}
          </>
        )}
        {`.`}
        {!!rerolls?.length && (
          <>
            {` Dice that show `}
            <strong>{rerolls.join(", ")}</strong>
            {` after the initial roll will be rerolled (once).`}
          </>
        )}
        {!!explosions?.length && (
          <>
            {` Dice that show `}
            <strong>{explosions.join(", ")}</strong>
            {` will explode (possibly several times).`}
          </>
        )}
      </Paragraph>
      {wasCapped && (
        <Paragraph type="warning">
          {`Note: Your requested roll was altered to obey the `}
          <em>{`The Ten Dice Rule`}</em>
          {` described on page 77 of the 4th edition core book (that rule is mostly consistent with previous editions).`}
        </Paragraph>
      )}
    </>
  );
};

const initialValues = { explosions: [10], rerolls: [] };

const D10Roller = () => {
  const [parsedFormula, setParsedFormula] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [explosions, setExplosions] = useState(initialValues.explosions);
  const [rerolls, setRerolls] = useState(initialValues.rerolls);

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

          const parameters = {
            ...cap(parse(formula)),
            tn,
            explosions,
            rerolls,
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
            },
            success: (data) => {
              setResult(data);
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
            capped={cap(parsedFormula)}
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
      {!!result && <RollResult {...result} className={styles.result} />}
    </div>
  );
};

export default D10Roller;
