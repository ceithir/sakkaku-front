import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import RollResult from "./RollResult";
import CharacterSheet from "features/display/CharacterSheet";
import styles from "./D10IdentifiedRoll.module.less";
import Title from "./Title";
import GoBackButton from "features/browse/GoBackButton";

const D10IdentifiedRoll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/aeg/l5r/rolls/${id}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: () => {
        setError(true);
        setLoading(false);
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

  const { dice, parameters, metadata } = data.roll;
  const { character, campaign, user: player, description } = data;

  const organizedData = [
    { label: `Description`, content: description },
    !!metadata.original && {
      label: `Input`,
      content: metadata.original,
    },
    {
      label: `Roll`,
      content: <RollResult dice={dice} parameters={parameters} />,
    },
  ].filter(Boolean);

  return (
    <div className={styles.background}>
      <Title />
      <div className={styles.container}>
        <div className={styles.context}>
          <CharacterSheet
            identity={{ character, campaign, player }}
            data={organizedData}
          />
        </div>

        <div className={styles.buttons}>
          <GoBackButton />
        </div>
      </div>
    </div>
  );
};

export default D10IdentifiedRoll;
