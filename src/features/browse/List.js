import React, { useEffect, useState } from "react";
import { Table, Typography, Pagination } from "antd";
import { getOnServer } from "../../server";
import Result from "./Result";
import queryString from "query-string";
import styles from "./List.module.css";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import { Link, useLocation, useHistory } from "react-router-dom";
import Loader from "../navigation/Loader";

const { Text } = Typography;

const columns = [
  {
    title: "Campaign",
    dataIndex: "campaign",
    key: "campaign",
    render: (campaign) => {
      return (
        <Link to={`/rolls?${queryString.stringify({ campaign })}`}>
          {campaign}
        </Link>
      );
    },
  },
  {
    title: "Character",
    dataIndex: "character",
    key: "character",
    render: ({ character, campaign }) => {
      return (
        <Link to={`/rolls?${queryString.stringify({ campaign, character })}`}>
          {character}
        </Link>
      );
    },
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (player) => {
      if (!player) {
        return <Text delete>Deleted account</Text>;
      }

      return (
        <Link to={`/rolls?${queryString.stringify({ player: player.id })}`}>
          {player.name}
        </Link>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: ({ description, id }) => {
      return <Link to={`/rolls/${id}`}>{description}</Link>;
    },
  },
  {
    title: "TN",
    dataIndex: "tn",
    key: "tn",
    align: "center",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    width: 160,
    render: (result) => {
      if (!result) {
        return <Text type="secondary">Ongoing…</Text>;
      }

      return <Result {...result} />;
    },
  },
  {
    title: "Success?",
    dataIndex: "success",
    key: "success",
    align: "center",
    render: ({ result, tn }) => {
      if (!result) {
        return <Text type="secondary">{"/"}</Text>;
      }

      return result.success >= tn ? (
        <Text type="success">{"Yes"}</Text>
      ) : (
        <Text type="danger">{"No"}</Text>
      );
    },
  },
];

const List = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const location = useLocation();
  const history = useHistory();

  const query = queryString.parse(location.search);
  const page = parseInt(query["page"]) || 1;
  const uri = `/public/ffg/l5r/rolls?${queryString.stringify({
    ...query,
    page,
  })}`;

  useEffect(() => {
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
  }, [uri]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const dataSource = data.items.map(
    ({ id, campaign, character, user, description, result, roll }) => {
      const tn = roll.parameters.tn;

      return {
        key: id,
        campaign,
        character: { campaign, character },
        player: user,
        description: { description, id },
        tn,
        result,
        success: { result, tn },
      };
    }
  );

  const pageLink = (pageNumber) => {
    return `/rolls?${queryString.stringify({
      ...queryString.parse(window.location.search),
      page: pageNumber,
    })}`;
  };

  return (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Pagination
        className={styles.pagination}
        simple
        pageSize={data["per_page"]}
        current={page}
        total={data["total"]}
        itemRender={(_, type, originalElement) => {
          if (type === "prev") {
            return <Link to={pageLink(page - 1)}>{"<"}</Link>;
          }
          if (type === "next") {
            return <Link to={pageLink(page + 1)}>{">"}</Link>;
          }
          return originalElement;
        }}
        onChange={(pageNumber) => {
          history.push(pageLink(pageNumber));
        }}
      />
    </>
  );
};

export default List;
