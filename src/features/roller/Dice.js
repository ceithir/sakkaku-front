import React from "react";
import { Tooltip, Image } from "antd";
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

const getImage = ({
  type,
  value: { opportunity, strife, success, explosion },
}) => {
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

const valueText = ({ value: { opportunity, strife, success, explosion } }) => {
  return (
    [
      opportunity && `Opportunity: ${opportunity}`,
      success && `Success: ${success}`,
      explosion && `Explosion: ${explosion}`,
      strife && `Strife: ${strife}`,
    ]
      .filter(Boolean)
      .join("; ") || "Blank"
  );
};

const statusText = ({ status, metadata }) => {
  const modifier = metadata?.modifier;
  const rerolled = status === "rerolled";
  const fromReroll = modifier && status !== "rerolled";

  if (rerolled) {
    if (modifier === "adversity") {
      return "Rerolled due to Adversity";
    }
    if (modifier === "distinction") {
      return "Rerolled thanks to Distinction";
    }
  }

  return [
    fromReroll && modifier === "adversity" && "Adversity reroll",
    fromReroll && modifier === "distinction" && "Distinction reroll",
    status === "dropped" && "Dropped",
    status === "kept" && "Kept",
  ]
    .filter(Boolean)
    .join(" – ");
};

const getText = (dice) => {
  return [valueText(dice), statusText(dice)].filter(Boolean).join(" – ");
};

const Dice = ({ dice }) => {
  return (
    <Tooltip title={getText(dice)}>
      <div>
        <Image src={getImage(dice)} alt={valueText(dice)} preview={false} />
      </div>
    </Tooltip>
  );
};

export default Dice;
