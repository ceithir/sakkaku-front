import React from "react";
import { Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectPreviousRolls, load } from "./reducer";
import List from "./List";
import Layout from "./Layout";

const { Title } = Typography;

const LayoutWithPreviousRolls = ({ children, dices }) => {
  const previousRolls = useSelector(selectPreviousRolls);
  const dispatch = useDispatch();

  return (
    <Layout dices={dices}>
      <>{children}</>
      {previousRolls.length > 0 && (
        <>
          <Title level={2}>{`Previous heritage`}</Title>
          <List
            rolls={previousRolls}
            onClick={(data) => dispatch(load(data))}
          />
        </>
      )}
    </Layout>
  );
};

export default LayoutWithPreviousRolls;
