import React, { useState } from "react";
import Title from "features/display/Title";
import { Form, Input, Typography, Button } from "antd";
import { parse, cap } from "./formula";
import { postOnServer } from "server";
import DefaultErrorMessage from "DefaultErrorMessage";

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
        {` best`}
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

  return (
    <div>
      {dice.map(({ status, value }, index) => {
        return (
          <Text
            key={index.toString()}
            disabled={status !== "kept"}
            strong={status === "kept"}
          >
            {value}{" "}
          </Text>
        );
      })}
      {!!modifier && modifier > 0 ? ` +${modifier}` : ` ${modifier}`}
      <Text>
        {`Total: `}
        <strong>
          {dice
            .filter(({ status }) => status === "kept")
            .reduce((acc, { value }) => acc + value, 0) + modifier}
        </strong>
      </Text>
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
        }}
        onFinish={({ formula }) => {
          setLoading(true);
          setResult(undefined);
          postOnServer({
            uri: "/public/aeg/l5r/rolls/create",
            body: {
              parameters: { ...cap(parse(formula)) },
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
        {!!parsedFormula ? (
          <TextSummary original={parsedFormula} capped={cap(parsedFormula)} />
        ) : (
          <Text type="secondary">{`Waiting for complete formula…`}</Text>
        )}
        <Button
          type="primary"
          htmlType="submit"
          disabled={!parsedFormula}
          loading={loading}
        >
          {`Roll`}
        </Button>
      </Form>
      {!!result && <Result {...result} />}
    </>
  );
};

export default D10Roller;
