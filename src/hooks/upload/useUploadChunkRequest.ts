import { BulkUploadDataModel } from "@/components/fileManagement.type";
import { errorUploadFileMessages } from "@/services/file/file.services.type";
import getApiBaseUrl, { subdomain } from "@/utils/getBaseUrl";
import { useState, useCallback, useRef } from "react";
import { useAuthorizationHeaders } from "../useAuthorizationHeaders";

export function useUploadChunkRequest() {
  const { getAuthorizationHeaders } = useAuthorizationHeaders();
  const [progress, setProgress] = useState(0); // Track upload progress (0-100)
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [error, setError] = useState<string | null>(null); // Track errors
  const xhrRef = useRef<XMLHttpRequest | null>(null); // Reference for the XHR instance

  const uploadFile = useCallback(
    async (
      dataFile: BulkUploadDataModel,
      fileChunking: { fileChunk: File; chunkNumber: number },
      signal?: AbortSignal
    ) => {
      const { fileChunk, chunkNumber } = fileChunking;
      const authorizationHeaders = await getAuthorizationHeaders();

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr; // Store the instance for later aborting

        const endpoint =
          getApiBaseUrl(subdomain.FILES) + "/file/chunk/create/file";

        // Open the request
        xhr.open("POST", endpoint);

        // Set headers (adjust based on your backend)
        xhr.setRequestHeader("Authorization", "token");
        xhr.setRequestHeader("X-Email", authorizationHeaders.email);
        xhr.setRequestHeader("X-DeviceUUID", authorizationHeaders.deviceUUID);
        xhr.setRequestHeader("X-WorkspaceId", authorizationHeaders.workspaceId);
        xhr.setRequestHeader("X-TeamID", authorizationHeaders.teamId);
        xhr.setRequestHeader("X-From", "Web");
        xhr.setRequestHeader("X-Size", fileChunk.size.toString());
        xhr.setRequestHeader("X-Chunk", chunkNumber.toString());
        xhr.setRequestHeader("X-FileID", dataFile.fileID ?? "");
        xhr.setRequestHeader("X-FileChecksum", dataFile.checksum);

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", fileChunk);

        // Start uploading
        setIsUploading(true);
        setProgress(0);
        setError(null);

        // Monitor upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress(percentage);
          }
        };

        // Handle successful upload
        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100); // Ensure 100% progress
            resolve();
          } else {
            setError(`Upload failed with status ${xhr.status}`);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        // Handle upload errors
        xhr.onerror = () => {
          setIsUploading(false);
          setError("An error occurred during upload.");
          reject(new Error("An error occurred during upload."));
        };

        // Handle abort
        xhr.onabort = () => {
          setIsUploading(false);
          setError(errorUploadFileMessages.ABORT_REQUEST);
          reject(new Error(errorUploadFileMessages.ABORT_REQUEST));
        };

        signal?.addEventListener("abort", () => {
          xhr.abort(); // Abort the request
        });

        // Send the file
        xhr.send(formData);
      });
    },
    []
  );

  return {
    uploadChunkFile: uploadFile,
    progressUploadChunk: progress,
    errorUploadChunk: error,
    isUploadingChunk: isUploading,
  };
}
