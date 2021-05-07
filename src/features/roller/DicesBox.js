import React from "react";
import Dices from "./Dices";
import { Typography } from "antd";
import styles from "./DicesBox.module.css";

const { Paragraph, Title } = Typography;

const DicesBox = ({ dices, text, footer, theme, title }) => {
  return (
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
  );
};

export default DicesBox;
