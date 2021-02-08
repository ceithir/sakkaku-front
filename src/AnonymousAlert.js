import React from "react";
import { Alert, Typography, Affix } from "antd";

const { Link, Paragraph } = Typography;

const AnonymousAlert = ({ className }) => {
  return (
    <Affix>
      <Alert
        className={className}
        showIcon
        closable
        message={"Mono no aware"}
        description={
          <>
            <Paragraph>
              You are not logged in. While you can totally use the roller as a
              guest, please take note that{" "}
              <strong>any roll made won't be persisted</strong>.
            </Paragraph>
            <Paragraph>
              You will need to <Link href="/login">log in</Link> first if you
              wish to keep and share your results.
            </Paragraph>
          </>
        }
        type="warning"
      />
    </Affix>
  );
};

export default AnonymousAlert;
