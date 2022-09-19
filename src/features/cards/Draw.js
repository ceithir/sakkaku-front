import React from "react";
import styles from "./Draw.module.less";
import { Breadcrumb, Form, Button } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Breadcrumb separator=">" className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Cards`}</Breadcrumb.Item>
        <Breadcrumb.Item>{`Standard 52-card deck`}</Breadcrumb.Item>
        <Breadcrumb.Item>{`Draw`}</Breadcrumb.Item>
      </Breadcrumb>
      <div>{children}</div>
    </div>
  );
};

const CustomForm = () => {
  return (
    <div className={styles["form-container"]}>
      <Form>
        <Form.Item className={styles.submit}>
          <Button type="primary" htmlType="submit">
            {`Draw`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const Draw = () => {
  return (
    <Layout>
      <CustomForm></CustomForm>
    </Layout>
  );
};

export default Draw;
