import React from "react";
import { Form, Button, Typography, AutoComplete } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Search.module.less";
import { useSelector } from "react-redux";
import { selectCampaigns, selectCharacters } from "../user/reducer";

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

const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return values.map((value) => {
    return {
      value,
    };
  });
};

const Search = () => {
  const location = useLocation();
  const history = useHistory();

  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);

  const onFinish = (data) => {
    history.push(`/rolls?${queryString.stringify(trim(data))}`);
  };

  const initialValues = queryString.parse(location.search);

  return (
    <div className={styles.container}>
      <Title level={2}>{`Search`}</Title>
      <Form onFinish={onFinish} layout="inline" initialValues={initialValues}>
        <Form.Item label={`Campaign`} name="campaign">
          <AutoComplete options={arrayToAutoCompleteOptions(campaigns)} />
        </Form.Item>
        <Form.Item label={`Character`} name="character">
          <AutoComplete options={arrayToAutoCompleteOptions(characters)} />
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
