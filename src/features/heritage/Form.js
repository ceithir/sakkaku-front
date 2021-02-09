import React from "react";
import { Button, Form, Select, AutoComplete, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectLoading, selectError, create } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Form.module.css";
import TABLES from "./tables";
import {
  selectCampaigns,
  selectCharacters,
  addCampaign,
  addCharacter,
  selectUser,
} from "../user/reducer";
import { Link } from "react-router-dom";

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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
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
        const { campaign, character, description, table, gm_email } = data;

        dispatch(
          create({
            metadata: { table },
            context: { campaign, character, description },
            user,
            gm_email,
          })
        );

        dispatch(addCampaign(campaign));
        dispatch(addCharacter(character));
      }}
      className={styles.form}
      {...layout}
    >
      <Form.Item name="table" label="Book" rules={[{ required: true }]}>
        <Select
          options={Object.keys(TABLES).map((value) => {
            return { value, label: TABLES[value]["name"] };
          })}
        />
      </Form.Item>
      {!!user && (
        <Form.Item label="Campaign" name="campaign" rules={mandatoryIfLogged}>
          <AutoComplete
            options={arrayToAutoCompleteOptions(campaigns)}
            placeholder={"The Dead of Winter"}
          />
        </Form.Item>
      )}
      <Form.Item label="Character" name="character" rules={mandatoryIfLogged}>
        <AutoComplete
          options={arrayToAutoCompleteOptions(characters)}
          placeholder={"Doji Sakura"}
        />
      </Form.Item>
      {!!user && (
        <Form.Item
          label="Description"
          name="description"
          rules={mandatoryIfLogged}
        >
          <TextArea
            placeholder={`Using Celestial Realms Table to emphasize my character's mother was born Phoenix.`}
          />
        </Form.Item>
      )}
      {!!user && (
        <Form.Item
          label={`Gm's email`}
          name="gm_email"
          rules={mandatoryIfLogged}
          tooltip={`This mail will only be used to send a one-time notification to your GM with your roll results and will be forgotten about immediately after.`}
        >
          <Input type="email" placeholder={`best-gm@fallenash.com`} />
        </Form.Item>
      )}
      <Form.Item {...tailLayout} className={styles.footer}>
        {user && <Link to="/heritage/list">{`See previous rolls`}</Link>}
        <Button type="primary" htmlType="submit" disabled={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
