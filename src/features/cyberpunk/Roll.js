import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import ResultBox from "components/aftermath/ResultBox";
import Layout from "./Layout";
import TextResult from "./TextResult";
import styles from "./Roll.module.less";

const Roll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/cyberpunk/rolls/${id}`,
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

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
      >
        <div className={styles.result}>
          <TextResult {...data.roll} />
        </div>
      </ResultBox>
    </Layout>
  );
};

export default Roll;
