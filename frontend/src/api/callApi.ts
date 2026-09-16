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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authorization) {
    const authToken = getAuthToken();

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  const response = await fetch(
    `${BASE_URL}${url}`,
    {
      method,
      headers,
      body: data
        ? JSON.stringify(data)
        : undefined,
    },
  );

  if (
    response.status === 401 &&
    authorization &&
    !isRetry
  ) {
    const renewed = await renewToken();

    if (renewed) {
      return callApi(
        url,
        method,
        data,
        authorization,
        true,
      );
    }
  }

  return response;
}