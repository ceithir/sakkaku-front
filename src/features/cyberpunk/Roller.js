import React, { useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { postOnServer, authentifiedPostOnServer } from "server";
import { pattern, parse } from "./formula";
import UserContext from "components/form/UserContext";
import { addCampaign, addCharacter } from "features/user/reducer";
import { useDispatch } from "react-redux";
import TextResult from "./TextResult";
import { link, bbMessage } from "./Roll";
import CopyButtons from "components/aftermath/CopyButtons";
import { Link } from "react-router-dom";

const Buttons = ({ id, parameters, description, total }) => {
  return (
    <div className={styles.buttons}>
      <CopyButtons
        link={link(id)}
        bbMessage={bbMessage({ parameters, description, total })}
      />
      <Link disabled={!id} to={`/cyberpunk/rolls/${id}`}>{`Go to page`}</Link>
    </div>
  );
};

const Result = ({ result, context = {} }) => {
  if (!result) {
    return <div className={styles.result}>{`💮`}</div>;
  }

  const { parameters, dice } = result;
  const { id, description } = context;

  return (
    <div className={styles.result}>
      <TextResult parameters={parameters} dice={dice} />
      <Buttons
        id={id}
        description={description}
        parameters={parameters}
        total={dice.reduce((prev, cur) => prev + cur, 0) + parameters.modifier}
      />
    </div>
  );
};

const Roller = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [context, setContext] = useState();

  const dispatch = useDispatch();
  const updateUser = ({ campaign, character }) => {
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
  };

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Form
          onFinish={({ formula, ...values }) => {
            setLoading(true);
            setResult(undefined);
            setContext(undefined);

            const parameters = {
              modifier: parse(formula) || 0,
            };
            const metadata = {
              original: formula,
            };

            const error = () => {
              setError(true);
              setLoading(false);
            };

            const { testMode, campaign, character, description } = values;
            const stateless = testMode || !campaign;

            if (stateless) {
              postOnServer({
                uri: "/public/cyberpunk/rolls/create",
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
              return;
            }

            authentifiedPostOnServer({
              uri: "/cyberpunk/rolls/create",
              body: {
                parameters,
                metadata,
                campaign,
                character,
                description,
              },
              success: ({ roll, ...context }) => {
                setResult(roll);
                setContext(context);
                updateUser({ campaign, character });
                setLoading(false);
              },
              error,
            });
          }}
          className={styles.form}
        >
          <UserContext />
          <div className={styles.formula}>
            <span>{`"1d10"`}</span>
            <span>{` + `}</span>
            <Form.Item
              name="formula"
              rules={[
                {
                  pattern,
                  message: `Unrecognized syntax`,
                },
              ]}
            >
              <Input placeholder={`2+5-3`} autoComplete="off" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {`Roll`}
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <Result result={result} context={context} />
      </div>
    </Layout>
  );
};

export default Roller;
