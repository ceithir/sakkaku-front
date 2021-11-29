import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getOnServer } from "../../server";
import CheckResult from "./CheckResult";
import queryString from "query-string";
import styles from "./List.module.css";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import { Link, useLocation } from "react-router-dom";
import Loader from "../navigation/Loader";
import Pagination from "../../Pagination";
import HeritageResult from "./HeritageResult";
import heritageTables from "../heritage/data/heritage";
import { CharacterLink, CampaignLink, PlayerLink } from "../navigation/Links";

const { Text } = Typography;

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => {
      return (
        <Text>
          <span>{new Date(date).toLocaleDateString()}</span>
          <span className={styles.time}>
            {" "}
            {new Date(date).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            })}
          </span>
        </Text>
      );
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => {
      return {
        "FFG-L5R": `FFG L5R Check`,
        "FFG-L5R-Heritage": `FFG L5R Heritage`,
        "AEG-L5R": `L5R D10 Roll`,
      }[type];
    },
    responsive: ["md"],
  },
  {
    title: "Campaign",
    dataIndex: "campaign",
    key: "campaign",
    render: (campaign) => {
      return <CampaignLink campaign={campaign} />;
    },
  },
  {
    title: "Character",
    dataIndex: "character",
    key: "character",
    render: ({ character, campaign }) => {
      return <CharacterLink campaign={campaign} character={character} />;
    },
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (player) => {
      return <PlayerLink player={player} />;
    },
    responsive: ["md"],
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    responsive: ["lg"],
    render: ({ description, type, metadata }) => {
      if (!description && type === "FFG-L5R-Heritage") {
        return (
          <Text type="secondary">{heritageTables[metadata?.table]?.name}</Text>
        );
      }

      return description;
    },
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    width: 200,
    render: ({ result, type, metadata }) => {
      if (!result) {
        return <Text type="secondary">{`Ongoing…`}</Text>;
      }

      if (type === "FFG-L5R") {
        return <CheckResult {...result} />;
      }

      if (type === "FFG-L5R-Heritage") {
        return <HeritageResult result={result} metadata={metadata} />;
      }

      if (type === "AEG-L5R") {
        return <strong>{result["total"]}</strong>;
      }

      return null;
    },
    responsive: ["md"],
  },
  {
    title: "Success?",
    dataIndex: "success",
    key: "success",
    align: "center",
    render: ({ type, roll, result }) => {
      if (type === "FFG-L5R" || type === "AEG-L5R") {
        const tn = roll.parameters.tn;

        if (!result) {
          return <Text type="secondary">{"TBD"}</Text>;
        }

        if (!tn) {
          return <Text>{"?"}</Text>;
        }

        const total = result.total || result.success;

        return total >= tn ? (
          <Text type="success">{"Yes"}</Text>
        ) : (
          <Text type="danger">{"No"}</Text>
        );
      }

      return "—";
    },
    responsive: ["md"],
  },
  {
    title: "",
    dataIndex: "see_more",
    key: "see_more",
    render: ({ id, uuid, type }) => {
      const url = (() => {
        if (type === "FFG-L5R") {
          return `/rolls/${id}`;
        }

        if (type === "FFG-L5R-Heritage") {
          return `/heritage/${uuid}`;
        }

        return null;
      })();

      if (!url) {
        return null;
      }

      return (
        <Link title="See more" to={url} className={styles["see-more"]}>
          {"➥"}
        </Link>
      );
    },
  },
];

const List = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const location = useLocation();

  const query = queryString.parse(location.search);
  const page = parseInt(query["page"]) || 1;
  const uri = `/rolls?${queryString.stringify({
    ...query,
    page,
  })}`;

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setLoading(true);
    }, 100);
    getOnServer({
      uri,
      success: (data) => {
        clearTimeout(timeoutID);
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        clearTimeout(timeoutID);
        setError(true);
        setLoading(false);
      },
    });
  }, [uri]);

  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const dataSource = data.items.map(
    ({
      id,
      uuid,
      type,
      created_at,
      campaign,
      character,
      user,
      description,
      result,
      roll,
    }) => {
      const { metadata } = roll;

      return {
        key: id,
        date: created_at,
        campaign,
        character: { campaign, character },
        player: user,
        description: { description, type, metadata },
        result: { result, type, metadata },
        success: { type, roll, result },
        see_more: { id, uuid, type },
        type,
      };
    }
  );

  return (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <div className={styles["blank-filler"]} />
      <Pagination
        pageSize={data["per_page"]}
        current={page}
        total={data["total"]}
      />
    </>
  );
};

export default List;
