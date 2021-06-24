import React from "react";
import styles from "./Result.module.css";
import { Success, Opportunity, Strife } from "../display/Symbol";

const Result = ({ opportunity, success, strife }) => {
  return (
    <span className={styles.result}>
      <Success />
      <span>{`: ${success}, `}</span>
      <Opportunity />
      <span>{`: ${opportunity}, `}</span>
      <Strife />
      <span>{`: ${strife}`}</span>
    </span>
  );
};

export default Result;
