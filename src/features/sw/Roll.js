import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import Layout from "./Layout";
import ResultBox from "components/aftermath/ResultBox";
import Result from "./Result";

const Roll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/ffg/sw/rolls/${id}`,
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

  const identity = { character, campaign, player };
  const rollSpecificData = [].filter(Boolean);
  const { parameters, dice } = roll;

  return (
    <Layout>
      <ResultBox
        identity={identity}
        description={description}
        rollSpecificData={rollSpecificData}
      >
        <Result parameters={parameters} dice={dice} />
      </ResultBox>
    </Layout>
  );
};

export default Roll;
