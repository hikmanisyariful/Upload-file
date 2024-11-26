import {
  fetchCreateFileChunkMeta,
  fetchGenerateDuplicateName,
  fetchGetChunkFileMetadata,
  fetchUploadFileChunk,
  fetchValidateFileChunk,
} from "@/services/file/file.services";
import {
  iReqBodyCreateFileChunkMeta,
  iReqBodyGenerateDuplicateName,
  iReqBodyGetFileChunk,
  iReqBodyUploadFileChunk,
  iReqBodyValidateFileChunk,
} from "@/services/file/file.services.type";
import { useAuthorizationHeaders } from "../useAuthorizationHeaders";

export function useFetcherUploadFile() {
  const { getAuthorizationHeaders } = useAuthorizationHeaders();

  const createFileChunkMeta = async (
    body: iReqBodyCreateFileChunkMeta,
    signal?: AbortSignal
  ) => {
    const authorizationHeaders = await getAuthorizationHeaders();
    return fetchCreateFileChunkMeta(
      {
        body: body,
        headers: {
          ...authorizationHeaders,
          token: "token",
        },
      },
      signal
    );
  };

  const uploadFileChunk = async (
    body: iReqBodyUploadFileChunk,
    signal?: AbortSignal
  ) => {
    const authorizationHeaders = await getAuthorizationHeaders();
    return fetchUploadFileChunk(
      {
        body: body,
        headers: {
          ...authorizationHeaders,
          token: "token",
        },
      },
      signal
    );
  };

  const validateFileChunk = async (
    body: iReqBodyValidateFileChunk,
    signal?: AbortSignal
  ) => {
    const authorizationHeaders = await getAuthorizationHeaders();

    return fetchValidateFileChunk(
      {
        body: body,
        headers: {
          ...authorizationHeaders,
          token: "token",
        },
      },
      signal
    );
  };

  const getFileChunk = async (
    body: iReqBodyGetFileChunk,
    signal?: AbortSignal
  ) => {
    const authorizationHeaders = await getAuthorizationHeaders();
    return fetchGetChunkFileMetadata(
      {
        body: body,
        headers: {
          ...authorizationHeaders,
          token: "token",
        },
      },
      signal
    );
  };

  const generateDuplicateName = async (
    body: iReqBodyGenerateDuplicateName,
    signal?: AbortSignal
  ) => {
    const authorizationHeaders = await getAuthorizationHeaders();
    return fetchGenerateDuplicateName(
      {
        body: body,
        headers: {
          ...authorizationHeaders,
          token: "token",
        },
      },
      signal
    );
  };

  return {
    createFileChunkMeta,
    uploadFileChunk,
    validateFileChunk,
    getFileChunk,
    generateDuplicateName,
  };
}
