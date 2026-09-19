const PORTFOLIO = "portfolio";

type PortfolioStorage = {
  authToken?: string;
  renewToken?: string;
};

function getPortfolio(): PortfolioStorage {
  const data = localStorage.getItem(PORTFOLIO);

  if (!data) {
    return {};
  }

  try {
    return JSON.parse(data);
  } catch {
    localStorage.removeItem(PORTFOLIO);
    return {};
  }
}

function setPortfolio(data: PortfolioStorage) {
  localStorage.setItem(
    PORTFOLIO,
    JSON.stringify(data),
  );
}

export function getAuthToken(): string | undefined {
  return getPortfolio().authToken;
}

export function getRenewToken(): string | undefined {
  return getPortfolio().renewToken;
}

export function setAuthToken(token: string) {
  const portfolio = getPortfolio();

  portfolio.authToken = token;

  setPortfolio(portfolio);
}

export function setRenewToken(token: string) {
  const portfolio = getPortfolio();

  portfolio.renewToken = token;

  setPortfolio(portfolio);
}

export function clearTokens() {
  localStorage.removeItem(PORTFOLIO);
}