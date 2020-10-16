import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";
import styles from "./DicesBox.module.css";

const { Paragraph, Title } = Typography;

const DicesBox = ({ dices, text, footer, title, theme }) => {
  return (
    <Card className="boxed">
      {title && <Title level={3}>{title}</Title>}
      {text && <Paragraph>{text}</Paragraph>}
      <Dices dices={dices} theme={theme} />
      {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
  );
};

export default DicesBox;
