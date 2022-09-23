import React, { useState, useEffect } from "react";
import styles from "./Draw.module.less";
import { Form, Button, InputNumber, Divider, Radio, Alert, Input } from "antd";
import { postOnServer, authentifiedPostOnServer, getOnServer } from "server";
import Card from "./Card";
import DefaultErrorMessage from "DefaultErrorMessage";
import { addCampaign, addCharacter, selectUser } from "features/user/reducer";
import { useDispatch } from "react-redux";
import UserContext from "components/form/UserContext";
import Layout from "./Layout";
import CopyButtons from "components/aftermath/CopyButtons";
import { link, bbMessage } from "./IdDraw";
import DeckSelect from "./DeckSelect";
import { l } from "./utils";
import SmallDeck from "./SmallDeck";
import { useSelector } from "react-redux";

const onFinishWrapper =
  ({ setResult, setLoading, setError, updateUserData }) =>
  ({ hand, deck, code, ...userData }) => {
    const error = () => {
      setError(true);
      setLoading(false);
    };

    setLoading(true);

    const parameters = { hand, deck, code };
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

const uuidPattern =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const ConfiguredLoader = ({ setPreconfiguredDeck }) => {
  const user = useSelector(selectUser);
  const [loading2, setLoading2] = useState(false);

  if (!user) {
    return (
      <Alert
        description="You need to be logged in to load a preconfigured deck."
        type="warning"
        showIcon
        className={styles["alert-need-log"]}
      />
    );
  }

  return (
    <>
      <Form.Item
        label={`Copy-paste the deck code here`}
        name="code"
        rules={[
          { required: true, message: `Required.` },
          {
            pattern: uuidPattern,
            message: "Invalid code syntax. Typo?",
          },
          () => ({
            validator: async (_, value) => {
              setPreconfiguredDeck(undefined);

              if (!value || !value.match(uuidPattern)) {
                return Promise.resolve();
              }

              let errors = [];

              await getOnServer({
                uri: `/public/cards/decks/${value}`,
                success: (data) => {
                  setPreconfiguredDeck(data.state.current);
                  setLoading2(false);
                },
                error: (err) => {
                  setLoading2(false);
                  if (err.message === "Bad status: 404") {
                    errors.push(`Invalid code.`);
                    return;
                  }
                  errors.push(`Network issue?`);
                },
              });

              if (errors.length) {
                return Promise.error(new Error(errors.join(", ")));
              }
              return Promise.resolve();
            },
            message: `Could not find any deck matching this code. Please try copy-pasting it again.`,
          }),
        ]}
      >
        <Input
          placeholder={`0xx0x000-0x0x-xx00-x00x-x0x0x0xx00xx`}
          disabled={loading2}
        />
      </Form.Item>
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
  const [preconfiguredDeck, setPreconfiguredDeck] = useState();

  useEffect(() => {
    if (!result) {
      return;
    }

    const hand = result.hand;
    const cDeck = result.parameters.deck.cards.filter((n) => !hand.includes(n));

    if (form.getFieldValue("predeck") === "configured") {
      setDeckSize(cDeck.length);
      setCurrentDeck(undefined);
      setPreconfiguredDeck(cDeck);
    }
    if (["new", "current"].includes(form.getFieldValue("predeck"))) {
      setDeckSize(cDeck.length);
      setCurrentDeck(cDeck);
      form.setFieldsValue({
        predeck: "current",
      });
      setDeckSource("current");
    }
  }, [result, form]);
  useEffect(() => {
    if (deckSource === "configured" && !!preconfiguredDeck) {
      setDeckSize(preconfiguredDeck.length);
    }
  }, [deckSource, preconfiguredDeck]);
  useEffect(() => {
    form.validateFields(["hand"]);
  }, [form, deckSize]);

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
    if (predeck === "configured") {
      return {
        ...params,
        deck: preconfiguredDeck,
      };
    }

    if (predeck === "current") {
      return {
        ...params,
        code: undefined,
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
      code: undefined,
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
            if (predeck === "configured") {
              return preconfiguredDeck?.length || 0;
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
              {
                value: "configured",
                label: `Preconfigured deck`,
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
        {deckSource === "configured" && (
          <>
            <ConfiguredLoader setPreconfiguredDeck={setPreconfiguredDeck} />
            {preconfiguredDeck && (
              <div className={styles.preconf}>
                <p>{`Deck found! Cards remaining in deck at the moment:`}</p>
                <SmallDeck cards={preconfiguredDeck} />
              </div>
            )}
          </>
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
