import React from "react";
import { Typography } from "antd";
import { Link as InternalLink } from "react-router-dom";
import styles from "./Homepage.module.less";
import { ReactComponent as ExternalLinkIcon } from "./external-link.svg";
import MainTitle from "../display/Title";

const { Title, Link: AntdLink } = Typography;

const Link = ({ uri, children }) => {
  if (uri.startsWith("/")) {
    return <InternalLink to={uri}>{children}</InternalLink>;
  }

  return (
    <AntdLink href={uri}>
      {children}
      <ExternalLinkIcon />
    </AntdLink>
  );
};

const Section = ({ title, text, links = [] }) => {
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return (
    <div className={styles.section}>
      <Title level={2} id={slug}>
        {title}
        <a href={`#${slug}`} className={styles.anchor}>{`#`}</a>
      </Title>
      <div className={styles.content}>
        {text}
        {links.length > 0 && (
          <div className={styles.links}>
            {links.map(({ uri, label, description }) => {
              return (
                <div key={uri}>
                  <Link uri={uri}>{label}</Link>
                  <div>{description}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Homepage = () => {
  return (
    <div className={styles.container}>
      <MainTitle>{`Sakkaku – Table of contents`}</MainTitle>
      <Section
        title={`Dice Roller`}
        text={
          <>
            <p>
              {`Sakkaku's first goal is to provide a dice roller for Fantasy Flight Games/EDGE Studio `}
              <em>{`Legend of the Five Rings`}</em>
              {` roleplaying game that isn't dependent on another software (ex: Discord) or operating system (ex: iOS/Android).`}
            </p>
            <p>{`As of now, it offers the following features:`}</p>
          </>
        }
        links={[
          {
            uri: "/roll",
            label: `Check roller`,
            description: `Perform a standard roll and keep Check Roll using the game's custom dice as per the rules of the core book (pages 22 to 25).`,
          },
          {
            uri: "/heritage",
            label: `Heritage roller`,
            description: `Roll to determine your character's ancestor as per the rules of the core book (page 95).`,
          },
          {
            uri: "/probabilities",
            label: `Probability calculator`,
            description: `If you're curious about the math (results) behind the roll and keep system.`,
          },
        ]}
      />
      <Section
        title={`Play-by-post`}
        text={
          <>
            <p>{`Sakkaku has been designed with play-by-post in mind, and includes a few features dedicated to that style of play.`}</p>
            <p>{`In practice this means that, if you're logged in, any roll made will be saved in the site's database, and can be shared freely afterward.`}</p>
          </>
        }
        links={[
          {
            uri: "/rolls",
            label: `List of all saved rolls`,
            description: `Every roll registered on the site since its inception is listed and publicly accessible there. Rolls can be tagged with a specific campaign or character name, and filtering on those values is available.`,
          },
        ]}
      />
      <Section
        title={`Other tools`}
        text={
          <>
            <p>{`Sakkaku is but one small stone in a vast ecosystem, and will likely only cover a small portion of your L5R needs. Here's a nonexhaustive list of other resources to complement it.`}</p>
            <p>{`These resources are provided as is, with no guarantee. Sakkaku is not affiliated with any of these websites and in particular has no tie with FFG/EDGE.`}</p>
          </>
        }
        links={[
          {
            uri: "https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game/",
            label: `Official Fantasy Flight Games page`,
            description: `To buy physical copies of the books (if you're in the US) and download a bunch of free bonus PDFs (character sheets, extra adventures, additional schools…).`,
          },

          {
            uri: "https://www.drivethrurpg.com/browse/pub/17946/EDGE-Studio",
            label: `EDGE Studio DriveThru page`,
            description: `To buy digital copies of the books.`,
          },
          {
            uri: "https://craneclan.weebly.com/rpg-tools.html",
            label: `The Winter Gardens of the Kakita`,
            description: `Compilations of various resources otherwise spread through the books or the Internet.`,
          },
          {
            uri: "https://docs.google.com/spreadsheets/d/1jyzqW6j5rjqnhQONE7vYMshfhD6PPZyVHU9LED-Ksn4",
            label: `The big index`,
            description: `List all existing schools, techniques, items… and where to find them.`,
          },
          {
            uri: "https://github.com/dashnine/PaperBlossoms",
            label: `Paper Blossoms`,
            description: `A free character generator available on Windows, OSX, and Linux.`,
          },
          {
            uri: "/resources/rokugan-map",
            label: `Rokugan map`,
            description: `Fan-enhanced L5R 5th ed map, reuploaded here for convenience.`,
          },
        ]}
      />
    </div>
  );
};

export default Homepage;
