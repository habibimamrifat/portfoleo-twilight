import { getAuthToken } from "./token";
import { renewToken } from "./renewToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function callApi(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  data?: unknown,
  authorization = false,
  isRetry = false,
) {
  console.log("=================================");
  console.log("CALL API");
  console.log("METHOD:", method);
  console.log("URL:", `${BASE_URL}${url}`);
  console.log("AUTHORIZATION REQUIRED:", authorization);
  console.log("IS RETRY:", isRetry);

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  /*
   * JSON requests need Content-Type: application/json.
   *
   * FormData requests MUST NOT have Content-Type set manually.
   * The browser automatically adds:
   *
   * multipart/form-data; boundary=....
   *
   * which is required by Multer.
   */
  if (
    data !== undefined &&
    !(data instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  /*
   * Add authorization header.
   */
  if (authorization) {
    const authToken = getAuthToken();

    console.log(
      "AUTH TOKEN EXISTS:",
      !!authToken,
    );

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  /*
   * Prepare request body.
   *
   * FormData:
   *     send directly
   *
   * Normal object:
   *     convert to JSON
   */
  let body: BodyInit | undefined;

  if (data !== undefined) {
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
    }
  }

  console.log("REQUEST HEADERS:", headers);

  /*
   * Useful debugging for multipart requests.
   */
  if (data instanceof FormData) {
    for (const [key, value] of data.entries()) {
      console.log(
        "FORM DATA:",
        key,
        value,
        typeof value,
      );
    }
  }

  const response = await fetch(
    `${BASE_URL}${url}`,
    {
      method,
      headers,
      body,
    },
  );

  console.log(
    "API RESPONSE:",
    response.status,
    response.statusText,
  );

  /*
   * Access token expired.
   * Renew the tokens and retry the original request once.
   */
  if (
    response.status === 401 &&
    authorization &&
    !isRetry
  ) {
    console.log(
      "401 RECEIVED → TRYING TOKEN RENEWAL",
    );

    const renewed = await renewToken();

    console.log(
      "TOKEN RENEW RESULT:",
      !!renewed,
    );

    if (renewed) {
      console.log(
        "TOKEN RENEWED → RETRYING REQUEST",
      );

      return callApi(
        url,
        method,
        data,
        authorization,
        true,
      );
    }

    console.log(
      "TOKEN RENEWAL FAILED",
    );
  }

  console.log("=================================");

  return response;
}