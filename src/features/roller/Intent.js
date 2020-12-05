import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Divider,
  AutoComplete,
  Select,
} from "antd";
import styles from "./Intent.module.css";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
} from "../user/reducer";
import { setAnimatedStep, selectHidden } from "../roller/reducer";
import Animate from "rc-animate";
import { DECLARE } from "./Steps";

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const defaultRules = [{ required: true, message: "Please fill this field" }];

const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return values.map((value) => {
    return {
      value,
    };
  });
};

const AnimatedIntent = ({ onFinish, values }) => {
  const [completed, setCompleted] = useState(false);
  const dispatch = useDispatch();
  const hidden = useSelector(selectHidden);

  useEffect(() => {
    if (completed) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [completed]);

  const onComplete = () => {
    setCompleted(true);
    dispatch(setAnimatedStep(DECLARE));
  };

  if (hidden) {
    return null;
  }

  return (
    <Animate
      transitionName="fade"
      transitionEnter={false}
      transitionLeave={true}
      showProp="visible"
      onEnd={() => dispatch(setAnimatedStep(null))}
    >
      <Intent
        visible={!completed}
        onComplete={onComplete}
        onFinish={onFinish}
        values={values}
      />
    </Animate>
  );
};

const Intent = ({ onFinish, values, onComplete }) => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const dispatch = useDispatch();

  const wrappedOnFinish = (data) => {
    onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const techniques = data["techniques"] || [];

    onFinish({
      ...data,
      modifiers: [
        data["modifier"],
        data["compromised"] && "compromised",
        data["void"] && "void",
        ...techniques,
      ].filter(Boolean),
    });
  };

  return (
    <Form
      className={`boxed ${styles.form}`}
      {...layout}
      initialValues={values}
      onFinish={wrappedOnFinish}
      scrollToFirstError
    >
      <Form.Item label="Campaign" name="campaign" rules={defaultRules}>
        <AutoComplete
          options={arrayToAutoCompleteOptions(campaigns)}
          placeholder={"The Dead of Winter"}
        />
      </Form.Item>
      <Form.Item label="Character" name="character" rules={defaultRules}>
        <AutoComplete
          options={arrayToAutoCompleteOptions(characters)}
          placeholder={"Doji Sakura"}
        />
      </Form.Item>
      <Form.Item label="TN" name="tn">
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={defaultRules}>
        <TextArea
          placeholder={"Running at the foe! Fire, Fitness, Keen Balance"}
        />
      </Form.Item>
      <Divider />
      <Form.Item label="Ring" name="ring" rules={defaultRules}>
        <InputNumber min={1} max={5} />
      </Form.Item>
      <Form.Item label="Skill" name="skill" rules={defaultRules}>
        <InputNumber min={0} max={5} />
      </Form.Item>
      <Divider />
      <Form.Item label="Void?" name="void" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Advantage / Disadvantage" name="modifier">
        <Radio.Group>
          <Radio.Button value="">None</Radio.Button>
          <Radio.Button value="distinction">Distinction</Radio.Button>
          <Radio.Button value="adversity">Adversity</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Compromised?"
        name="compromised"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item label="Techniques" name="techniques">
        <Select mode="multiple" placeholder="Relevant shūji, kata etc.">
          <Option value="stirring">{"Stirring the Embers"}</Option>
        </Select>
      </Form.Item>
      <Divider />
      <Form.Item {...tailLayout}>
        <NextButton htmlType="submit">Roll</NextButton>
      </Form.Item>
    </Form>
  );
};

export default AnimatedIntent;
