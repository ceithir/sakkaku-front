import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Select,
  Collapse,
  Checkbox,
  Button,
} from "antd";
import styles from "./Intent.module.less";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import { addCampaign, addCharacter } from "../user/reducer";
import { setAnimatedStep, selectHidden } from "../roller/reducer";
import Animate from "rc-animate";
import { DECLARE } from "./Steps";
import DynamicDiceSelector from "./form/DynamicDiceSelector";
import classNames from "classnames";
import AbilityDescription from "./glitter/AbilityDescription";
import ABILITIES, { longname } from "./data/abilities";
import ExplainOptions from "./glitter/ExplainOptions";
import { Strife, Success, Explosion } from "../display/Symbol";
import Dice from "./Dice";
import { ControlOutlined } from "@ant-design/icons";
import UserContext from "./form/UserContext";
import Advanced from "./form/Advanced";

const { Panel } = Collapse;

const defaultRules = [{ required: true, message: "Please fill this field" }];

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
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [school, setSchool] = useState();
  const [skilledAssist, setSkilledAssist] = useState(0);
  const [unskilledAssist, setUnskilledAssist] = useState(0);
  const [commonModifiers, setCommonModifiers] = useState([]);
  const [addkept, setAddkept] = useState([]);
  const [schoolAbility, setSchoolAbility] = useState();
  const [advanced, setAdvanced] = useState(false);
  const [advancedInitialValues, setAdvancedInitialValues] = useState(values);

  if (advanced) {
    return (
      <Advanced
        onFinish={onFinish}
        initialValues={advancedInitialValues}
        onComplete={onComplete}
        className={styles.form}
        cancel={() => setAdvanced(false)}
      />
    );
  }

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const {
      common_modifiers: commonModifiers = [],
      misc = [],
      unskilled_assist: unskilledAssist,
      skilled_assist: skilledAssist,
    } = data;
    const metadata = {};

    let { school } = data;
    let addkept = [];

    if (school === "custom") {
      school = undefined;
      metadata["labels"] = [];

      const { school_ability, school_name } = data;

      if (school_ability === "addkept") {
        addkept = data["addkept"];
        metadata["labels"].push({
          key: "addkept",
          label: `${school_name} School Ability`,
        });
      } else {
        const modifierId = () => {
          if (school_ability === "reroll") {
            return `ruleless`;
          }
          if (school_ability === "alter") {
            return `reasonless`;
          }
          return undefined;
        };
        const modId = modifierId();
        if (modId) {
          misc.push(modId);
          metadata["labels"].push({
            key: modId,
            label: `${school_name} School Ability`,
          });
        }
      }
    }

    const assist = [
      unskilledAssist &&
        `unskilledassist${unskilledAssist.toString().padStart(2, "0")}`,
      skilledAssist &&
        `skilledassist${skilledAssist.toString().padStart(2, "0")}`,
    ].filter(Boolean);

    onFinish({
      ...data,
      modifiers: [...commonModifiers, school, ...assist, ...misc].filter(
        Boolean
      ),
      metadata,
      addkept,
    });
  };

  const extraRingDice =
    (commonModifiers.includes("void") ? 1 : 0) + unskilledAssist;
  const extraSkillDice = (school === "wandering" ? 1 : 0) + skilledAssist;

  const commonModifiersOptions = [
    {
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
      description: (
        <>
          {`When an adversity applies to a task a character is trying to accomplish [...], the character’s player must choose and reroll two dice containing `}
          <Success />
          {` or `}
          <Explosion />
          {` symbols (if results with these symbols in the pool). After resolving the check, if the character failed, they gain 1 Void point. [Core, page 116]`}
        </>
      ),
    },
    {
      value: "compromised",
      label: `Compromised`,
      description: (
        <>
          {`When making a check, a Compromised character cannot keep dice containing `}
          <Strife />
          {` symbols (to a potential minimum of 0 kept dice). [Core, page 30]`}
        </>
      ),
    },
    {
      value: "offering",
      label: "Proper Offerings",
      description: `A shugenja who makes a material offering alongside an invocation may reroll up to 3 rolled dice showing blank results. [Core, page 189]`,
    },
  ];

  const miscOptions = [
    {
      value: "stirring",
      label: "Affected by — Shūji — Stirring the Embers",
      description: `Until the end of the scene, when [chosen Distinction advantage] applies to a check, the target [of Stirring the Embers] may reroll up to three dice (instead of two). [Core, page 219]`,
    },
    {
      value: "2heavens",
      label: "Affected by — School Ability  — Way of the Dragon",
      description: (
        <>
          {`When a [Mirumoto Two-Heavens Adept is] targeted by an Attack check with a melee weapon, [they] may [...] ward or trap. If [they] ward, the attacker must reroll dice containing `}
          <Success />
          {` or `}
          <Explosion />
          {` up to [the Mirumoto] school rank. [Core, page 68]`}
        </>
      ),
    },
  ];

  const customSchoolOptions = [
    {
      value: "reroll",
      label: `Reroll one or more dice (ex: Ikoma Shadow)`,
    },
    {
      value: "alter",
      label: `Alter (change the value) of one or more dice (ex: Kuni Purifier)`,
    },
    {
      value: "addkept",
      label: `Add one or more kept dice set to a particular value (ex: Doji Diplomat)`,
    },
  ];

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
          Object.keys(changedValues).some((name) => ["school"].includes(name))
        ) {
          setSchool(form.getFieldValue("school"));
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
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers", "misc"].includes(name)
          )
        ) {
          form.validateFields(["misc"]);
        }
        if (
          Object.keys(changedValues).some((name) => ["addkept"].includes(name))
        ) {
          setAddkept(form.getFieldValue("addkept"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["school_ability"].includes(name)
          )
        ) {
          const schoolAbility = form.getFieldValue("school_ability");
          setSchoolAbility(schoolAbility);
          if (
            schoolAbility === "addkept" &&
            form.getFieldValue("addkept").length === 0
          ) {
            const addkept = [
              {
                type: "ring",
                value: { opportunity: 1 },
              },
            ];
            form.setFieldsValue({
              addkept,
            });
            setAddkept(addkept);
          }
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers", "addkept"].includes(name)
          )
        ) {
          form.validateFields(["addkept"]);
        }
        if (
          Object.keys(changedValues).some((name) =>
            [
              "ring",
              "skill",
              "tn",
              "campaign",
              "character",
              "description",
            ].includes(name)
          )
        ) {
          setAdvancedInitialValues({
            ring: form.getFieldValue("ring"),
            skill: form.getFieldValue("skill"),
            tn: form.getFieldValue("tn"),
            campaign: form.getFieldValue("campaign"),
            character: form.getFieldValue("character"),
            description: form.getFieldValue("description"),
          });
        }
      }}
    >
      <UserContext />
      <fieldset>
        <Form.Item
          label="Ring"
          name="ring"
          rules={[{ required: true, message: "Please enter your ring value" }]}
          className={classNames({
            [styles.plus]: extraRingDice > 0,
            [styles[`plus-${extraRingDice.toString().padStart(2, "0")}`]]:
              extraRingDice > 0,
          })}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item
          label="Skill"
          name="skill"
          rules={[
            {
              required: true,
              message: "Please enter your skill value (can be zero)",
            },
          ]}
          className={classNames({
            [styles.plus]: extraSkillDice > 0,
            [styles[`plus-${extraSkillDice.toString().padStart(2, "0")}`]]:
              extraSkillDice > 0,
          })}
        >
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Form.Item label="TN" name="tn">
          <InputNumber min={1} />
        </Form.Item>
      </fieldset>
      <Divider />
      <Collapse ghost>
        <Panel header={"Common modifiers"}>
          <Form.Item name="common_modifiers" className={styles.checkboxes}>
            <Checkbox.Group options={commonModifiersOptions} />
          </Form.Item>
          <ExplainOptions options={commonModifiersOptions} />
        </Panel>
        <Panel header={"Assistance"}>
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
        </Panel>
        <Panel header={"School abilities, techniques"}>
          <Form.Item label={`School Ability`} name="school">
            <Select
              showSearch
              allowClear
              options={[
                ...Object.keys(ABILITIES)
                  .map((key) => {
                    return {
                      value: key,
                      label: longname(key),
                    };
                  })
                  .sort(({ label: a }, { label: b }) => a.localeCompare(b)),
                {
                  value: "custom",
                  label: `Any other School — Any other School Ability`,
                },
              ]}
              optionFilterProp="label"
            />
          </Form.Item>
          {school &&
            (school === "custom" ? (
              <div className={styles["custom-school"]}>
                <Form.Item
                  label="School Name"
                  name="school_name"
                  rules={defaultRules}
                >
                  <Input placeholder={`Cat Shinobi`} />
                </Form.Item>
                <Form.Item
                  label={`This School Ability allows you to…`}
                  name="school_ability"
                  initialValue="reroll"
                >
                  <Select options={customSchoolOptions} />
                </Form.Item>
                {schoolAbility === "addkept" && (
                  <>
                    <p className={styles["addkept-summary"]}>
                      {`The following dice will be added as kept dice:`}
                      {addkept.map((dice, i) => {
                        return <Dice key={i.toString()} dice={dice} />;
                      })}
                    </p>
                    <Form.List
                      name="addkept"
                      rules={[
                        {
                          validator: async (_, dices) => {
                            const compromised = form
                              .getFieldValue("common_modifiers")
                              ?.includes("compromised");
                            if (
                              compromised &&
                              dices.some(({ value: { strife = 0 } }) => {
                                return strife >= 1;
                              })
                            ) {
                              return Promise.reject(
                                new Error(
                                  "Cannot add kept dice with strife if compromised."
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
                            defaultValue={{
                              type: "ring",
                              value: { opportunity: 1 },
                            }}
                            errors={errors}
                            buttonText={"Add another die"}
                            add={add}
                            remove={addkept.length > 1 && remove}
                            className={styles.addkept}
                          />
                        );
                      }}
                    </Form.List>
                  </>
                )}
              </div>
            ) : (
              <AbilityDescription ability={school} className={styles.school} />
            ))}
          <Form.Item
            label={"Misc."}
            name="misc"
            rules={[
              {
                validator: async (_, misc) => {
                  if (
                    misc?.includes("stirring") &&
                    !form
                      .getFieldValue("common_modifiers")
                      ?.includes("distinction")
                  ) {
                    return Promise.reject(
                      new Error(
                        "Stirring the Embers has no effect on rolls not already affected by a Distinction."
                      )
                    );
                  }
                },
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder={"Extra options for unusual cases"}
              options={miscOptions}
              optionFilterProp="label"
            />
          </Form.Item>
          <ExplainOptions options={miscOptions} />
        </Panel>
        <Panel header={"Advanced options"}>
          <Form.Item className={styles["advanced-button"]}>
            <Button
              icon={<ControlOutlined />}
              onClick={() => setAdvanced(true)}
            >{`Fully customized roll`}</Button>
          </Form.Item>
          <ExplainOptions
            description={
              <div className={styles["advanced-explanation"]}>
                <span>{`For rolls that just follow their own rules, not much the default ones, and thus require a greater degree of customization. For example:`}</span>
                <ul>
                  <li>{`Rolls modified with previously rolled dice, like Channeling [Core, page 190] or the Kata Striking as Air [Core, page 177].`}</li>
                  <li>{`Rolls without a ring value, like the Center stance of a duel [Core, page 260].`}</li>
                </ul>
                <span>{`This mode can also be used to recreate a previous roll result, then pick different dice. Can be useful if you misread a TN or forgot to trigger a disadvantage for example.`}</span>
              </div>
            }
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
