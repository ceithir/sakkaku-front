import React from "react";
import { Spin } from "antd";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <Spin className={styles.loader} size="large" />
    </div>
  );
};

export default Loader;
