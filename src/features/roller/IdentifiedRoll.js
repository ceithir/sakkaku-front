import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card, Button } from "antd";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Complete from "./Complete";
import Layout from "./Layout";
import Summary from "./Summary";
import DicesBox from "./DicesBox";
import Roller from "./index";

const IdentifiedRoll = ({ user }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getOnServer({
      uri: `/public/ffg/l5r/rolls/${id}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        setLoading(false);
        setError(true);
      },
    });
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  const { roll, user: player, result } = data;
  const { dices, parameters } = roll;

  if (!result && user && player && user.id === player.id) {
    return <Roller user={user} save={data} />;
  }

  return (
    <Layout>
      <Summary player={player} {...data} {...parameters} />
      {result ? (
        <Complete
          dices={dices}
          tn={parameters.tn}
          onClick={() => {
            window.location = "/";
          }}
        />
      ) : (
        <Card>
          <DicesBox
            text={`Check in progress. Current dice pool:`}
            dices={dices.map((dice) => {
              const selected = dice.status === "kept";
              const disabled = !["kept", "pending"].includes(dice.status);
              return {
                ...dice,
                disabled,
                selected,
              };
            })}
          />
          <Button
            onClick={() => {
              !!document.referrer
                ? window.history.back()
                : (window.location = "/rolls");
            }}
          >{`Go back`}</Button>
        </Card>
      )}
    </Layout>
  );
};

export default IdentifiedRoll;
