import React from "react";
import Dices from "./Dices";
import { Typography } from "antd";

const { Paragraph } = Typography;

const Kept = ({ dices, selection }) => {
  return (
    <div>
      <Paragraph>{`You have kept:`}</Paragraph>
      <Dices
        dices={dices.map((dice, index) => {
          const selected = selection.includes(index);
          return {
            ...dice,
            disabled: !selected,
            selected,
          };
        })}
      />
    </div>
  );
};

export default Kept;
