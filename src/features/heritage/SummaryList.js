import React from "react";
import styles from "./SummaryList.module.css";

const SummaryList = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default SummaryList;
