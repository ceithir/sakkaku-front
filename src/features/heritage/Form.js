import React from "react";
import { Button, Form, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectLoading, selectError, create } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Form.module.css";
import TABLES from "./tables";

const CustomForm = () => {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Form
      initialValues={{ table: "core" }}
      onFinish={(metadata) => {
        dispatch(create(metadata));
      }}
      className={styles.form}
    >
      <Form.Item name="table" label="Book" rules={[{ required: true }]}>
        <Select
          options={Object.keys(TABLES).map((value) => {
            return { value, label: TABLES[value]["name"] };
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
