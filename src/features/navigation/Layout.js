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
        {`A dice roller for the `}
        <a href="https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game/">
          {`Legend of the Five Rings Roleplaying Game (5th edition)`}
        </a>
        {` – ©FFG for all quoted texts and images`}
        <br />
        {`This website is not affiliated in any way with Fantasy Flight Games or EDGE Studio.`}
        <br />
        {`For any issue or suggestion: `}
        <a href="mailto:contact.sakkaku@gmail.com">{`contact.sakkaku@gmail.com`}</a>
      </Footer>
    </Layout>
  );
};

export default CustomLayout;
