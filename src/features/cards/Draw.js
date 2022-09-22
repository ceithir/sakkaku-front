import React, { useState, useEffect } from "react";
import styles from "./Draw.module.less";
import { Form, Button, InputNumber, Divider, Radio } from "antd";
import { postOnServer, authentifiedPostOnServer } from "server";
import Card from "./Card";
import DefaultErrorMessage from "DefaultErrorMessage";
import { addCampaign, addCharacter } from "features/user/reducer";
import { useDispatch } from "react-redux";
import UserContext from "components/form/UserContext";
import Layout from "./Layout";
import CopyButtons from "components/aftermath/CopyButtons";
import { link, bbMessage } from "./IdDraw";
import DeckSelect from "./DeckSelect";
import { l } from "./utils";
import SmallDeck from "./SmallDeck";

const onFinishWrapper =
  ({ setResult, setLoading, setError, updateUserData }) =>
  ({ hand, deck, custom, ...userData }) => {
    const error = () => {
      setError(true);
      setLoading(false);
    };

    setLoading(true);

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
  predeck: "new",
};

const Result = ({ result, context = {} }) => {
  if (!result) {
    return null;
  }

  const { hand } = result;
  const { id, description } = context;

  return (
    <>
      <Divider />
      <div className={styles.cards}>
        {hand.map((number, index) => {
          return <Card number={number} key={index.toString()} />;
        })}
      </div>
      <div className={styles["copy-buttons"]}>
        <CopyButtons
          link={link(id)}
          bbMessage={bbMessage({
            id,
            description,
            hand,
          })}
        />
      </div>
    </>
  );
};

const CustomForm = () => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deckSize, setDeckSize] = useState(initialValues.deck);
  const [deckSource, setDeckSource] = useState(initialValues.predeck);
  const [currentDeck, setCurrentDeck] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!result) {
      return;
    }
    const hand = result.hand;
    const cDeck = result.parameters.deck.cards.filter((n) => !hand.includes(n));
    setCurrentDeck(cDeck);
    form.setFieldsValue({
      predeck: "current",
    });
    setDeckSource("current");
    setDeckSize(cDeck.length);
  }, [result, form]);

  const dispatch = useDispatch();
  const [context, setContext] = useState();
  const updateUserData = (context) => {
    setContext(context);
    const { campaign, character } = context;
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
  };

  if (error) {
    return <DefaultErrorMessage />;
  }

  const prepareValues = ({ deck: deckKey, custom, predeck, ...params }) => {
    if (predeck === "current") {
      return {
        ...params,
        deck: currentDeck,
      };
    }

    const deck = (() => {
      if (deckKey === "custom") {
        return custom;
      }
      return l(deckKey);
    })();

    return {
      ...params,
      deck,
    };
  };

  return (
    <div className={styles["form-container"]}>
      <Form
        onFinish={(values) =>
          onFinishWrapper({
            setResult,
            setLoading,
            setError,
            updateUserData,
          })(prepareValues(values))
        }
        initialValues={initialValues}
        onValuesChange={(
          _,
          {
            deck = initialValues.predeck,
            custom = initialValues.custom,
            predeck,
          }
        ) => {
          const compDeckSize = () => {
            if (predeck === "current") {
              return currentDeck.length;
            }
            if (deck === "custom") {
              return custom.length;
            }
            return deck;
          };
          setDeckSize(compDeckSize());
          setDeckSource(predeck);

          setResult(undefined);
          setContext(undefined);
        }}
        form={form}
      >
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
        <Form.Item
          label={`From`}
          name="predeck"
          rules={[{ required: true, message: `Please fill this field.` }]}
        >
          <Radio.Group
            options={[
              { value: "new", label: `A fresh deck` },
              {
                value: "current",
                label: `Current deck`,
                disabled: !currentDeck,
              },
            ]}
          />
        </Form.Item>
        {deckSource === "new" && <DeckSelect initialValues={initialValues} />}
        {deckSource === "current" && (
          <div className={styles.remaining}>
            <p>{`Cards currently remaining in deck:`}</p>
            <SmallDeck cards={currentDeck} />
          </div>
        )}

        <Form.Item className={styles.submit}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            name="submit"
          >
            {`Draw`}
          </Button>
        </Form.Item>
      </Form>
      <Result result={result} context={context} />
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
