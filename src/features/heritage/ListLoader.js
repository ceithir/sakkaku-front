import React, { useEffect, useState } from "react";
import { getOnServer } from "../../server";
import queryString from "query-string";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import { useLocation } from "react-router-dom";
import Loader from "../navigation/Loader";
import { selectUser } from "../user/reducer";
import { useSelector } from "react-redux";
import List from "./List";
import Pagination from "../../Pagination";

const ListLoader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const location = useLocation();
  const user = useSelector(selectUser);

  const page = parseInt(queryString.parse(location.search)["page"]) || 1;
  const uri = `/ffg/l5r/heritage-rolls?${queryString.stringify({
    page,
  })}`;

  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    getOnServer({
      uri,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        setError(true);
        setLoading(false);
      },
    });
  }, [user, uri]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const { items, per_page: pageSize, total } = data;

  return (
    <>
      <List
        rolls={items.map(({ uuid, roll: { dices, metadata }, ...context }) => {
          return { uuid, dices, metadata, context };
        })}
      />
      <Pagination pageSize={pageSize} current={page} total={total} />
    </>
  );
};

export default ListLoader;
