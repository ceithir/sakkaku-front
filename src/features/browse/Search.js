import React, { useEffect, useState } from "react";
import { Form, Button, Typography, AutoComplete, Select, Collapse } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Search.module.less";
import { useSelector } from "react-redux";
import { selectCampaigns, selectCharacters } from "../user/reducer";

const { Title } = Typography;
const { Panel } = Collapse;

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

const StaticSearch = ({
  onFinish,
  campaigns,
  characters,
  form,
  activeKeys,
  setActiveKeys,
}) => {
  return (
    <div className={styles.container}>
      <Title level={2}>{`Search`}</Title>
      <Form onFinish={onFinish} form={form}>
        <fieldset>
          <Form.Item label={`Campaign`} name="campaign">
            <AutoComplete
              options={arrayToAutoCompleteOptions(campaigns)}
              allowClear={true}
            />
          </Form.Item>
          <Form.Item label={`Character`} name="character">
            <AutoComplete
              options={arrayToAutoCompleteOptions(characters)}
              allowClear={true}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {`Submit`}
            </Button>
          </Form.Item>
        </fieldset>
        <Collapse ghost activeKey={activeKeys} onChange={setActiveKeys}>
          <Panel header="Advanced" key="1">
            <fieldset>
              <Form.Item label={`Type`} name="type">
                <Select
                  options={[
                    { value: "FFG-L5R", label: `FFG L5R Check` },
                    { value: "FFG-L5R-Heritage", label: `FFG L5R Heritage` },
                  ]}
                  allowClear={true}
                />
              </Form.Item>
            </fieldset>
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

const LocationSearch = (props) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    const { character, campaign, type } = queryString.parse(location.search);
    form.setFieldsValue({ character, campaign, type });
    !!type && setActiveKeys(["1"]);
  }, [form, location, setActiveKeys]);

  return (
    <StaticSearch
      form={form}
      activeKeys={activeKeys}
      setActiveKeys={setActiveKeys}
      {...props}
    />
  );
};

const Search = () => {
  const history = useHistory();

  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);

  const onFinish = (data) => {
    history.push(`/rolls?${queryString.stringify(trim(data))}`);
  };

  return (
    <LocationSearch
      onFinish={onFinish}
      campaigns={campaigns}
      characters={characters}
    />
  );
};

export default Search;
