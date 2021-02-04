import React from "react";
import { Button, Card, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoading,
  selectError,
  selectRoll,
  create,
  keep,
  reset,
} from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./index.module.css";
import TABLES from "./tables";

const { Text, Paragraph } = Typography;

const Description = ({ first, second }) => {
  const table = "default";

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

const Heritage = () => {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const { dices } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <Button
        type="primary"
        onClick={() => {
          dispatch(create());
        }}
        disabled={loading}
      >
        {`Roll`}
      </Button>
    );
  }

  const Layout = ({ children }) => {
    return (
      <>
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
        {children}
      </>
    );
  };

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <Layout>
        {dices
          .filter(({ status }) => status === "pending")
          .map(({ value }, index) => {
            return (
              <Card>
                <Description first={value} />
                <Button
                  key={index.toString()}
                  onClick={() => dispatch(keep(roll, index))}
                >{`Keep`}</Button>
              </Card>
            );
          })}
      </Layout>
    );
  }

  const [first, second] = dices
    .filter(({ status }) => status === "kept")
    .map(({ value }) => value);

  return (
    <Layout>
      <Description first={first} second={second} />
      <Button
        onClick={() => {
          dispatch(reset());
        }}
      >{`Reroll`}</Button>
    </Layout>
  );
};

export default Heritage;
