import React from "react";
import opportunityImage from "./images/opportunity.png";
import strifeImage from "./images/strife.png";
import successImage from "./images/success.png";
import styles from "./Result.module.css";

const Result = ({ opportunity, success, strife }) => {
  return (
    <span className={styles.result}>
      <img src={successImage} title="Success" alt="Success" />
      <span>{`: ${success}, `}</span>
      <img src={opportunityImage} title="Opportunity" alt="Opportunity" />
      <span>{`: ${opportunity}, `}</span>
      <img src={strifeImage} title="Strife" alt="Strife" />
      <span>{`: ${strife}`}</span>
    </span>
  );
};

export default Result;
