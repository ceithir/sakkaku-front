import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Checkbox,
  Input,
  Typography,
  Button,
  Radio,
  Divider,
} from "antd";
import styles from "./Guided4thEdRoll.module.less";
import { parse } from "./formula";
import TextSummary from "./TextSummary";
import Title from "./Title";
import UserContext from "components/form/UserContext";
import { selectUser } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import { prepareFinish } from "./form";
import FormResult from "./FormResult";
import DefaultErrorMessage from "DefaultErrorMessage";

const { Paragraph } = Typography;

const rollType = ({ ring, skill, nonskilled, voided }) => {
  if (ring > 0) {
    if (voided === "skill") {
      return "skilled";
    }
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

const baseFormula = (values) => {
  const { ring, skill } = values;

  switch (rollType(values)) {
    case "skilled":
      return `${ring + skill}k${ring}`;
    case "unskilled":
    case "nonskilled":
      return `${ring}k${ring}`;
    default:
      return undefined;
  }
};

const fullModifier = ({ modifier, voided }) => {
  let full = "";
  if (modifier) {
    full += modifier;
  }
  if (voided === "moment") {
    full += "+1k1";
  }
  if (voided === "skill") {
    full += "+1k0";
  }
  return full;
};

const completeFormula = (values) => {
  const base = baseFormula(values);
  const modifier = fullModifier(values);
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

const initialValues = {
  nonskilled: false,
  voided: "none",
};

const Guided4thEdRoll = () => {
  const [type, setType] = useState();
  const [rawFormula, setRawFormula] = useState();
  const [nonskilled, setNonskilled] = useState(initialValues.nonskilled);
  const [skill, setSkill] = useState();

  const [result, setResult] = useState();
  const [context, setContext] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [form] = Form.useForm();
  useEffect(() => {
    if ((skill > 0 || nonskilled) && form.getFieldValue("voided") === "skill") {
      form.setFieldsValue({ voided: "moment" });
      setType(rollType(form.getFieldsValue()));
      setRawFormula(completeFormula(form.getFieldsValue()));
    }
  }, [skill, nonskilled, form]);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <Title />
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, allValues) => {
          setType(rollType(allValues));
          setRawFormula(completeFormula(allValues));
          setNonskilled(allValues.nonskilled);
          setSkill(allValues.skill);
        }}
        className={styles.form}
        onFinish={(values) => {
          return prepareFinish({
            setLoading,
            setResult,
            setContext,
            setError,
            dispatch,
            user,
          })({
            ...values,
            formula: completeFormula(values),
            explosions: explosions(rollType(values)),
          });
        }}
      >
        <UserContext />
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
                message: `Please enter a skill value (can be zero) or check the next box.`,
                required: !nonskilled,
              },
            ]}
          >
            <InputNumber min="0" max="10" disabled={nonskilled} />
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
        <Divider />
        <Form.Item label={`TN`} name="tn">
          <InputNumber />
        </Form.Item>
        <Divider />
        <Form.Item
          name="voided"
          label={`Common Void Point effects`}
          tooltip={`As per core, page 78`}
        >
          <Radio.Group
            options={[
              {
                label: `Spend a Void Point to gain a bonus of +1k1.`,
                value: "moment",
              },
              {
                label: `Spend a Void Point to increase Skill from 0 to 1.`,
                value: "skill",
                disabled: skill > 0 || nonskilled,
              },
              {
                label: `Don't spend a Void Point.`,
                value: "none",
              },
            ]}
          />
        </Form.Item>
        <Divider />
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!parse(rawFormula)}
            loading={loading}
          >
            {`Roll`}
          </Button>
        </Form.Item>
      </Form>
      <FormResult result={result} context={context} />
    </>
  );
};

export default Guided4thEdRoll;
