import React from "react";

const TextResult = ({ parameters, dice }) => {
  const modifier = parameters.modifier;
  const textModifier =
    !!modifier && (modifier > 0 ? `+${modifier}` : `${modifier}`);
  const total = dice.reduce((prev, cur) => prev + cur, 0) + modifier;

  if (!modifier && dice.length === 1) {
    return (
      <>
        {`"1d10" ⇒ `}
        <strong>{total}</strong>
      </>
    );
  }

  return (
    <>
      {`"1d10"`}
      {textModifier}
      {` ⇒ ${dice.join("+").replace("+-", "-")}`}
      {textModifier}
      {` ⇒ `}
      <strong>{total}</strong>
    </>
  );
};

export default TextResult;
