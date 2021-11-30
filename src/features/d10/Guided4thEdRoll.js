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

const rerolls = ({ emphasis }) => {
  return emphasis ? [1] : [];
};

const totalTn = ({ base, calledRaises = 0, burnedFreeRaises = 0 }) => {
  if (!base) {
    return base;
  }

  return base + 5 * calledRaises - 5 * burnedFreeRaises;
};

const metadata = (values) => {
  const { voided, calledRaises, freeRaises, burnedFreeRaises } = values;

  return {
    type: rollType(values),
    original: completeFormula(values),
    voided,
    raises: { called: calledRaises, free: freeRaises, burnt: burnedFreeRaises },
  };
};

const initialValues = {
  nonskilled: false,
  voided: "none",
  emphasis: false,
  calledRaises: 0,
  freeRaises: 0,
  burnedFreeRaises: 0,
};

const Guided4thEdRoll = () => {
  const [type, setType] = useState();
  const [rawFormula, setRawFormula] = useState();
  const [nonskilled, setNonskilled] = useState(initialValues.nonskilled);
  const [skill, setSkill] = useState();
  const [emphasis, setEmphasis] = useState(initialValues.emphasis);
  const [tnParameters, setTnParameters] = useState({
    base: undefined,
    ...initialValues,
  });

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
    if (skill === 0 && !nonskilled) {
      form.setFieldsValue({
        calledRaises: 0,
        freeRaises: 0,
        burnedFreeRaises: 0,
      });
      setTnParameters({
        base: form.getFieldValue("tn"),
        calledRaises: 0,
        freeRaises: 0,
        burnedFreeRaises: 0,
      });
    }
    if (nonskilled) {
      setEmphasis(false);
      form.setFieldsValue({
        emphasis: false,
      });
    }
  }, [skill, nonskilled, form]);

  useEffect(() => {
    if (form.getFieldValue("burnedFreeRaises") > tnParameters.freeRaises) {
      form.setFieldsValue({ burnedFreeRaises: tnParameters.freeRaises });
      setTnParameters({
        ...tnParameters,
        burnedFreeRaises: tnParameters.freeRaises,
      });
    }
  }, [form, tnParameters]);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <Title />
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(changedValues, allValues) => {
          setType(rollType(allValues));
          setRawFormula(completeFormula(allValues));
          setNonskilled(allValues.nonskilled);
          setSkill(allValues.skill);
          setEmphasis(allValues.emphasis);
          setTnParameters({
            base: allValues.tn,
            calledRaises: allValues.calledRaises,
            freeRaises: allValues.freeRaises,
            burnedFreeRaises: allValues.burnedFreeRaises,
          });

          if (
            Object.keys(changedValues).some((name) =>
              ["skill", "nonskilled"].includes(name)
            )
          ) {
            form.validateFields(["skill"]);
          }
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
            rerolls: rerolls(values),
            tn: totalTn({ ...values, base: values.tn }),
            metadata: metadata(values),
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
                label: `Don't spend a Void Point for any of these effects.`,
                value: "none",
              },
            ]}
          />
        </Form.Item>
        {type === "skilled" && (
          <>
            <Paragraph>
              {`This is a `}
              <strong>{`Skilled Roll`}</strong>
              {`, and as such it may benefit from an emphasis (see core, page 133).`}
            </Paragraph>
            <Form.Item
              name="emphasis"
              valuePropName="checked"
              tooltip={`As per core, page 133`}
            >
              <Checkbox>{`Apply Emphasis?`}</Checkbox>
            </Form.Item>
          </>
        )}
        {type === "unskilled" && (
          <Paragraph>
            {`This is an `}
            <strong>{`Unskilled Roll`}</strong>
            {`. As per page 80 of the 4th edition core rulebook, dice never explode on that kind of roll, also it cannot benefit from raises (called or free).`}
          </Paragraph>
        )}
        <Divider />
        <Form.Item label={`Base TN`} name="tn">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={`Called Raises`}
          name="calledRaises"
          tooltip={`As a default, you may not call more Raises than your Void Ring (see core page 79).`}
        >
          <InputNumber disabled={type === "unskilled"} min="0" />
        </Form.Item>
        <Form.Item label={`Free Raises`} name="freeRaises">
          <InputNumber disabled={type === "unskilled"} min="0" />
        </Form.Item>
        {tnParameters.freeRaises > 0 && (
          <>
            <Paragraph>{`As per core page 79, you may use any number of your Free Raises to reduce the TN by 5 for each Raise employed that way. This however 'consumes' the Free Raise (it may not be used anymore to grant additional effects to the roll).`}</Paragraph>
            <Form.Item
              label={`Free Raises used to reduce TN`}
              name="burnedFreeRaises"
            >
              <InputNumber
                disabled={type === "unskilled"}
                min="0"
                max={tnParameters.freeRaises}
              />
            </Form.Item>
          </>
        )}
        {!!tnParameters.base &&
          (!!tnParameters.calledRaises || !!tnParameters.burnedFreeRaises) && (
            <Paragraph>
              {`Total TN: `}
              <strong>{totalTn(tnParameters)}</strong>
            </Paragraph>
          )}
        <Divider />
        {!!rawFormula && (
          <>
            {parse(rawFormula) ? (
              <TextSummary
                original={parse(rawFormula)}
                explosions={explosions(type)}
                rerolls={rerolls({ emphasis })}
              />
            ) : (
              <Paragraph type="secondary">{`Unrecognized syntax. Is the modifier right?`}</Paragraph>
            )}
          </>
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
