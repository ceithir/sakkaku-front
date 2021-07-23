import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Typography,
  AutoComplete,
  Select,
  Collapse,
  Affix,
} from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Search.module.less";
import { useSelector } from "react-redux";
import { selectCampaigns, selectCharacters } from "../user/reducer";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Panel } = Collapse;

const anchor = "search";

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
  affix,
}) => {
  return (
    <div className={styles.container}>
      <Title level={2} id={anchor}>
        {`Search`}
        <a href={`#${!affix ? anchor : "0"}`} className={styles.anchor}>
          {affix ? <LockOutlined /> : <UnlockOutlined />}
        </a>
      </Title>
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
  const [affix, setAffix] = useState(false);

  useEffect(() => {
    const { character, campaign, type } = queryString.parse(location.search);
    form.setFieldsValue({ character, campaign, type });
    !!type && setActiveKeys(["1"]);
    setAffix(location.hash === `#${anchor}`);
  }, [form, location, setActiveKeys]);

  const Container = ({ children }) =>
    affix ? <Affix offsetBottom={0}>{children}</Affix> : <>{children}</>;

  return (
    <Container>
      <StaticSearch
        form={form}
        activeKeys={activeKeys}
        setActiveKeys={setActiveKeys}
        affix={affix}
        {...props}
      />
    </Container>
  );
};

const Search = () => {
  const history = useHistory();

  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);

  const onFinish = (data) => {
    history.push(`/rolls?${queryString.stringify(trim(data))}#${anchor}`);
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
