import React from "react";
import Reroll from "./result/Reroll";
import Keep from "./result/Keep";
import Resolve from "./result/Resolve";
import { Collapse } from "antd";
import Summary from "./Summary";
import { rolledDicesCount } from "./utils";
import ConfigOpener from "./config/Opener";
import styles from "./Complete.module.less";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "./config/reducer";
import classNames from "classnames";

const { Panel } = Collapse;

const Complete = ({ dices, button, intent, context, player, metadata }) => {
  const displayMode = useSelector(selectDisplayMode);

  const { tn } = intent;
  const { id, description } = context;

  const basePool = rolledDicesCount(intent);
  const rerollTypes = context?.roll?.metadata?.rerolls || [];

  return (
    <Collapse defaultActiveKey={["declare", "resolve"]}>
      <Panel header="Declare" key="declare">
        <Summary {...context} {...intent} player={player} metadata={metadata} />
      </Panel>

      <Panel
        header="Modify"
        key="modify"
        collapsible={rerollTypes.length === 0 ? "disabled" : "header"}
      >
        <Reroll
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
          metadata={metadata}
        />
      </Panel>

      <Panel
        header="Keep"
        key="keep"
        className={classNames({ [styles.extended]: displayMode === "verbose" })}
      >
        <Keep dices={dices} basePool={basePool} rerollTypes={rerollTypes} />
      </Panel>
      <Panel
        header="Resolve"
        key="resolve"
        collapsible="disabled"
        className={classNames({ [styles.extended]: displayMode === "verbose" })}
      >
        <ConfigOpener className={styles["config-opener"]} />
        <Resolve
          dices={dices}
          tn={tn}
          button={button}
          id={id}
          description={description}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
      </Panel>
    </Collapse>
  );
};

export default Complete;
