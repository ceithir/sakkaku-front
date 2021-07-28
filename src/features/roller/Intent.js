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
import { Strife, Success, Explosion } from "../display/Symbol";
import Dice from "./Dice";
import backgroundImage from "../../background.jpg";

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
  const [channeled, setChanneled] = useState([]);

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));
    !!data["mode"] && dispatch(setMode(data["mode"]));

    const {
      common_modifiers: commonModifiers = [],
      misc = [],
      unskilled_assist: unskilledAssist,
      skilled_assist: skilledAssist,
    } = data;
    const metadata = {};

    let { school } = data;

    if (school === "custom") {
      school = undefined;
      const modifierId = () => {
        if (data["school_ability"] === "reroll") {
          return `ruleless`;
        }
        if (data["school_ability"] === "alter") {
          return `reasonless`;
        }
        return undefined;
      };
      const modId = modifierId();
      if (modId) {
        misc.push(modId);
        metadata["labels"] = [
          { key: modId, label: `${data["school_name"]} School Ability` },
        ];
      }
    }

    if (misc.includes("ringless")) {
      return onFinish({
        ...data,
        ring: 0,
        tn: null,
        modifiers: [
          ...commonModifiers.filter((x) => x !== "void"),
          ...misc.filter((x) => x !== "ringless"),
          school,
        ].filter(Boolean),
        metadata,
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
      modifiers: [...commonModifiers, school, ...assist, ...misc].filter(
        Boolean
      ),
      metadata,
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
  ].filter(Boolean);

  const miscOptions = [
    {
      value: "offering",
      label: "Invocation — Proper Offerings",
      description: `A shugenja who makes a material offering alongside an invocation may reroll up to 3 rolled dice showing blank results. [Core, page 189]`,
    },
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
    {
      value: "ringless",
      label: "Ringless roll",
      description: `Roll only skill dice. You won't be able to keep (and therefore explode) any die, only to reserve them for later. This is used for a few mechanics like the Center action in a duel. [Core, page 260]`,
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
        if (
          Object.keys(changedValues).some((name) =>
            ["channeled"].includes(name)
          )
        ) {
          setChanneled(form.getFieldValue("channeled"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers", "misc"].includes(name)
          )
        ) {
          form.validateFields(["misc"]);
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
                filterOption={true}
              />
            </Form.Item>
            <Form.Item label="Character" name="character" rules={defaultRules}>
              <AutoComplete
                options={arrayToAutoCompleteOptions(characters)}
                placeholder={"Doji Sakura"}
                filterOption={true}
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
      {channeled.length > 0 && (
        <p className={styles["channeled-summary"]}>
          {`${channeled.length} of these dice won't be rolled but instead set to:`}
          {channeled.map((dice, i) => {
            return <Dice key={i.toString()} dice={dice} />;
          })}
        </p>
      )}
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
              <div
                className={styles["custom-school"]}
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                }}
              >
                <Form.Item
                  label="School Name"
                  name="school_name"
                  rules={defaultRules}
                >
                  <Input placeholder={`Ikoma Shadow`} />
                </Form.Item>
                <Form.Item
                  label={`This School Ability allows you to…`}
                  name="school_ability"
                  initialValue="reroll"
                >
                  <Select
                    options={[
                      {
                        value: "reroll",
                        label: `Reroll one or more dice.`,
                      },
                      {
                        value: "alter",
                        label: `Alter (change the value) of one or more dice.`,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
            ) : (
              <AbilityDescription ability={school} className={styles.school} />
            ))}
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
                  buttonText={"Use Channeled Die"}
                  add={add}
                  remove={remove}
                  className={styles.channel}
                />
              );
            }}
          </Form.List>
          <ExplainOptions
            description={
              <>
                <p>
                  {`When making a check to perform an invocation [...], the character may choose to channel any number of kept dice. Instead of resolving the rest of the check, the character reserves these dice, making sure to keep track of the faces they are showing. The check ends, and the character does not resolve any dice results or effects, including success or failure.`}
                </p>
                <p>
                  {`During the character’s next turn, if they perform an invocation of the same Element, they may tap into their channeled dice. [...] the character rolls one fewer Skill die for each reserved Skill die and one fewer Ring die for each reserved Ring die, then adds the channeled dice to the results (set to the results they were showing when channeled). [Core, page 190]`}
                </p>
              </>
            }
          />
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
