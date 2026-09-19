import { getRenewToken, setAuthToken, setRenewToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function renewToken() {
  const renewTokenValue = getRenewToken();

  if (!renewTokenValue) {
    return null;
  }

  console.log("renew token is being called");

  const response = await fetch(`${BASE_URL}/auth/renew`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${renewTokenValue}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  const authToken = result?.data?.authToken ?? result?.authToken;

  const newRenewToken = result?.data?.renewToken ?? result?.renewToken;

  if (!authToken || !newRenewToken) {
    console.error("Renew response does not contain both tokens");

    return null;
  }

  setAuthToken(authToken);
  setRenewToken(newRenewToken);

  console.log("tokens renewed successfully");

  return result;
}
