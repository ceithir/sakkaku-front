import React from "react";
import Reroll from "./result/Reroll";
import Keep from "./result/Keep";
import Resolve from "./result/Resolve";
import { Collapse } from "antd";
import Summary from "./Summary";

const { Panel } = Collapse;

const Complete = ({ dices, button, intent, context, player }) => {
  const { tn, ring, skill, modifiers } = intent;
  const { id, description } = context;

  const voided = modifiers.includes("void");
  const basePool = ring + skill + (voided ? 1 : 0);
  const rerollTypes = context?.roll?.metadata?.rerolls || [];

  return (
    <Collapse defaultActiveKey={["declare", "resolve"]}>
      <Panel header="Declare" key="declare">
        <Summary {...context} {...intent} player={player} />
      </Panel>

      <Panel header="Modify" key="modify" disabled={rerollTypes.length === 0}>
        <Reroll dices={dices} basePool={basePool} rerollTypes={rerollTypes} />
      </Panel>

      <Panel header="Keep" key="keep">
        <Keep dices={dices} basePool={basePool} />
      </Panel>
      <Panel header="Resolve" key="resolve">
        <Resolve
          dices={dices}
          tn={tn}
          button={button}
          id={id}
          description={description}
        />
      </Panel>
    </Collapse>
  );
};

export default Complete;
