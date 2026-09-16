import { getRenewToken, setAuthToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function renewToken() {
  const renewToken = getRenewToken();

  if (!renewToken) {
    return null;
  }

  const response = await fetch(`${BASE_URL}/auth/renew`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${renewToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  setAuthToken(result.data.authToken);

  return result;
}
