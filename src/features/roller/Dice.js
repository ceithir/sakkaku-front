import React from "react";
import { Tooltip, Image } from "antd";
import blankRing from "./images/dice/black.png";
import strifeOpportunityRing from "./images/dice/blackot.png";
import strifeSuccessRing from "./images/dice/blackst.png";
import strifeExplosionRing from "./images/dice/blacket.png";
import opportunityRing from "./images/dice/blacko.png";
import successRing from "./images/dice/blacks.png";
import blankSkill from "./images/dice/white.png";
import explosionSkill from "./images/dice/whitee.png";
import explosionStrifeSkill from "./images/dice/whiteet.png";
import opportunitySkill from "./images/dice/whiteo.png";
import successSkill from "./images/dice/whites.png";
import successOpportunitySkill from "./images/dice/whiteso.png";
import successStrifeSkill from "./images/dice/whitest.png";

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

const getText = ({ value: { opportunity, strife, success, explosion } }) => {
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

const Dice = ({ dice }) => {
  return (
    <Tooltip title={getText(dice)}>
      <div>
        <Image src={getImage(dice)} alt={getText(dice)} preview={false} />
      </div>
    </Tooltip>
  );
};

export default Dice;
