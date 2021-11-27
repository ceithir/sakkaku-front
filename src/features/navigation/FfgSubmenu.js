import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const FfgSubmenu = () => {
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
      <Menu.Item key="roll">
        <Link to="/roll">{`Check Roll`}</Link>
      </Menu.Item>
      <Menu.Item key="heritage">
        <Link to="/heritage">{`Heritage Roll`}</Link>
      </Menu.Item>
      <Menu.Item key="probabilities">
        <Link to="/probabilities">{`Probabilities`}</Link>
      </Menu.Item>
    </Menu>
  );
};

export default FfgSubmenu;
