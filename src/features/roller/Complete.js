import React from "react";
import { Card, Button } from "antd";
import Kept from "./Kept";
import Result from "./Result";

const Complete = ({ dices, tn, onClick }) => {
  return (
    <>
      <Kept dices={dices} />
      <Card className="boxed">
        <Result dices={dices} tn={tn} />
        <Button type="primary" onClick={onClick}>
          Reroll
        </Button>
      </Card>
    </>
  );
};

export default Complete;
