import React from "react";
import { Typography, Table, Button } from "antd";
import TABLES from "./tables";

const { Text } = Typography;

const columns = [
  { title: "Book", dataIndex: "book" },
  { title: "Roll", dataIndex: "roll" },
  {
    title: "Result",
    dataIndex: "result",
    render: ({ name, description }) => (
      <>
        <Text strong>{`${name}: `}</Text>
        <>{description}</>
      </>
    ),
  },
  { title: "Modifiers", dataIndex: "modifier" },
  {
    title: "Other effects",
    dataIndex: "other",
    render: ({ effect, roll }) => {
      if (typeof effect === "string") {
        return <>{effect}</>;
      }

      const { intro, outro, options } = effect;

      return (
        <>
          <>{intro}</>
          {options.map(({ min, max, text }, index) => {
            return (
              <React.Fragment key={min.toString()}>
                <Text strong={!!roll && min <= roll && max >= roll}>
                  {max !== min ? `${min}–${max}: ${text}` : `${min}: ${text}`}
                </Text>
                {index < options.length - 1 && <>{`, `}</>}
              </React.Fragment>
            );
          })}
          <>{outro}</>
        </>
      );
    },
  },
];

const dataSource = ({ table, rolls }) =>
  rolls.map(({ dices, action, uuid }, index) => {
    const [firstRoll, secondRoll] = dices;
    const { name, description, modifier, effect } = TABLES[table]["entries"][
      firstRoll - 1
    ];

    return {
      key: uuid || index.toString(),
      book: TABLES[table]["name"],
      roll: [firstRoll, secondRoll].filter(Boolean).join(", "),
      result: { name, description },
      modifier,
      other: { effect, roll: secondRoll },
      action,
    };
  });

const CustomTable = ({ table, rolls }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const showAction = rolls.some(({ action }) => !!action);

  const col = showAction
    ? [
        ...columns,
        {
          title: "Action",
          dataIndex: "action",
          render: (action) => {
            if (!action) {
              return "/";
            }

            const { text, onClick } = action;

            return <Button onClick={onClick}>{text}</Button>;
          },
        },
      ]
    : columns;

  return (
    <Table
      columns={col}
      dataSource={dataSource({ table, rolls })}
      pagination={false}
    />
  );
};

export default CustomTable;
