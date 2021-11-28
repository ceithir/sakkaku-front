import React, { useState } from "react";
import Title from "features/display/Title";
import { Form, Input, Typography } from "antd";
import { parse, cap } from "./formula";

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

const D10Roller = () => {
  const [parsedFormula, setParsedFormula] = useState();

  return (
    <>
      <Title>{`Legend of the Five Rings – D10 Roll & Keep`}</Title>
      <Form
        onValuesChange={(_, { formula }) => {
          setParsedFormula(parse(formula));
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
      </Form>
    </>
  );
};

export default D10Roller;
