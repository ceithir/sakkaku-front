import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";
import TABLES from "./tables";
import Form from "./Form";

const { Text, Paragraph, Title } = Typography;

const Description = ({ first, second, table }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const { name, description, modifier, effect } = TABLES[table]["entries"][
    first - 1
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
                strong={!!second && min <= second && max >= second}
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
      <Paragraph>{`${TABLES[table]["name"]} – ${first} – ${name}`}</Paragraph>
      <Paragraph>{description}</Paragraph>
      <Paragraph>{modifier}</Paragraph>
      <Paragraph>{buildEffect()}</Paragraph>
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Heritage Roll`}</Title>
      <>{children}</>
    </div>
  );
};

const Dices = ({ dices }) => {
  return (
    <Card className={styles["raw-results"]}>
      <Text>{`Dices:`}</Text>
      {dices.map(({ value, status }, index) => {
        return (
          <Text
            disabled={status === "dropped"}
            strong={status === "kept"}
            key={index.toString()}
          >
            {value}
          </Text>
        );
      })}
    </Card>
  );
};

const Heritage = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const { dices, metadata } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <Layout>
        <Form />
      </Layout>
    );
  }

  const { table } = metadata;

  const CompleteLayout = ({ children }) => {
    return (
      <>
        <Dices dices={dices} />
        {children}
      </>
    );
  };

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <CompleteLayout>
        {dices
          .filter(({ status }) => status === "pending")
          .map(({ value }, index) => {
            return (
              <Card key={index.toString()}>
                <Description first={value} table={table} />
                <Button
                  onClick={() => dispatch(keep(roll, index))}
                >{`Keep ${value}`}</Button>
              </Card>
            );
          })}
      </CompleteLayout>
    );
  }

  const [first, second] = dices
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);

  return (
    <CompleteLayout>
      <Description first={first} second={second} table={table} />
      <Button
        onClick={() => {
          dispatch(reset());
        }}
      >{`Reroll`}</Button>
    </CompleteLayout>
  );
};

export default Heritage;
