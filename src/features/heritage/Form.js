import React from "react";
import { Button, Form, Select, AutoComplete, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectLoading, selectError, create } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Form.module.less";
import TABLES from "./data/heritage";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
  selectUser,
} from "../user/reducer";

const { TextArea } = Input;

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

const CustomForm = () => {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);

  if (error) {
    return <DefaultErrorMessage />;
  }

  const mandatoryIfLogged = [
    { required: !!user, message: "Please fill in this field." },
  ];

  return (
    <Form
      initialValues={{ table: "core" }}
      onFinish={(data) => {
        const { campaign, character, description, table } = data;

        dispatch(
          create({
            metadata: { table },
            context: { campaign, character, description },
            user,
          })
        );

        dispatch(addCampaign(campaign));
        dispatch(addCharacter(character));
      }}
      className={styles.form}
      layout="vertical"
    >
      <Form.Item name="table" label="Book" rules={[{ required: true }]}>
        <Select
          options={Object.keys(TABLES).map((value) => {
            return { value, label: TABLES[value]["name"] };
          })}
        />
      </Form.Item>
      {!!user && (
        <>
          <Form.Item label="Campaign" name="campaign" rules={mandatoryIfLogged}>
            <AutoComplete
              options={arrayToAutoCompleteOptions(campaigns)}
              placeholder={"The Dead of Winter"}
              filterOption={true}
            />
          </Form.Item>
          <Form.Item
            label="Character"
            name="character"
            rules={mandatoryIfLogged}
          >
            <AutoComplete
              options={arrayToAutoCompleteOptions(characters)}
              placeholder={"Doji Sakura"}
              filterOption={true}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea
              placeholder={`Using Celestial Realms Table to emphasize my character's mother was born Phoenix.`}
            />
          </Form.Item>
        </>
      )}
      <Form.Item className={styles.footer}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
