import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import CharacterSheet from "features/display/CharacterSheet";
import styles from "./IdentifiedRoll.module.less";
import Description from "features/trinket/Description";
import Layout from "./Layout";
import CopyButtons from "./CopyButtons";
import TextResult from "./TextResult";

const D10IdentifiedRoll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/dnd/rolls/${id}`,
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

  const { character, campaign, user: player, description, roll, result } = data;
  const { parameters, metadata } = roll;
  const { tn } = parameters;

  const organizedData = [
    { label: `Description`, content: <Description>{description}</Description> },
    !!tn && {
      label: `TN`,
      content: tn,
    },
    !!metadata.original && {
      label: `Input`,
      content: metadata.original,
    },
    {
      label: `Result`,
      content: <TextResult {...roll} />,
    },
  ].filter(Boolean);

  return (
    <Layout>
      <div className={styles.container}>
        <CharacterSheet
          identity={{ character, campaign, player }}
          data={organizedData}
        />
        <div className={styles.buttons}>
          <CopyButtons
            id={id}
            total={result.total}
            input={metadata.original}
            description={description}
          />
        </div>
      </div>
    </Layout>
  );
};

export default D10IdentifiedRoll;
