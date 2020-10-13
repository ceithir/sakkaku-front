import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Complete from "./Complete";
import Summary from "./Summary";
import DicesBox from "./DicesBox";
import Roller from "./index";
import Loader from "../navigation/Loader";

const IdentifiedRoll = ({ user }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
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
    return <Loader />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const { roll, user: player, result } = data;
  const { dices, parameters } = roll;

  if (!result && user && player && user.id === player.id) {
    return <Roller user={user} save={data} />;
  }

  return (
    <>
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
          footer={
            <Button
              onClick={() => {
                !!document.referrer
                  ? window.history.back()
                  : (window.location = "/rolls");
              }}
            >{`Go back`}</Button>
          }
        />
      )}
    </>
  );
};

export default IdentifiedRoll;
