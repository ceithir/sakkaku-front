import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";
import styles from "./DicesBox.module.css";

const { Paragraph, Title } = Typography;

const DicesBox = ({ dices, text, footer, theme, title }) => {
  return (
    <Card bordered={false}>
      <div className="boxed">
        {title && (
          <Title level={3} className={styles.title}>
            {title}
          </Title>
        )}
        {text && <Paragraph className={styles.text}>{text}</Paragraph>}
        <Dices dices={dices} theme={theme} />
        {footer && <div>{footer}</div>}
      </div>
    </Card>
  );
};

export default DicesBox;
