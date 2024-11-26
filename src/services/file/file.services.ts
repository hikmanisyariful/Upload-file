/* eslint-disable @typescript-eslint/no-explicit-any */
import { subdomain } from "@/utils/getBaseUrl";
import fetcher from "../fetcher";
import {
  iReqQueryGetListFiles,
  OptionsCreateFileChunkMeta,
  OptionsCreateFolder,
  OptionsGenerateDuplicateName,
  OptionsGetFileChunk,
  OptionsGetListFiles,
  OptionsUploadFileChunk,
  OptionsValidateFileChunk,
} from "./file.services.type";
import { FileData } from "@/components/fileManagement.type";

export const fetchCreateFileChunkMeta = (
  props: OptionsCreateFileChunkMeta,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;

  return fetcher<any>({
    url: url ?? "/file/chunk/create",
    method: "POST",
    apiName: "Files/Create Chunk Meta",
    subdomain: subdomain.FILES,
    isShowToast: false,
    isUseMessageServer: true,
    isUseDataServer: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
    },
    body,
    signal,
  });
};

export const fetchUploadFileChunk = (
  props: OptionsUploadFileChunk,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;

  return fetcher<any>({
    url: url ?? "/file/create/file",
    method: "POST",
    apiName: "Files/Upload File Chunk",
    subdomain: subdomain.FILES,
    isShowToast: false,
    isUseMessageServer: true,
    isMultipart: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
      "X-Size": body?.headers?.xSize,
      "X-Chunk": body?.headers?.xChunk,
      "X-FileID": body?.headers?.xFileId,
      "X-FileChecksum": body?.headers?.xFileChecksum,
    },
    body: body?.body,
    signal,
  });
};

export const fetchValidateFileChunk = (
  props: OptionsValidateFileChunk,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;

  return fetcher<any>({
    url: url ?? "/file/chunk",
    method: "POST",
    apiName: "Files/Validate Chunk",
    subdomain: subdomain.FILES,
    isShowToast: false,
    isUseMessageServer: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
      "X-Size": body?.headers?.xSize,
      "X-Chunk": body?.headers?.xChunk,
      "X-FileID": body?.headers?.xFileId,
      "X-FileChecksum": body?.headers?.xFileChecksum,
    },
    signal,
  });
};

export const fetchGetChunkFileMetadata = (
  props: OptionsGetFileChunk,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;
  const urlHandle = `${url}?fileName=${body?.body?.fileName}&extension=${body?.body?.extension}&checksum=${body?.body?.checksum}`;

  return fetcher<any>({
    url: url ? urlHandle : "/file/chunk",
    method: "GET",
    apiName: "Files/Get Chunk Metadata",
    subdomain: subdomain.FILES,
    isShowToast: false,
    isUseMessageServer: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
    },
    signal,
  });
};

export const fetchGenerateDuplicateName = (
  props: OptionsGenerateDuplicateName,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;

  return fetcher<any>({
    url: url ?? `/file/generate/name`,
    method: "POST",
    apiName: "Files/Generate Duplicate Name",
    subdomain: subdomain.FILES,
    isShowToast: true,
    isUseMessageServer: true,
    isUseDataServer: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
    },
    body,
    signal,
  });
};

export const fetchCreateFolder = (
  props: OptionsCreateFolder,
  signal?: AbortSignal
) => {
  const { url, headers, body } = props;

  return fetcher<any>({
    url: url ?? "/file/folder/create",
    method: "POST",
    apiName: "Folder/Create",
    subdomain: subdomain.FILES,
    isShowToast: true,
    isUseMessageServer: true,
    isUseDataServer: true,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
    },
    body,
    signal,
  });
};

export const fetchGetListFiles = (
  props: OptionsGetListFiles,
  signal?: AbortSignal
) => {
  const { url, headers, query } = props;

  const params: iReqQueryGetListFiles = {
    parentID: query?.parentID ?? "",
    limit: query?.limit ?? 10,
    offset: query?.offset ?? 0,
    sortBy: query?.sortBy ?? "date",
    sortType: query?.sortType ?? "DESC",
    q: query?.q ?? "",
    star: query?.star ?? false,
  };
  const queryParams = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  ).toString();

  const defaultUrl = `/file?${queryParams}`;

  return fetcher<FileData[]>({
    url: url ?? defaultUrl,
    method: "GET",
    apiName: "Get Files",
    subdomain: subdomain.FILES,
    isShowToast: true,
    isUseMessageServer: true,
    isUseDataServer: false,
    headers: {
      Authorization: headers?.token,
      "X-Email": headers?.email,
      "X-DeviceUUID": headers?.deviceUUID,
      "X-WorkspaceId": headers?.workspaceId,
      "X-TeamID": headers?.teamId,
      "X-From": "Web",
    },
    signal,
  });
};
