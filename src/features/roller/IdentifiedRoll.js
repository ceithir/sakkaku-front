import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "antd";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Complete from "./Complete";
import Summary from "./Summary";
import DicesBox from "./DicesBox";
import Roller from "./index";
import Loader from "../navigation/Loader";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import Breadcrumb from "./Breadcrumb";
import { orderDices } from "./utils";
import styles from "./IdentifiedRoll.module.less";

const GoBackButton = (props) => {
  const history = useHistory();
  return (
    <Button
      onClick={() => {
        history.length > 2 ? history.goBack() : history.push("/rolls");
      }}
      {...props}
    >{`Go back`}</Button>
  );
};

const IdentifiedRoll = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

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
  const { campaign, character, description } = data;

  if (!result && user && player && user.id === player.id) {
    return <Roller save={data} />;
  }

  return (
    <>
      <Breadcrumb
        campaign={campaign}
        character={character}
        description={description}
      />
      {result ? (
        <Complete
          dices={dices}
          button={<GoBackButton />}
          intent={parameters}
          context={data}
          player={player}
        />
      ) : (
        <div className={styles.ongoing}>
          <Summary player={player} {...data} {...parameters} />
          <DicesBox
            text={`Check in progress. Current dice pool:`}
            dices={orderDices(
              dices.filter(({ status }) => ["pending", "kept"].includes(status))
            )}
            footer={<GoBackButton style={{ float: "right" }} />}
          />
        </div>
      )}
    </>
  );
};

export default IdentifiedRoll;
