import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import ExternalLink from "./ExternalLink";

const AegSubmenu = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname }) => {
      return pathname.substring(1, pathname.length);
    };

    setSelectedKey(getMenuKey(location));
  }, [location]);

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => setSelectedKey(key)}
    >
      <Menu.Item key="roll-d10">
        <Link to="/roll-d10">{`XkY Roll`}</Link>
      </Menu.Item>
      <Menu.Item key="roll-d10-4th-ed">
        <Link to="/roll-d10-4th-ed">{`4th Edition Roll (guided mode)`}</Link>
      </Menu.Item>
      <Menu.Item key="probabilities">
        <ExternalLink href="https://lynks.se/probability/">{`Probabilities`}</ExternalLink>
      </Menu.Item>
    </Menu>
  );
};

export default AegSubmenu;
