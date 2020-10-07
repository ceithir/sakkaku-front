import React from "react";
import { List, Image } from "antd";
import blankRing from "./images/black.png";
import strifeOpportunityRing from "./images/blackot.png";
import strifeSuccessRing from "./images/blackst.png";
import strifeExplosionRing from "./images/blacket.png";
import opportunityRing from "./images/blacko.png";
import successRing from "./images/blacks.png";
import blankSkill from "./images/white.png";
import explosionSkill from "./images/whitee.png";
import explosionStrifeSkill from "./images/whiteet.png";
import opportunitySkill from "./images/whiteo.png";
import successSkill from "./images/whites.png";
import successOpportunitySkill from "./images/whiteso.png";
import successStrifeSkill from "./images/whitest.png";
import styles from "./Dices.module.css";
import classNames from "classnames";

const getImage = ({ type, opportunity, strife, success, explosion }) => {
  if (type === "skill") {
    if (explosion) {
      if (strife) {
        return explosionStrifeSkill;
      }
      return explosionSkill;
    }

    if (success) {
      if (opportunity) {
        return successOpportunitySkill;
      }
      if (strife) {
        return successStrifeSkill;
      }
      return successSkill;
    }

    if (opportunity) {
      return opportunitySkill;
    }

    return blankSkill;
  }

  if (strife) {
    if (explosion) {
      return strifeExplosionRing;
    }
    if (success) {
      return strifeSuccessRing;
    }
    return strifeOpportunityRing;
  }

  if (success) {
    return successRing;
  }
  if (opportunity) {
    return opportunityRing;
  }

  return blankRing;
};
const getText = ({ opportunity, strife, success, explosion }) => {
  return (
    [
      opportunity && `Opportunity: ${opportunity}`,
      success && `Success: ${success}`,
      explosion && `Explosion: ${explosion}`,
      strife && `Strife: ${strife}`,
    ]
      .filter(Boolean)
      .join("; ") || "Nothing"
  );
};

const Dices = ({ dices }) => {
  const listData = dices.map((dice, index) => {
    return {
      key: index.toString(),
      image: getImage(dice),
      text: getText(dice),
      selectable: dice.selectable,
      selected: dice.selected,
      toggle: dice.toggle,
      disabled: dice.disabled,
    };
  });

  return (
    <List
      grid={{ gutter: 0, column: 10 }}
      dataSource={listData}
      renderItem={({
        key,
        image,
        text,
        selectable,
        selected,
        toggle,
        disabled,
      }) => (
        <List.Item
          key={key}
          className={classNames(styles.dice, {
            [styles.selectable]: selectable,
            [styles.selected]: selected,
            [styles.unselectable]: (toggle && !selectable) || disabled,
          })}
          onClick={toggle}
        >
          <Image src={image} alt={text} title={text} preview={false} />
        </List.Item>
      )}
    />
  );
};

export default Dices;
