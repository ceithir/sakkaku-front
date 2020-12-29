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
  Collapse,
} from "antd";
import styles from "./Intent.module.css";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
  selectUser,
} from "../user/reducer";
import { setAnimatedStep, selectHidden } from "../roller/reducer";
import Animate from "rc-animate";
import { DECLARE } from "./Steps";
import DynamicDiceSelector from "./form/DynamicDiceSelector";

const { TextArea } = Input;
const { Panel } = Collapse;

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
  const [form] = Form.useForm();
  const user = useSelector(selectUser);

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const techniques = data["techniques"] || [];
    const misc = data["misc"] || [];

    onFinish({
      ...data,
      modifiers: [
        data["modifier"],
        data["compromised"] && "compromised",
        data["void"] && "void",
        data["school"],
        ...techniques,
        ...misc,
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
      form={form}
      onValuesChange={(changedValues) => {
        if (
          Object.keys(changedValues).some((name) =>
            ["ring", "skill", "void", "channeled"].includes(name)
          )
        ) {
          form.validateFields(["channeled"]);
        }
      }}
    >
      {!!user && (
        <>
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
          <Form.Item
            label="Description"
            name="description"
            rules={defaultRules}
          >
            <TextArea
              placeholder={"Running at the foe! Fire, Fitness, Keen Balance"}
            />
          </Form.Item>
        </>
      )}
      <Form.Item label="TN" name="tn">
        <InputNumber min={1} />
      </Form.Item>
      <Divider />
      <Form.Item label="Ring" name="ring" rules={defaultRules}>
        <InputNumber min={1} max={5} />
      </Form.Item>
      <Form.Item label="Skill" name="skill" rules={defaultRules}>
        <InputNumber min={0} max={5} />
      </Form.Item>
      <Divider />
      <Form.Item
        label={"Void for +1 Ring die?"}
        name="void"
        valuePropName="checked"
      >
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
      <Divider />
      <Collapse ghost>
        <Panel header={"Schools, techniques, magic…"}>
          <Form.Item label="School Ability" name="school">
            <Select
              showSearch
              allowClear
              options={[
                {
                  value: "deathdealer",
                  label: "Bayushi Deathdealer — Way of the Scorpion",
                },
                {
                  value: "manipulator",
                  label: "Bayushi Manipulator — Weakness Is My Strength",
                },
                {
                  value: "shadow",
                  label: "Ikoma Shadow — Victory before Honor",
                },
                {
                  value: "ishiken",
                  label: "Ishiken Initiate — Way of the Void",
                },
                {
                  value: "sailor",
                  label: "Storm Fleet Sailor — Sailor’s Fortune",
                },
              ]}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item label="Techniques" name="techniques">
            <Select
              mode="multiple"
              placeholder="Relevant shūji, kata, etc."
              options={[
                {
                  value: "stirring",
                  label: "Shūji — Stirring the Embers",
                },
              ]}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.List
            name="channeled"
            rules={[
              {
                validator: async (_, dices) => {
                  if (!dices?.length) {
                    return;
                  }

                  const ring = form.getFieldValue("ring");
                  const skill = form.getFieldValue("skill");
                  const voided = form.getFieldValue("void");

                  if (
                    dices.filter(({ type }) => type === "ring").length >
                    ring + (voided ? 1 : 0)
                  ) {
                    return Promise.reject(
                      new Error(
                        "More channeled ring dice than rolled ring dice"
                      )
                    );
                  }

                  if (
                    dices.filter(({ type }) => type === "skill").length > skill
                  ) {
                    return Promise.reject(
                      new Error(
                        "More channeled skill dice than rolled skill dice"
                      )
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => {
              return (
                <DynamicDiceSelector
                  fields={fields}
                  defaultValue={{ type: "skill", value: { success: 1 } }}
                  errors={errors}
                  labelText={"Channeled Die"}
                  buttonText={"Use Channeled Die"}
                  add={add}
                  remove={remove}
                />
              );
            }}
          </Form.List>
          <Form.Item label={"Misc."} name="misc">
            <Select
              mode="multiple"
              placeholder={"Extra options for unusual cases"}
              options={[
                {
                  value: "ruleless",
                  label: "Manual reroll",
                },
                {
                  value: "reasonless",
                  label: "Manual alteration",
                },
                {
                  value: "ruthless",
                  label: "Manual reroll (from NPCs' or other PCs' effects)",
                },
                {
                  value: "2heavens",
                  label: "Attacking a warding Mirumoto Two-Heavens Adept",
                },
              ]}
              optionFilterProp="label"
            />
          </Form.Item>
        </Panel>
      </Collapse>
      <Divider />
      <Form.Item {...tailLayout}>
        <NextButton htmlType="submit">Roll</NextButton>
      </Form.Item>
    </Form>
  );
};

export default AnimatedIntent;
