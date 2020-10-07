import React from "react";
import Dices from "./Dices";
import { Typography } from "antd";

const { Paragraph } = Typography;

const DicesBox = ({ dices, text, footer }) => {
  return (
    <div>
      <Paragraph>{text}</Paragraph>
      <Dices dices={dices} />
      {footer}
    </div>
  );
};

export default DicesBox;
