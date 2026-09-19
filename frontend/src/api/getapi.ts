import { getAuthToken } from "./token";
import { renewToken } from "./renewToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getApi(
  url: string,
  authorization = false,
  isRetry = false,
) {
  console.log("calling get api");

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (authorization) {
    const authToken = getAuthToken();

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    headers,
  });

  if (
    response.status === 401 &&
    authorization &&
    !isRetry
  ) {
    console.log("GET token expired");

    const renewed = await renewToken();

    if (renewed) {
      return getApi(
        url,
        authorization,
        true,
      );
    }
  }

  return response;
}