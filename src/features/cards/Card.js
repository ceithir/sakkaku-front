import React from "react";

const baseUrl = "/media/cards/french";

const cardName = (number) => {
  if (number === 53) {
    return `Black Joker`;
  }
  if (number === 54) {
    return `Red Joker`;
  }

  const suits = {
    0: `Clubs`,
    1: `Diamonds`,
    2: `Hearts`,
    3: `Spades`,
  };
  const suit = suits[Math.floor((number - 1) / 13)];

  const values = {
    0: `Ace`,
    1: `Two`,
    2: `Three`,
    3: `Four`,
    4: `Five`,
    5: `Six`,
    6: `Seven`,
    7: `Eight`,
    8: `Nine`,
    9: `Ten`,
    10: `Jack`,
    11: `Queen`,
    12: `King`,
  };
  const value = values[(number - 1) % 13];

  return `${value} of ${suit}`;
};

const Card = ({ number, size = 60 }) => {
  const text = cardName(number);

  return (
    <img
      src={`${baseUrl}/${number.toString().padStart(2, "0")}-${size}.png`}
      alt={text}
      title={text}
    />
  );
};

export default Card;
