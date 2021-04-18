import React from "react";
import { Layout } from "antd";
import styles from "./Layout.module.less";
import Menu from "./Menu";

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ children }) => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu />
      </Header>
      <Content>{children}</Content>
      <Footer className={styles.footer}>
        {`Sakkaku Project / 2020-2021 / `}
        <a href="mailto:contact.sakkaku@gmail.com">Issue? Suggestion?</a>
      </Footer>
    </Layout>
  );
};

export default CustomLayout;
