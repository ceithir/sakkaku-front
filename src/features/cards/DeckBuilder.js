import React from "react";
import { Form, Button, Input, Alert } from "antd";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { selectUser } from "features/user/reducer";
import styles from "./DeckBuilder.module.less";
import DeckSelect from "./DeckSelect";
import { l } from "./utils";
import { Link } from "react-router-dom";

const { TextArea } = Input;

const AnonymousUnavailable = () => {
  return (
    <Alert
      showIcon
      closable
      message={`This feature is only available to logged-in users.`}
      type="error"
    />
  );
};

const initialValues = {
  deck: 52,
  custom: l(54),
};

const Explanation = () => {
  return (
    <div className={styles.explanation}>
      <p>{`This feature allows multiple players to keep drawing from the same deck (until it runs out of cards).`}</p>
      <p>{`First, pick the type of deck you wish to use (usually the standard 52 or 52+2 is fine).`}</p>
      <p>
        {`On validation, you'll be handed a unique "secret" code. That code can then be used by anyone you'll give it to (including yourself) in the `}
        <Link to="/draw-cards">{`standard draw form`}</Link>
        {` ("pre-configured deck" option) to draw from that one deck.`}
      </p>
      <p>{`And that's it. You're done. Have fun.`}</p>
    </div>
  );
};

const CustomForm = () => {
  return (
    <Form initialValues={initialValues}>
      <Form.Item
        label={`Description`}
        name="description"
        rules={[{ required: true, message: `Please fill this field.` }]}
      >
        <TextArea
          placeholder={`Some fantasy poker at the tavern on day 5 of that one DnD campaign.`}
        />
      </Form.Item>
      <DeckSelect initialValues={initialValues} />

      <Form.Item className={styles.submit}>
        <Button type="primary" htmlType="submit" name="submit">
          {`Create deck`}
        </Button>
      </Form.Item>
    </Form>
  );
};

const DeckBuilder = () => {
  const user = useSelector(selectUser);

  if (!user) {
    return <AnonymousUnavailable />;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Explanation />
        <CustomForm></CustomForm>
      </div>
    </Layout>
  );
};

export default DeckBuilder;
