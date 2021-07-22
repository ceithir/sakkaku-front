import React from "react";
import { Form, Input, Button, Typography } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Search.module.less";

const { Title } = Typography;

const trim = (obj) => {
  let newObj = {};
  for (const key in obj) {
    if (obj[key] && obj[key].trim()) {
      newObj[key] = obj[key].trim();
    }
  }
  return newObj;
};

const Search = () => {
  const location = useLocation();
  const history = useHistory();

  const onFinish = (data) => {
    history.push(`/rolls?${queryString.stringify(trim(data))}`);
  };

  const initialValues = queryString.parse(location.search);

  return (
    <div className={styles.container}>
      <Title level={2}>{`Search`}</Title>
      <Form onFinish={onFinish} layout="inline" initialValues={initialValues}>
        <Form.Item label={`Campaign`} name="campaign">
          <Input />
        </Form.Item>
        <Form.Item label={`Character`} name="character">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {`Submit`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Search;
