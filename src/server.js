const apiRoot = `/api`;

const requestOnServer = async ({
  uri,
  method,
  body,
  success,
  error,
  extraHeaders = {},
}) => {
  const defaultHeaders = {
    Accept: "application/json",
  };
  if (body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${apiRoot}${uri}`, {
      method,
      headers: { ...defaultHeaders, ...extraHeaders },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`Bad status: ${response.status}`);
    }
    const data = await response.json();
    success(data);
  } catch (e) {
    error ? error(e) : console.error(e);
  }
};

export const postOnServer = async ({ uri, body, success, error }) => {
  return requestOnServer({ uri, method: "POST", body, success, error });
};

export const getOnServer = async ({ uri, success, error }) => {
  return requestOnServer({ uri, method: "GET", success, error });
};

// Source: https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
const getXsrfToken = () =>
  decodeURIComponent(
    document.cookie.match("(^|;) ?XSRF-TOKEN=([^;]*)(;|$)")[2]
  );

const authentifiedRequestOnServer = async ({
  uri,
  method,
  body,
  success,
  error,
}) => {
  return requestOnServer({
    uri,
    method,
    body,
    success,
    error,
    extraHeaders: {
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": getXsrfToken(),
    },
  });
};

export const authentifiedPostOnServer = async ({
  uri,
  body,
  success,
  error,
}) => {
  return authentifiedRequestOnServer({
    uri,
    method: "POST",
    body,
    success,
    error,
  });
};
