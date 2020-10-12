const serverRoot =
  process.env.NODE_ENV === "production" ? "/api" : "http://127.0.0.1:8000/api";

const requestOnServer = async ({ uri, method, body, success, error }) => {
  const headers = {
    Accept: "application/json",
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${serverRoot}${uri}`, {
      method,
      headers,
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

export const authentifiedPostOnServer = async ({
  uri,
  body,
  success,
  error,
}) => {
  try {
    const response = await fetch(`${serverRoot}${uri}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": getXsrfToken(),
      },
      body: JSON.stringify(body),
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
