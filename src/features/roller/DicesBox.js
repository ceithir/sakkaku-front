import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";
import styles from "./DicesBox.module.css";

const { Paragraph } = Typography;

const DicesBox = ({ dices, text, footer, theme }) => {
  return (
    <Card bordered={false}>
      <div className="boxed">
        {text && <Paragraph className={styles.text}>{text}</Paragraph>}
        <Dices dices={dices} theme={theme} />
        {footer && <div>{footer}</div>}
      </div>
    </Card>
  );
};

export default DicesBox;
