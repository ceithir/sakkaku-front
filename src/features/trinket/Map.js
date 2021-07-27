import React, { useState, useRef, useEffect } from "react";
import styles from "./Map.module.less";
import mapData from "./map-data";
import { AutoComplete, Typography } from "antd";
import ScrollContainer from "react-indiana-drag-scroll";

const mapUrl = "/media/maps/rokugan-map-1800.jpg";
const mapMaxX = 65;
const mapMaxY = 99;

const { Text } = Typography;

const Search = ({ scrollContainerRef }) => {
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!search || !scrollContainerRef.current) {
      return;
    }

    const container = scrollContainerRef.current;

    const imageWidth = container.children[0].clientWidth;
    const imageHeight = container.children[0].clientHeight;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const bound = ({ value, min, max }) => {
      return Math.max(min, Math.min(Math.round(value), max));
    };

    const scrollConfig = {
      left: bound({
        value: (search.x / mapMaxX) * imageWidth - containerWidth / 2,
        min: 0,
        max: imageWidth,
      }),
      top: bound({
        value: (search.y / mapMaxY) * imageHeight - containerHeight / 2,
        min: 0,
        max: imageHeight,
      }),
      behavior: "smooth",
    };
    container.scrollTo(scrollConfig);
  }, [search, scrollContainerRef]);

  return (
    <div className={styles.search}>
      <AutoComplete
        options={mapData.map(({ label }) => {
          return { value: label };
        })}
        placeholder={`Search location`}
        onChange={(value) => {
          setSearch(mapData.find(({ label }) => label === value));
        }}
        filterOption={true}
        allowClear={true}
      />
      {search && (
        <Text
          strong={true}
        >{`${search.label}: x${search.x} / y${search.y}`}</Text>
      )}
    </div>
  );
};

const Map = () => {
  const scrollContainerRef = useRef(null);

  return (
    <div className={styles.container}>
      <p>
        {`A simple reupload of `}
        <a href="https://craneclan.weebly.com/map-of-rokugan.html">{`Trevor Cuba (Kakita Onimaru) work`}</a>
        {` at a more web-friendly resolution. Follow link for full credits and information.`}
      </p>
      <Search scrollContainerRef={scrollContainerRef} />
      <ScrollContainer
        className={styles["scroll-container"]}
        hideScrollbars={false}
        innerRef={scrollContainerRef}
      >
        <img src={mapUrl} alt="Rokugan map (5th ed)" />
      </ScrollContainer>
    </div>
  );
};

export default Map;
