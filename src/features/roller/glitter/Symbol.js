import React from "react";
import styles from "./Symbol.module.less";
import strifeImg from "../images/symbols/strife.png";
import successImg from "../images/symbols/success.png";
import explosionImg from "../images/symbols/explosion.png";
import opportunityImg from "../images/symbols/opportunity.png";

const Icon = ({ src, alt }) => {
  return <img src={src} alt={alt} className={styles.image} />;
};

export const Strife = () => {
  return <Icon src={strifeImg} alt={"(Strife)"} />;
};

export const Success = () => {
  return <Icon src={successImg} alt={"(Success)"} />;
};

export const Explosion = () => {
  return <Icon src={explosionImg} alt={"(Explosion)"} />;
};

export const Opportunity = () => {
  return <Icon src={opportunityImg} alt={"(Opportunity)"} />;
};
