import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Loader from "../navigation/Loader";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../user/reducer";
import {
  selectLoading,
  selectError,
  setLoading,
  setError,
  load,
} from "./reducer";
import StaticRoll from "./StaticRoll";
import Roll from "./Roll";

const RollLoader = () => {
  const { uuid } = useParams();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const [data, setData] = useState();

  useEffect(() => {
    dispatch(setLoading(true));
    getOnServer({
      uri: `/public/ffg/l5r/heritage-rolls/${uuid}`,
      success: (data) => {
        setData(data);
        dispatch(setLoading(false));
      },
      error: (e) => {
        dispatch(setLoading(false));
        dispatch(setError(e));
      },
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (user && data.user && user.id === data.user.id) {
      const {
        uuid,
        roll: { dices, metadata },
        ...context
      } = data;
      dispatch(
        load({
          uuid,
          dices: dices,
          metadata: metadata,
          context,
        })
      );
    }
  }, [data, user, dispatch]);

  if (!data) {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <DefaultErrorMessage />;
    }

    return null;
  }

  if (user && data.user && user.id === data.user.id) {
    return <Roll />;
  }

  const { roll } = data;

  return <StaticRoll roll={roll} context={data} />;
};

export default RollLoader;
