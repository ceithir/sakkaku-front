import React from "react";
import { Typography } from "antd";
import TABLES from "./tables";

const { Text, Paragraph } = Typography;

const Description = ({ firstRoll, secondRoll, table }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const { name, description, modifier, effect } = TABLES[table]["entries"][
    firstRoll - 1
  ];

  const buildEffect = () => {
    if (typeof effect === "string") {
      return <Text>{effect}</Text>;
    }

    const { intro, outro, options } = effect;

    return (
      <>
        <Text>{intro}</Text>
        {options.map(({ min, max, text }, index) => {
          return (
            <>
              <Text
                key={min.toString()}
                strong={!!secondRoll && min <= secondRoll && max >= secondRoll}
              >
                {max !== min ? `${min}–${max}: ${text}` : `${min}: ${text}`}
              </Text>
              {index < options.length - 1 && <Text>{`, `}</Text>}
            </>
          );
        })}
        <Text>{outro}</Text>
      </>
    );
  };

  return (
    <>
      <Paragraph>{`${TABLES[table]["name"]} – ${firstRoll} – ${name}`}</Paragraph>
      <Paragraph>{description}</Paragraph>
      <Paragraph>{modifier}</Paragraph>
      <Paragraph>{buildEffect()}</Paragraph>
    </>
  );
};

export default Description;
