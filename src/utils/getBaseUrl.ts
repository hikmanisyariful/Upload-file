export enum subdomain {
  AUTH = "auth",
  WORKSPACES = "workspaces",
  FILES = "files",
}

const getApiBaseUrl = (subdomain: subdomain) => {
  const apiBaseUrl = "https://subdomain.jaybod.xyz/api/v1";
  return apiBaseUrl?.replace("subdomain", subdomain);
};
export default getApiBaseUrl;
