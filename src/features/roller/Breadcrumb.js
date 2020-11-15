import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

const { Text } = Typography;

const CustomBreadcrumb = ({ campaign, character, description }) => {
  return (
    <Breadcrumb className={styles.container}>
      <Breadcrumb.Item>
        <Link to={`/rolls`}>{"All rolls"}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/rolls?campaign=${campaign}`}>{campaign}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/rolls?campaign=${campaign}&character=${character}`}>
          {character}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item className={styles.description}>
        <Text ellipsis>{description}</Text>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
