import React, { useEffect, useState } from "react";
import { Spin, Alert, Table, Typography, Pagination } from "antd";
import { getOnServer } from "../../server";
import Result from "./Result";
import queryString from "query-string";
import styles from "./List.module.css";

const { Text } = Typography;

const columns = [
  {
    title: "Campaign",
    dataIndex: "campaign",
    key: "campaign",
  },
  {
    title: "Character",
    dataIndex: "character",
    key: "character",
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (player) => {
      if (!player) {
        return <Text delete>Deleted account</Text>;
      }

      return <Text>{player.name}</Text>;
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "TN",
    dataIndex: "tn",
    key: "tn",
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
];

const List = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  const page = parseInt(queryString.parse(window.location.search)["page"]) || 1;

  useEffect(() => {
    getOnServer({
      uri: `/public/ffg/l5r/rolls?${queryString.stringify({ page })}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        setLoading(false);
        setError(true);
      },
    });
  }, [page]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return (
      <Alert
        message="Something bad happened. Try reloading the page. If things are still broken, please contact administrator through the link at the bottom of the page."
        type="error"
        banner={true}
      />
    );
  }

  const dataSource = data.items.map(
    ({ id, campaign, character, user, description, result, roll }) => {
      return {
        key: id,
        campaign,
        character,
        player: user,
        description,
        tn: roll.parameters.tn,
        result,
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
            return <a href={pageLink(page - 1)}>{"<"}</a>;
          }
          if (type === "next") {
            return <a href={pageLink(page + 1)}>{">"}</a>;
          }
          return originalElement;
        }}
        onChange={(pageNumber) => {
          window.location = pageLink(pageNumber);
        }}
      />
    </>
  );
};

export default List;
