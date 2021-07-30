import React from "react";
import { Typography } from "antd";
import {
  Explosion,
  Opportunity,
  Success,
  Strife,
} from "features/display/Symbol";

const { Text } = Typography;

const ParenthesisSymbol = ({ children }) => {
  return (
    <>
      {` (`}
      {children}
      {`)`}
    </>
  );
};

const TextDice = ({
  opportunity = 0,
  success = 0,
  explosion = 0,
  strife = 0,
}) => {
  return (
    <div>
      {explosion > 0 && (
        <Text type="success">
          {`+${explosion} Explosive Success`}
          <ParenthesisSymbol>
            <Explosion />
          </ParenthesisSymbol>
        </Text>
      )}
      {success > 0 && (
        <Text>
          {`+${success} Success`}
          <ParenthesisSymbol>
            <Success />
          </ParenthesisSymbol>
        </Text>
      )}
      {opportunity > 0 && (
        <Text>
          {`+${opportunity} Opportunity`}
          <ParenthesisSymbol>
            <Opportunity />
          </ParenthesisSymbol>
        </Text>
      )}
      {strife > 0 && (
        <Text type="danger">
          {`+${strife} Strife`}
          <ParenthesisSymbol>
            <Strife />
          </ParenthesisSymbol>
        </Text>
      )}
      {opportunity === 0 &&
        success === 0 &&
        explosion === 0 &&
        strife === 0 && <Text type="warning">{`Blank`}</Text>}
    </div>
  );
};

export default TextDice;
