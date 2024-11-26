import { BulkUploadDataModel } from "@/components/fileManagement.type";
import { useCallback, useEffect, useState } from "react";
import { useFetcherUploadFile } from "../fetcher/useFetcherUploadFile";
import {
  errorUploadFileMessages,
  iReqBodyCreateFileChunkMeta,
} from "@/services/file/file.services.type";
import { useUploadFileChunks } from "./useUploadFileChunks";

export function useUploadFile() {
  const { createFileChunkMeta } = useFetcherUploadFile();
  const { progress, uploadFileChunking, errorUpload, isValidate } =
    useUploadFileChunks();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<BulkUploadDataModel | null>(null);

  const uploadFile = useCallback(
    async (currentUploadFile: BulkUploadDataModel, signal?: AbortSignal) => {
      // 1. Initial state for start upload.
      setIsUploading(true);
      setIsSuccess(false);
      setError(null);
      setDuplicate(null);

      let dataFile: BulkUploadDataModel = { ...currentUploadFile };

      // 2. Create metadata.
      const bodyCreateMeta: iReqBodyCreateFileChunkMeta = {
        parentID: dataFile.parentID,
        path: dataFile.path,
        filename: dataFile.fileName,
        extension: dataFile.extension,
        checksum: dataFile.checksum,
        size: dataFile.file.size,
        replace: dataFile.replace,
        keep: dataFile.keep,
      };

      const responseCreateFileChunkMeta = await createFileChunkMeta(
        bodyCreateMeta,
        signal
      );
      if (responseCreateFileChunkMeta.isError) {
        if (Number(responseCreateFileChunkMeta.statusCode) === 406) {
          if (responseCreateFileChunkMeta.data.exists) {
            setDuplicate({
              ...dataFile,
            });

            setIsUploading(false);
            setError(errorUploadFileMessages.METEDATA_EXISTS);
            return;
          } else if (responseCreateFileChunkMeta.data.metadata) {
            dataFile = {
              ...dataFile,
              fileID: responseCreateFileChunkMeta.data.metadata.fileID,
              chunking: {
                ...dataFile?.chunking,
                totalChunk:
                  responseCreateFileChunkMeta.data.metadata.totalChunk,
                currentChunk:
                  responseCreateFileChunkMeta.data.metadata.currentChunk,
                remainingChunk:
                  responseCreateFileChunkMeta.data.metadata.remainingChunk,
              },
            };
          } else {
            setIsUploading(false);
            setError(errorUploadFileMessages.CREATE_METADATA_FAILED);
            return;
          }
        } else {
          setIsUploading(false);
          setError(errorUploadFileMessages.CREATE_METADATA_FAILED);
          return;
        }
      } else {
        dataFile = {
          ...dataFile,
          fileID: responseCreateFileChunkMeta.data.fileID,
          chunking: {
            ...dataFile?.chunking,
            totalChunk: responseCreateFileChunkMeta.data.totalChunk,
          },
        };
      }

      // 3. Upload file chunk sequentially.
      try {
        await uploadFileChunking(dataFile, signal);

        // 4. Set isSuccess to be "true" when uploading and validating the file chunks in sequence is complete.
        setIsSuccess(true);
        setIsUploading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsUploading(false);
        setIsSuccess(false);
        return;
      }
    },
    []
  );

  const reuploadFile = useCallback(
    (currentUploadFile: BulkUploadDataModel, signal?: AbortSignal) => {
      uploadFile(currentUploadFile, signal);
    },
    []
  );

  useEffect(() => {
    if (!errorUpload) return;
    setIsUploading(false);
    setError(errorUpload);
  }, [errorUpload]);

  return {
    uploadFile,
    reuploadFile,
    progress,
    isSuccess,
    isUploading,
    error,
    duplicate,
    isValidate,
  };
}
