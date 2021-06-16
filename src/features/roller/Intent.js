import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Divider,
  AutoComplete,
  Select,
  Collapse,
  Checkbox,
  Radio,
} from "antd";
import styles from "./Intent.module.less";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
  selectUser,
} from "../user/reducer";
import { setMode } from "./reducer";
import { setAnimatedStep, selectHidden } from "../roller/reducer";
import Animate from "rc-animate";
import { DECLARE } from "./Steps";
import DynamicDiceSelector from "./form/DynamicDiceSelector";
import classNames from "classnames";
import AbilityDescription from "./glitter/AbilityDescription";
import ABILITIES, { longname } from "./data/abilities";
import ExplainOptions from "./glitter/ExplainOptions";

const { TextArea } = Input;
const { Panel } = Collapse;

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
  const [school, setSchool] = useState();
  const [ringless, setRingless] = useState(false);
  const [skilledAssist, setSkilledAssist] = useState(0);
  const [unskilledAssist, setUnskilledAssist] = useState(0);
  const [commonModifiers, setCommonModifiers] = useState([]);

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));
    !!data["mode"] && dispatch(setMode(data["mode"]));

    const {
      common_modifiers: commonModifiers = [],
      school,
      techniques = [],
      misc = [],
      unskilled_assist: unskilledAssist,
      skilled_assist: skilledAssist,
    } = data;

    if (misc.includes("ringless")) {
      return onFinish({
        ...data,
        ring: 0,
        tn: null,
        modifiers: [
          ...commonModifiers.filter((x) => x !== "void"),
          ...misc.filter((x) => x !== "ringless"),
          school,
          ...techniques,
        ].filter(Boolean),
      });
    }

    const assist = [
      unskilledAssist &&
        `unskilledassist${unskilledAssist.toString().padStart(2, "0")}`,
      skilledAssist &&
        `skilledassist${skilledAssist.toString().padStart(2, "0")}`,
    ].filter(Boolean);

    onFinish({
      ...data,
      modifiers: [
        ...commonModifiers,
        school,
        ...assist,
        ...techniques,
        ...misc,
      ].filter(Boolean),
    });
  };

  const extraRingDice =
    (commonModifiers.includes("void") ? 1 : 0) + unskilledAssist;
  const extraSkillDice = (school === "wandering" ? 1 : 0) + skilledAssist;

  const commonModifiersOptions = [
    !ringless && {
      value: "void",
      label: `Seize the Moment`,
      description: `A character may spend 1 Void point to roll one additional Ring die and subsequently keep one additional die. [Core, page 36]`,
    },
    {
      value: "distinction",
      label: `Distinction`,
      disabled: commonModifiers.includes("adversity"),
      description: `Each distinction has a [...] standardized mechanical effect, which applies in the circumstances described in the distinction’s entry and allows the character to reroll up to two dice. [Core, page 99]`,
    },
    {
      value: "adversity",
      label: `Adversity`,
      disabled: commonModifiers.includes("distinction"),
      description: `When an adversity applies to a task a character is trying to accomplish [...], the character’s player must choose and reroll two dice containing (Success) or (Explosion) symbols (if results with these symbols in the pool). After resolving the check, if the character failed, they gain 1 Void point. [Core, page 116]`,
    },
    {
      value: "compromised",
      label: `Compromised`,
      description: `When making a check, a Compromised character cannot keep dice containing (Strife) symbols (to a potential minimum of 0 kept dice). [Core, page 30]`,
    },
  ].filter(Boolean);

  return (
    <Form
      className={styles.form}
      layout="vertical"
      initialValues={values}
      onFinish={wrappedOnFinish}
      scrollToFirstError
      form={form}
      onValuesChange={(changedValues) => {
        if (
          Object.keys(changedValues).some((name) =>
            [
              "ring",
              "skill",
              "common_modifiers",
              "channeled",
              "school",
              "skilled_assist",
              "unskilled_assist",
              "misc",
            ].includes(name)
          )
        ) {
          form.validateFields(["channeled"]);
        }
        if (
          Object.keys(changedValues).some((name) => ["school"].includes(name))
        ) {
          setSchool(form.getFieldValue("school"));
        }
        if (
          Object.keys(changedValues).some((name) => ["misc"].includes(name))
        ) {
          setRingless(form.getFieldValue("misc").includes("ringless"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["unskilled_assist"].includes(name)
          )
        ) {
          setUnskilledAssist(form.getFieldValue("unskilled_assist"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["skilled_assist"].includes(name)
          )
        ) {
          setSkilledAssist(form.getFieldValue("skilled_assist"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers"].includes(name)
          )
        ) {
          setCommonModifiers(form.getFieldValue("common_modifiers"));
        }
      }}
    >
      {!!user && (
        <>
          <fieldset>
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
          </fieldset>
          <Form.Item
            label="Description"
            name="description"
            rules={defaultRules}
          >
            <TextArea
              placeholder={"Running at the foe! Fire, Fitness, Keen Balance"}
            />
          </Form.Item>
          <Divider />
        </>
      )}
      <fieldset>
        {!ringless && (
          <Form.Item
            label="Ring"
            name="ring"
            rules={defaultRules}
            className={classNames({
              [styles.plus]: extraRingDice > 0,
              [styles[`plus-${extraRingDice.toString().padStart(2, "0")}`]]:
                extraRingDice > 0,
            })}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
        )}
        <Form.Item
          label="Skill"
          name="skill"
          rules={defaultRules}
          className={classNames({
            [styles.plus]: extraSkillDice > 0,
            [styles[`plus-${extraSkillDice.toString().padStart(2, "0")}`]]:
              extraSkillDice > 0,
          })}
        >
          <InputNumber min={0} max={10} />
        </Form.Item>
        {!ringless && (
          <Form.Item label="TN" name="tn">
            <InputNumber min={1} />
          </Form.Item>
        )}
      </fieldset>
      <Divider />
      <Collapse ghost>
        <Panel header={"Common modifiers"}>
          <Form.Item name="common_modifiers" className={styles.checkboxes}>
            <Checkbox.Group options={commonModifiersOptions} />
          </Form.Item>
          <ExplainOptions options={commonModifiersOptions} />
          {!ringless && (
            <>
              <fieldset className={styles["assist-container"]}>
                <Form.Item
                  label="Assistance (unskilled)"
                  name="unskilled_assist"
                  initialValue={0}
                >
                  <InputNumber min={0} max={10} />
                </Form.Item>
                <Form.Item
                  label="Assistance (skilled)"
                  name="skilled_assist"
                  initialValue={0}
                >
                  <InputNumber min={0} max={10} />
                </Form.Item>
              </fieldset>
              <ExplainOptions
                description={`If a character making a check receives assistance from one or more others, the character making the check rolls one additional Skill die per [skilled assistant], and one additional Ring die per [unskilled assistant]. Then [...] a character making a check with assistance may keep up to 1 additional die per assisting character. [Core, page 26]`}
                options={[
                  {
                    label: `Assistance (unskilled)`,
                    description: `Number of assisting characters who have 0 ranks in the skill in use.`,
                  },
                  {
                    label: `Assistance (skilled)`,
                    description: `Number of assisting characters who have 1 or more ranks of the skill in use.`,
                  },
                ]}
              />
            </>
          )}
        </Panel>
      </Collapse>
      <Divider />
      <Collapse ghost>
        <Panel header={"Schools, techniques, magic…"}>
          <Form.Item label="School Ability" name="school">
            <Select
              showSearch
              allowClear
              options={Object.keys(ABILITIES)
                .map((key) => {
                  return {
                    value: key,
                    label: longname(key),
                  };
                })
                .sort(({ label: a }, { label: b }) => b < a)}
              optionFilterProp="label"
            />
          </Form.Item>
          {school && (
            <AbilityDescription ability={school} className={styles.school} />
          )}
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
                  const voided = (
                    form.getFieldValue("common_modifiers") || []
                  ).includes("void");
                  const school = form.getFieldValue("school");
                  const skilledAssist =
                    form.getFieldValue("skilled_assist") || 0;
                  const unskilledAssist =
                    form.getFieldValue("unskilled_assist") || 0;
                  const misc = form.getFieldValue("misc") || [];

                  if (
                    dices.filter(({ type }) => type === "ring").length >
                    ring + (voided ? 1 : 0) + unskilledAssist
                  ) {
                    return Promise.reject(
                      new Error(
                        "More channeled ring dice than rolled ring dice"
                      )
                    );
                  }

                  if (
                    dices.filter(({ type }) => type === "skill").length >
                    skill + (school === "wandering" ? 1 : 0) + skilledAssist
                  ) {
                    return Promise.reject(
                      new Error(
                        "More channeled skill dice than rolled skill dice"
                      )
                    );
                  }

                  if (misc.includes("ringless")) {
                    if (dices.some(({ type }) => type === "ring")) {
                      return Promise.reject(
                        new Error(
                          "Cannot channel ring dice for a ringless roll"
                        )
                      );
                    }
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
                  className={styles.channel}
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
                  value: "2heavens",
                  label: "Attacking a warding Mirumoto Two-Heavens Adept",
                },
                {
                  value: "ringless",
                  label: "Ringless roll (ex: Center Duel Action)",
                },
              ]}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="mode" label={`Roller behavior`}>
            <Radio.Group
              options={[
                { label: "Semi-automatic", value: "semiauto" },
                { label: "Manual", value: "manual" },
              ]}
              optionType="button"
            />
          </Form.Item>
          <ExplainOptions
            options={[
              {
                label: `Semi-automatic`,
                description: `The roller will try to preselect the best dice to reroll/keep.`,
              },
              {
                label: `Manual`,
                description: `All dice must be picked by hand.`,
              },
            ]}
          />
        </Panel>
      </Collapse>
      <Divider />
      <Form.Item>
        <NextButton htmlType="submit">{`Roll`}</NextButton>
      </Form.Item>
    </Form>
  );
};

export default AnimatedIntent;
