import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import ResultBox from "components/aftermath/ResultBox";
import Layout from "./Layout";
import Card from "./Card";
import styles from "./IdDraw.module.less";

const IdDraw = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/cards/draws/${id}`,
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

  const { character, campaign, user: player, description } = data;

  const {
    roll: {
      parameters: { deck },
      hand,
    },
  } = data;

  const rollSpecificData = [
    {
      label: `Deck before draw`,
      content: (
        <div className={styles.deck}>
          {deck.map((number, index) => {
            return <Card key={index.toString()} number={number} />;
          })}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
        rollSpecificData={rollSpecificData}
      >
        {hand.map((number, index) => {
          return <Card key={index.toString()} number={number} />;
        })}
      </ResultBox>
    </Layout>
  );
};

export default IdDraw;
