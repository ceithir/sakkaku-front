import React, { useState } from "react";
import styles from "./Draw.module.less";
import { Breadcrumb, Form, Button, InputNumber, Radio, Divider } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { postOnServer } from "server";
import Card from "./Card";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Breadcrumb separator=">" className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Cards`}</Breadcrumb.Item>
        <Breadcrumb.Item>{`Standard 52-card deck`}</Breadcrumb.Item>
        <Breadcrumb.Item>{`Draw`}</Breadcrumb.Item>
      </Breadcrumb>
      <div>{children}</div>
    </div>
  );
};

const onFinishWrapper =
  (setResult) =>
  ({ hand, deck: deckKey }) => {
    const deck = [...Array(deckKey).keys()].map((i) => i + 1);

    const parameters = { hand, deck };
    const metadata = {};

    postOnServer({
      uri: "/public/cards/draw",
      body: {
        parameters,
        metadata,
      },
      success: (data) => {
        setResult(data);
      },
    });
  };

const initialValues = {
  deck: 52,
};

const CustomForm = () => {
  const [result, setResult] = useState();
  const [deckSize, setDeckSize] = useState(initialValues.deck);

  return (
    <div className={styles["form-container"]}>
      <Form
        onFinish={onFinishWrapper(setResult)}
        initialValues={initialValues}
        onValuesChange={(_, { deck }) => {
          setDeckSize(deck);
        }}
      >
        <Form.Item className={styles.submit}>
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
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {`Draw`}
          </Button>
        </Form.Item>
      </Form>
      {result && (
        <>
          <Divider />
          <div className={styles.cards}>
            {result.hand.map((number) => {
              return <Card number={number} />;
            })}
          </div>
        </>
      )}
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
