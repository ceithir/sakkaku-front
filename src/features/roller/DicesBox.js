import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";

const { Paragraph } = Typography;

const DicesBox = ({ dices, text, footer, theme }) => {
  return (
    <Card>
      <div className="boxed">
        {text && <Paragraph>{text}</Paragraph>}
        <Dices dices={dices} theme={theme} />
        {footer && <div>{footer}</div>}
      </div>
    </Card>
  );
};

export default DicesBox;
