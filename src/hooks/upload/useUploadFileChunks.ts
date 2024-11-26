import { useCallback, useState, useRef, useEffect } from "react";
import { BulkUploadDataModel } from "@/components/fileManagement.type";
import { useFetcherUploadFile } from "../fetcher/useFetcherUploadFile";
import { useUploadChunkRequest } from "./useUploadChunkRequest";
import { errorUploadFileMessages } from "@/services/file/file.services.type";
import { chunkingFile } from "@/components/helpers";

export function useUploadFileChunks() {
  const { validateFileChunk } = useFetcherUploadFile();
  const {
    uploadChunkFile,
    progressUploadChunk,
    errorUploadChunk,
    isUploadingChunk,
  } = useUploadChunkRequest();
  const totalChunk = useRef(0);
  const currentChunk = useRef(0);
  const totalProgressUpload = useRef(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isValidate, setIsValidate] = useState(false);

  const uploadFileChunking = useCallback(
    async (dataFile: BulkUploadDataModel, signal?: AbortSignal) => {
      // 1. Initial state
      totalChunk.current = 0;
      currentChunk.current = 0;
      totalProgressUpload.current = 0;
      setProgress(0);
      setError(null);
      setIsValidate(false);

      // 2. Set total chunks & current chunk.
      totalChunk.current = dataFile.chunking?.totalChunk ?? 0;
      currentChunk.current = dataFile.chunking?.currentChunk ?? 0;

      // 3. Chunking files as many as total chunks.
      const fileChunks = chunkingFile(dataFile.file, totalChunk.current).map(
        (blob) =>
          new File([blob], dataFile.file.name, {
            type: dataFile.file.type,
            lastModified: dataFile.file.lastModified,
          })
      );

      // 4. Track progress chunk which has been complete.
      const progresDoneUploadFileChunk = fileChunks
        .slice(0, currentChunk.current)
        .reduce((acc) => acc + 100, 0);

      // 5. Set initial total progress
      totalProgressUpload.current += progresDoneUploadFileChunk;

      // 6. Get remaining chunking files which has not been complete.
      const remainUploadFileChunks = fileChunks
        .slice(currentChunk.current)
        .map((file, index) => ({
          fileChunk: file,
          chunkNumber: currentChunk.current + index + 1,
        }));

      // 7. Sequentially upload chunk file of remaining chunking files.
      for (const fileChunking of remainUploadFileChunks) {
        try {
          await uploadChunkFile(dataFile, fileChunking, signal);
        } catch (error) {
          setProgress(0);
          setError(error as errorUploadFileMessages);
          throw new Error(error as errorUploadFileMessages);
        }
      }
      setIsValidate(true);
      const responseValidateFile = await validateFileChunk(
        {
          headers: {
            xChunk: dataFile.chunking?.totalChunk,
            xFileId: dataFile.fileID,
            xSize: fileChunks[fileChunks.length - 1]
              ? fileChunks[fileChunks.length - 1].size
              : 0,
            xFileChecksum: dataFile.checksum,
          },
        },
        signal
      );
      if (responseValidateFile.isError) {
        setProgress(0);
        setError(errorUploadFileMessages.VALIDATE_FILE_CHUNK_FAILED);
        throw new Error(errorUploadFileMessages.VALIDATE_FILE_CHUNK_FAILED);
      }
    },
    [uploadChunkFile, currentChunk.current, totalChunk.current]
  );

  useEffect(() => {
    // Skip if there are no chunks or uploading hasn't started
    if (totalChunk.current === 0 || !isUploadingChunk) return;

    // Accumulate progress only when the chunk is fully uploaded
    if (progressUploadChunk === 100) {
      totalProgressUpload.current += progressUploadChunk;
      setProgress(totalProgressUpload.current / totalChunk.current);
      return;
    }

    // Calculate total progress as a percentage
    const progressUploaded = Math.round(
      (totalProgressUpload.current + progressUploadChunk) / totalChunk.current
    );
    setProgress(progressUploaded); // Update progress state
  }, [progressUploadChunk, totalChunk.current, isUploadingChunk]);

  useEffect(() => {
    if (!errorUploadChunk) return;
    setProgress(0);
    setError(errorUploadChunk);
  }, [errorUploadChunk]);

  return {
    uploadFileChunking,
    progress,
    errorUpload: error,
    isValidate,
  };
}
