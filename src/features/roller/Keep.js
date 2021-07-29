import React from "react";
import NextButton from "./NextButton";
import Result from "./Result";
import { Typography, Form, Button } from "antd";
import ExplosionDices from "./ExplosionDices";
import styles from "./Keep.module.less";
import { useSelector, useDispatch } from "react-redux";
import { selectToKeep, setToKeep, selectHelp } from "./reducer";
import DynamicDiceSelector from "./form/DynamicDiceSelector";
import { FACETS } from "./DiceSideSelector";
import { rolledDicesCount, keptDicesCount } from "./utils";
import classNames from "classnames";

const { Paragraph } = Typography;

const AddKeptDiceForm = ({ dices, onChange, compromised }) => {
  return (
    <Form
      onValuesChange={(_, allValues) => {
        onChange(allValues["dices"]);
      }}
      initialValues={{ dices }}
    >
      <Form.List name="dices">
        {(fields, { add, remove }, { errors }) => {
          return (
            <DynamicDiceSelector
              fields={fields}
              defaultValue={{ type: "ring", value: { opportunity: 1 } }}
              errors={errors}
              buttonText={"Add Kept Die"}
              add={add}
              remove={remove}
              values={dices}
              facets={
                compromised
                  ? FACETS.map((facet) => {
                      if (facet.value.strife > 0) {
                        return { ...facet, disabled: true };
                      }
                      return facet;
                    })
                  : FACETS
              }
            />
          );
        }}
      </Form.List>
    </Form>
  );
};

const Keep = ({
  dices,
  ring,
  skill,
  onFinish,
  tn,
  rerollTypes,
  addkept,
  setAddKept,
  modifiers,
  addReroll,
  addAlteration,
  channel,
}) => {
  const toKeep = useSelector(selectToKeep);
  const dispatch = useDispatch();
  const help = useSelector(selectHelp);

  const compromised = modifiers.includes("compromised");

  const max = keptDicesCount({ ring, modifiers });
  const basePool = rolledDicesCount({ ring, skill, modifiers });

  const keepingExplosions = dices.some((dice) => dice.status === "kept");

  const trulyCompromised =
    compromised &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);

  const showAddKept = addkept?.length && !keepingExplosions;

  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return dispatch(setToKeep(toKeep.filter((i) => i !== index)));
    }
    return dispatch(setToKeep([...toKeep, index]));
  };

  const text = () => {
    if (keepingExplosions) {
      return "Select which explosions you wish to keep (if any).";
    }

    if (trulyCompromised) {
      return "Being compromised, you cannot keep any die with strife… Which, in this very specific case, means you cannot keep any die at all.";
    }

    let defaultText =
      max > 1
        ? `You can keep up to ${max} dice (min 1)`
        : "You must choose one die to keep";

    if (addkept?.length) {
      defaultText += " in top of your added dice";
    }

    defaultText += ".";

    if (compromised) {
      return `${defaultText} However, due to being compromised, you cannot keep any die with strife.`;
    }

    return defaultText;
  };

  const buttonText = () => {
    if (trulyCompromised) {
      return "Continue";
    }

    if (keepingExplosions) {
      if (toKeep.length === 0) {
        return "Don't keep anything else";
      }

      if (toKeep.length === 1) {
        return "Also keep that die";
      }

      return "Also keep these dice";
    }

    if (toKeep.length === 1) {
      return "Keep that die";
    }

    if (toKeep.length === 0) {
      return "Must select at least one die";
    }

    return "Keep these dice";
  };

  const wrapDices = () => {
    const baseDices = dices.map((dice, index) => {
      const { status, value } = dice;
      const selected = status === "kept" || toKeep.includes(index);
      const available = status === "pending" && (!compromised || !value.strife);
      const selectable =
        available && (selected || keepingExplosions || max > toKeep.length);
      const disabled = (() => {
        if (status === "kept") {
          return false;
        }
        if (status !== "pending") {
          return true;
        }
        return !selectable;
      })();
      return {
        ...dice,
        selectable,
        selected,
        disabled,
        toggle: () => toggle(index),
        className: dice.metadata?.source === "addkept" && styles["addkept-die"],
      };
    });

    if (showAddKept) {
      return [
        ...baseDices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "pending",
            metadata: { source: "addkept" },
            selected: true,
            selectable: false,
            className: styles["addkept-die"],
          };
        }),
      ];
    }

    return baseDices;
  };
  const resultDices = () => {
    if (showAddKept) {
      return [
        ...dices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "kept",
          };
        }),
      ];
    }

    return dices;
  };

  return (
    <div className={classNames(styles.layout, { [styles.extended]: help })}>
      <div className={styles.content}>
        <ExplosionDices
          dices={wrapDices()}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
        <Paragraph className={styles.text}>{text()}</Paragraph>
        <Result
          dices={resultDices()}
          tn={tn}
          extra={toKeep}
          className={styles.figures}
          modifiers={rerollTypes}
        />
      </div>
      <NextButton
        onClick={() => {
          if (!keepingExplosions && addkept?.length) {
            onFinish(toKeep, addkept);
            return;
          }

          onFinish(toKeep);
        }}
        disabled={
          !(keepingExplosions || trulyCompromised) && toKeep.length === 0
        }
      >
        {buttonText()}
      </NextButton>
      {!keepingExplosions && (
        <div className={styles["additional-actions"]}>
          <div className={styles.buttons}>
            <Button disabled={!addReroll} onClick={addReroll}>
              {`Reroll some dice`}
            </Button>
            <Button disabled={!addAlteration} onClick={addAlteration}>
              {`Alter some dice`}
            </Button>
            <Button onClick={channel}>{`Channel`}</Button>
          </div>
          <AddKeptDiceForm
            dices={addkept}
            onChange={setAddKept}
            compromised={compromised}
          />
        </div>
      )}
    </div>
  );
};

export default Keep;
