import React, { useState } from "react";
import { Form, InputNumber, Checkbox, Input, Typography } from "antd";
import styles from "./Guided4thEdRoll.module.less";
import { parse } from "./formula";
import TextSummary from "./TextSummary";
import Title from "./Title";

const { Paragraph } = Typography;

const rollType = ({ ring, skill, nonskilled }) => {
  if (ring > 0) {
    if (nonskilled) {
      return "nonskilled";
    }
    if (skill > 0) {
      return "skilled";
    }
    if (skill === 0) {
      return "unskilled";
    }
  }
  return undefined;
};

const baseFormula = ({ ring, skill, nonskilled }) => {
  console.log({ ring, skill, nonskilled });
  const type = rollType({ ring, skill, nonskilled });
  if (!type) {
    return undefined;
  }

  switch (rollType({ ring, skill, nonskilled })) {
    case "skilled":
      return `${ring + skill}k${ring}`;
    case "unskilled":
    case "nonskilled":
      return `${ring}k${ring}`;
    default:
      return undefined;
  }
};

const completeFormula = ({ modifier, ...values }) => {
  const base = baseFormula(values);
  if (!base || !modifier) {
    return base;
  }
  return `${base}${modifier}`;
};

const explosions = (type) => {
  if (type === "unskilled") {
    return [];
  }
  return [10];
};

const Guided4thEdRoll = () => {
  const [type, setType] = useState();
  const [rawFormula, setRawFormula] = useState();

  return (
    <>
      <Title />
      <Form
        onValuesChange={(_, allValues) => {
          setType(rollType(allValues));
          setRawFormula(completeFormula(allValues));
        }}
        className={styles.form}
      >
        <Form.Item
          label={`Ring`}
          name="ring"
          rules={[{ required: true, message: `Please enter a ring value.` }]}
        >
          <InputNumber min="1" max="10" />
        </Form.Item>
        <div className={styles["skilled-or-not"]}>
          <Form.Item
            label={`Skill`}
            name="skill"
            rules={[
              {
                required: true,
                message: `Please enter a skill value (can be zero) or check the next box.`,
              },
            ]}
          >
            <InputNumber min="0" max="10" disabled={type === "nonskilled"} />
          </Form.Item>
          <Form.Item name="nonskilled" valuePropName="checked">
            <Checkbox>{`This is a Ring/Trait Roll.`}</Checkbox>
          </Form.Item>
        </div>
        <Form.Item
          label={`Additional modifier`}
          name="modifier"
          tooltip={`For example, if you've got a school ability granting you +1k1 to that kind of roll, and an advantage offering an additional +1k0, enter either +1k1+1k0 or +2k1.`}
        >
          <Input placeholder={`+1k0`} />
        </Form.Item>
        {!!rawFormula && (
          <>
            {parse(rawFormula) ? (
              <TextSummary
                original={parse(rawFormula)}
                explosions={explosions(type)}
              />
            ) : (
              <Paragraph type="secondary">{`Unrecognized syntax. Is the modifier right?`}</Paragraph>
            )}
          </>
        )}
        {type === "unskilled" && (
          <Paragraph>
            {`This is an `}
            <strong>{`Unskilled Roll`}</strong>
            {`. As per page 80 of the 4th edition core rulebook, dice never explode on that kind of roll, also it cannot benefit from raises (called or free).`}
          </Paragraph>
        )}
      </Form>
    </>
  );
};

export default Guided4thEdRoll;
