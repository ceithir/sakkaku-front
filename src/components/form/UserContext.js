import React, { useState } from "react";
import { Form, Input, Divider, AutoComplete, Switch, Alert } from "antd";
import { useSelector } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  selectUser,
} from "features/user/reducer";
import styles from "./UserContext.module.less";

const { TextArea } = Input;

const defaultRules = [{ required: true, message: "Please fill this field" }];

const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return [...values]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => {
      return {
        value,
      };
    });
};

const AnonymousAlert = () => {
  return (
    <Alert
      className={styles["anonymous-alert"]}
      showIcon
      message={`You are not logged in.`}
      description={`No history of your rolls will be kept, and you won't be able to retrieve or share them later.`}
      type="warning"
    />
  );
};

const UserContext = ({ description = {} }) => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const user = useSelector(selectUser);
  const [testMode, setTestMode] = useState(false);

  if (!user) {
    return <AnonymousAlert />;
  }

  return (
    <>
      <Form.Item
        label={`Test mode`}
        name="testMode"
        valuePropName="checked"
        className={styles["test-mode"]}
        tooltip={`The roll won't be saved if you activate this option.`}
      >
        <Switch onChange={(checked) => setTestMode(checked)} value={testMode} />
      </Form.Item>
      <div className={styles.clear} />
      {!testMode && (
        <>
          <fieldset className={styles.identifiers}>
            <Form.Item label={`Campaign`} name="campaign" rules={defaultRules}>
              <AutoComplete
                options={arrayToAutoCompleteOptions(campaigns)}
                placeholder={`The Dead of Winter`}
                filterOption={true}
              />
            </Form.Item>
            <Form.Item
              label={`Character`}
              name="character"
              rules={defaultRules}
            >
              <AutoComplete
                options={arrayToAutoCompleteOptions(characters)}
                placeholder={`Doji Sakura`}
                filterOption={true}
              />
            </Form.Item>
          </fieldset>
          <Form.Item
            label={`Description`}
            name="description"
            rules={description.rules || defaultRules}
          >
            <TextArea placeholder={description.placeholder} />
          </Form.Item>
        </>
      )}
      <Divider />
    </>
  );
};

export default UserContext;
