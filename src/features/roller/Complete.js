import React from "react";
import { Card } from "antd";
import Kept from "./Kept";
import Result from "./Result";
import NextButton from "./NextButton";

const Complete = ({ dices, tn, onClick }) => {
  return (
    <>
      <Kept dices={dices} />
      <Card className="boxed">
        <Result dices={dices} tn={tn} />
        <NextButton onClick={onClick}>New roll</NextButton>
      </Card>
    </>
  );
};

export default Complete;
