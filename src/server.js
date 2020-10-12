const serverRoot =
  process.env.NODE_ENV === "production" ? "/api" : "http://127.0.0.1:8000/api";

const requestOnServer = async ({ uri, method, body, success, error }) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": body ? "application/json" : undefined,
  };

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
