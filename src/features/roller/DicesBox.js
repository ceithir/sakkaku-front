import React from "react";
import Dices from "./Dices";
import { Typography, Card } from "antd";

const { Paragraph, Title } = Typography;

const DicesBox = ({ dices, text, footer, title }) => {
  return (
    <Card className="boxed">
      {title && <Title level={3}>{title}</Title>}
      {text && <Paragraph>{text}</Paragraph>}
      <Dices dices={dices} />
      {footer}
    </Card>
  );
};

export default DicesBox;
