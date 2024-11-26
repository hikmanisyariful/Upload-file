export type FileData = {
  fileID: string;
  fileName: string;
  name: string;
  extension: string;
  isFolder?: boolean;
  totalItems?: number;
  size: number;
  owner: string;
  createdDate?: string;
  modifiedDate: string;
  createdBy?: {
    name: string;
    profilePicture: string;
  };
  teamUUID?: string;
  workspaceUUID?: string;
  parentID?: string;
  path?: string;
  fileMeta: {
    size: number;
    extension: string;
    version: string;
    encrypt: boolean;
    shared: boolean;
    locked: boolean;
  };
};

export type StatusBulkUpload =
  | "PENDING"
  | "UPLOADING"
  | "SUCCESS"
  | "FAILED"
  | "PAUSE";

export type ChunkingData = {
  totalChunk?: number;
  currentChunk?: number;
  remainingChunk?: number;
};

export type BulkUploadDataModel = {
  id: string;
  parentID: string;
  path: string;
  file: File;
  fileName: string;
  extension: string;
  checksum: string;
  progress: number;
  status: StatusBulkUpload;
  isFolder: boolean;
  fromFolder: boolean;
  fileID?: string;
  chunking?: ChunkingData;
  replace?: boolean;
  keep?: boolean;
  folder?: FolderData;
};

export type FolderData = {
  files: [];
};

export type FormDataEntry = { path: string; file: File } | null;
