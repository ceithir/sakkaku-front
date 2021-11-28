import React, { useState } from "react";
import Title from "features/display/Title";
import { Form, Input, Typography, Button, InputNumber, Checkbox } from "antd";
import { parse, cap } from "./formula";
import { postOnServer } from "server";
import DefaultErrorMessage from "DefaultErrorMessage";
import styles from "./D10Roller.module.less";

const { Text, Paragraph } = Typography;

const TextFormula = ({ roll, keep, modifier }) => {
  return (
    <Text>
      {`${roll}k${keep}`}
      {!!modifier && (modifier > 0 ? `+${modifier}` : modifier)}
    </Text>
  );
};

const TextSummary = ({ original, capped }) => {
  const wasCapped =
    original.roll !== capped.roll ||
    original.keep !== capped.keep ||
    original.modifier !== capped.modifier;

  return (
    <>
      <Paragraph>
        <strong>
          <TextFormula {...original} />
          {wasCapped && (
            <>
              {` ⇒ `}
              <TextFormula {...capped} />
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

const Result = ({ dice, parameters }) => {
  const modifier = parameters.modifier || 0;
  const total =
    dice
      .filter(({ status }) => status === "kept")
      .reduce((acc, { value }) => acc + value, 0) + modifier;
  const tn = parameters.tn;

  return (
    <div className={styles.result}>
      <div>
        <span className={styles.dice}>
          {dice.map(({ status, value }, index) => {
            return (
              <React.Fragment key={index.toString()}>
                <Text disabled={status !== "kept"} strong={status === "kept"}>
                  {value}
                </Text>
                {status === "rerolled" && (
                  <span className={styles["reroll-arrow"]}>{`→`}</span>
                )}
              </React.Fragment>
            );
          })}
        </span>
        {!!modifier && (
          <Text className={styles.modifier}>
            {modifier > 0 ? ` +${modifier}` : ` ${modifier}`}
          </Text>
        )}
      </div>

      <Paragraph className={styles.total}>
        <Text strong={true}>{`Total: `}</Text>
        <Text type={!tn ? "default" : total >= tn ? "success" : "danger"}>
          {total}
        </Text>
        {!!tn && <Text>{` (TN: ${tn})`}</Text>}
      </Paragraph>
    </div>
  );
};

const D10Roller = () => {
  const [parsedFormula, setParsedFormula] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <Title>{`Legend of the Five Rings – D10 Roll & Keep`}</Title>
      <Form
        onValuesChange={(_, { formula }) => {
          setParsedFormula(parse(formula));
          setResult(undefined);
        }}
        onFinish={({ formula, tn, explosions, rerolls }) => {
          setLoading(true);
          setResult(undefined);
          postOnServer({
            uri: "/public/aeg/l5r/rolls/create",
            body: {
              parameters: { ...cap(parse(formula)), tn, explosions, rerolls },
            },
            success: (data) => {
              setResult(data);
              setLoading(false);
            },
            error: () => {
              setError(true);
              setLoading(false);
            },
          });
        }}
        className={styles.form}
        initialValues={{ explosions: [10] }}
      >
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
          tooltip={`Check "1" to apply a 4th edition Emphasis [Core, page 133]`}
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
          <TextSummary original={parsedFormula} capped={cap(parsedFormula)} />
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
      {!!result && <Result {...result} />}
    </>
  );
};

export default D10Roller;
