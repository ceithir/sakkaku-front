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
import StandardButtons from "./StandardButtons";
import Description from "features/trinket/Description";

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

  const { character, campaign, user: player, description, roll } = data;
  const { dice, parameters, metadata } = roll;
  const { raises = {} } = metadata;
  const { called = 0, free = 0, burnt = 0 } = raises;
  const { tn } = parameters;
  const originalTn = tn && tn - called * 5 + burnt * 5;

  const organizedData = [
    { label: `Description`, content: <Description>{description}</Description> },
    !!tn && {
      label: `TN`,
      content:
        tn !== originalTn
          ? `${originalTn}${called > 0 ? `+${called}x5` : ""}${
              burnt > 0 ? `-${burnt}x5` : ""
            } → ${tn}`
          : tn,
    },
    !!metadata.original && {
      label: `Input`,
      content: metadata.original,
    },
    !!parameters.explosions?.length && {
      label: `Explode on`,
      content: parameters.explosions.join(", "),
    },
    !!parameters.rerolls?.length && {
      label: `Reroll once on`,
      content: parameters.rerolls.join(", "),
    },
    !!metadata.voided &&
      metadata.voided !== "none" && {
        label: `Void Point Effect`,
        content: metadata.voided === "skill" ? `Phantom rank` : `+1k1`,
      },
    called + free > 0 && {
      label: `Raises`,
      content: (
        <>
          {`${called} Called, ${free} Free (${burnt} spent to reduce TN), Total: `}
          <strong>{called + free - burnt}</strong>
        </>
      ),
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
          <StandardButtons id={id} description={description} roll={roll} />
          <GoBackButton />
        </div>
      </div>
    </div>
  );
};

export default D10IdentifiedRoll;
