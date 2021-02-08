import React from "react";
import { Typography, Table } from "antd";
import TABLES, { entry } from "./tables";
import { Link } from "react-router-dom";

const { Text } = Typography;

const columns = [
  { title: "Character", dataIndex: "character" },
  {
    title: "Roll",
    dataIndex: "roll",
    render: ({ dices }) => {
      if (!dices.some(({ status }) => status === "pending")) {
        return (
          <>
            {dices
              .filter(({ status }) => status === "kept")
              .map(({ value }) => value)
              .join(" / ")}
          </>
        );
      }
      return (
        <Text type="secondary">
          {dices.map(({ value }) => value).join(" | ")}
        </Text>
      );
    },
  },
  {
    title: "Result",
    dataIndex: "succinct",
    render: ({ name, effect, secondRoll }) => {
      const option =
        typeof effect === "object" &&
        secondRoll &&
        effect.options.find(
          ({ min, max }) => min <= secondRoll && max >= secondRoll
        );

      if (!option) {
        return <Text strong>{name}</Text>;
      }

      return (
        <>
          <Text strong>{name}</Text>
          <>{` / `}</>
          <Text strong>{option.text}</Text>
        </>
      );
    },
  },
  { title: "Ref.", dataIndex: "book", responsive: ["sm"] },
  {
    title: "",
    dataIndex: "link",
    render: ({ uuid }) => {
      return (
        <Link title="Details" to={`/heritage/${uuid}`}>
          {"➥"}
        </Link>
      );
    },
  },
];

const List = ({ rolls }) => {
  return (
    <Table
      columns={columns}
      dataSource={rolls.map((roll) => {
        const { dices, metadata, context, uuid } = roll;
        const key = uuid;
        const [firstRoll, secondRoll] = dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value);
        const { table } = metadata;
        const { name, effect } = entry({ table, firstRoll, secondRoll });

        return {
          key,
          book: TABLES[table]["name"],
          roll: { dices },
          succinct: { name, effect, secondRoll },
          character: context.character || `???`,
          link: { uuid },
        };
      })}
      pagination={false}
    />
  );
};

export default List;
