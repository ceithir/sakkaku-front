import React, { useState } from "react";
import styles from "./Draw.module.less";
import { Form, Button, InputNumber, Radio, Divider, Checkbox } from "antd";
import { postOnServer, authentifiedPostOnServer } from "server";
import Card from "./Card";
import DefaultErrorMessage from "DefaultErrorMessage";
import { addCampaign, addCharacter } from "features/user/reducer";
import { useDispatch } from "react-redux";
import UserContext from "components/form/UserContext";
import Layout from "./Layout";

const l = (n) => [...Array(n).keys()].map((i) => i + 1);

const onFinishWrapper =
  ({ setResult, setLoading, setError, updateUserData }) =>
  ({ hand, deck: deckKey, custom, ...userData }) => {
    const error = () => {
      setError(true);
      setLoading(false);
    };

    setLoading(true);

    const deck = (() => {
      if (deckKey === "custom") {
        return custom;
      }
      return l(deckKey);
    })();

    const parameters = { hand, deck };
    const metadata = {};

    const stateful = userData.campaign && !userData.testMode;
    if (stateful) {
      const { campaign, character, description } = userData;

      authentifiedPostOnServer({
        uri: "/cards/draw",
        body: {
          parameters,
          metadata,
          campaign,
          character,
          description,
        },
        success: ({ roll, ...context }) => {
          setResult(roll);
          updateUserData(context);
          setLoading(false);
        },
        error,
      });
      return;
    }

    postOnServer({
      uri: "/public/cards/draw",
      body: {
        parameters,
        metadata,
      },
      success: (data) => {
        setResult(data);
        setLoading(false);
      },
      error,
    });
  };

const initialValues = {
  deck: 52,
  custom: l(54),
};

const Result = ({ result }) => {
  if (!result) {
    return null;
  }

  const { hand } = result;
  return (
    <>
      <Divider />
      <div className={styles.cards}>
        {hand.map((number, index) => {
          return <Card number={number} key={index.toString()} />;
        })}
      </div>
    </>
  );
};

const CustomForm = () => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deckSize, setDeckSize] = useState(initialValues.deck);
  const [deckType, setDeckType] = useState(initialValues.deck);

  const dispatch = useDispatch();
  const updateUserData = (context) => {
    const { campaign, character } = context;
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
  };

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div className={styles["form-container"]}>
      <Form
        onFinish={onFinishWrapper({
          setResult,
          setLoading,
          setError,
          updateUserData,
        })}
        initialValues={initialValues}
        onValuesChange={(_, { deck, custom = initialValues.custom }) => {
          setDeckType(deck);
          if (deck === "custom") {
            setDeckSize(custom.length);
          } else {
            setDeckSize(deck);
          }
        }}
      >
        <Form.Item className={styles.submit}>
          <UserContext />
          <Form.Item
            label={`Draw that many cards`}
            name="hand"
            rules={[
              { required: true, message: `Please enter a number.` },
              {
                min: 1,
                type: "number",
                message: `Please enter a number greater than zero.`,
              },
              {
                max: deckSize,
                type: "number",
                message: `Not enough cards in deck.`,
              },
            ]}
          >
            <InputNumber min="1" max={deckSize} />
          </Form.Item>
          <Form.Item label={`From that deck`} name="deck">
            <Radio.Group
              options={[
                { value: 52, label: `Standard 52 cards` },
                { value: 54, label: `Standard 52 cards + 2 jokers` },
                {
                  value: "custom",
                  label: `Pick from a specific subset of cards`,
                },
              ]}
            />
          </Form.Item>
          {deckType === "custom" && (
            <Form.Item
              name="custom"
              label={`Unselect the cards you wish to exclude from the deck`}
              className={styles["deck-builder"]}
            >
              <Checkbox.Group>
                {l(54).map((number) => (
                  <Checkbox value={number} key={number.toString()}>
                    <Card number={number} />
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit" loading={loading}>
            {`Draw`}
          </Button>
        </Form.Item>
      </Form>
      <Result result={result} />
    </div>
  );
};

const Draw = () => {
  return (
    <Layout>
      <CustomForm></CustomForm>
    </Layout>
  );
};

export default Draw;
