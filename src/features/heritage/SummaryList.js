import React from "react";
import styles from "./SummaryList.module.less";

const SummaryList = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default SummaryList;
