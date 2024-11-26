/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseServiceOptions } from "../api.type";

export enum purposeFiles {
  CREATE_FILE_CHUNK_META = "CreateFileChunkMeta",
  UPLOAD_FILE_CHUNK = "UploadFileChunk",
  VALIDATE_CHUNK = "ValidateChunk",
  GET_CHUNK_METADATA = "GetChunkMetadata",
  CHECK_META_FOLDER = "CheckMetaFolder",
  CREATE_FOLDER = "CreateFolder",
  GET_LIST_FILES = "GetListFiles",
}

export enum errorUploadFileMessages {
  METEDATA_EXISTS = "METEDATA_EXISTS",
  CREATE_METADATA_FAILED = "CREATE_METADATA_FAILED",
  VALIDATE_FILE_CHUNK_FAILED = "VALIDATE_FILE_CHUNK_FAILED",
  ABORT_REQUEST = "ABORT_REQUEST",
  GENERATE_DUPLICATE_FILE_NAME = "GENERATE_DUPLICATE_FILE_NAME",
  GENERATE_DUPLICATE_FOLDER_NAME = "GENERATE_DUPLICATE_FOLDER_NAME",
}

export interface iReqHeaderFileService {
  token?: string;
  email?: string;
  deviceUUID?: string;
  workspaceId?: string;
  teamId?: string;
}

export type OptionsCreateFileChunkMeta = Pick<
  BaseServiceOptions<
    undefined,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyCreateFileChunkMeta
  >,
  "url" | "headers" | "body"
>;

export interface iReqBodyCreateFileChunkMeta {
  parentID: string;
  path: string;
  filename: string;
  extension: string;
  checksum: string;
  size: number;
  replace?: boolean;
  keep?: boolean;
}

export type OptionsUploadFileChunk = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyUploadFileChunk
  >,
  "url" | "headers" | "body"
>;

export type headersFileMeta = {
  xSize?: number;
  xChunk?: number;
  xFileId?: string;
  xFileChecksum?: string;
};

export interface iReqBodyUploadFileChunk {
  body?: FormData;
  headers?: headersFileMeta;
}

export type OptionsValidateFileChunk = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyValidateFileChunk
  >,
  "url" | "headers" | "body"
>;

export interface iReqBodyValidateFileChunk {
  body?: FormData;
  headers?: headersFileMeta;
}

export type OptionsGetFileChunk = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyGetFileChunk
  >,
  "url" | "headers" | "body"
>;
export interface iReqBodyGetFileChunk {
  body?: {
    fileID?: string;
    parentId?: string;
    checksum: string;
    path: string;
    fileName: string;
    extension: string;
  };
  headers?: headersFileMeta;
}

export type OptionsGenerateDuplicateName = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyGenerateDuplicateName
  >,
  "url" | "headers" | "body"
>;

export type iReqBodyGenerateDuplicateName = {
  parentID: string;
  name: string;
  extension?: string;
  isFolder?: boolean;
};

export type OptionsCreateFolder = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    {},
    iReqBodyCreateFolder
  >,
  "url" | "headers" | "body"
>;

export interface iReqBodyCreateFolder {
  parentID: string;
  name: string;
}

export type OptionsGetListFiles = Pick<
  BaseServiceOptions<
    string,
    iReqHeaderFileService,
    {},
    iReqQueryGetListFiles,
    {}
  >,
  "url" | "headers" | "query"
>;

export interface iReqQueryGetListFiles {
  parentID: string;
  sortBy: string;
  sortType: string;
  limit: number;
  offset: number;
  q: string;
  star: boolean;
}
