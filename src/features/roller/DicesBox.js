import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";

const { Paragraph } = Typography;

const DicesBox = ({ dices, text, footer }) => {
  return (
    <Card className="boxed">
      <Paragraph>{text}</Paragraph>
      <Dices dices={dices} />
      {footer}
    </Card>
  );
};

export default DicesBox;
