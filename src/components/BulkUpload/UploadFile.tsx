import React, { useCallback, useEffect, useMemo, useRef } from "react";
import TruncateText from "../TruncateText";
import { IconPlayerPause, IconReload, IconX } from "@tabler/icons-react";
import {
  BulkUploadDataModel,
  StatusBulkUpload,
} from "@/components/fileManagement.type";
import { useUploadFile } from "@/hooks/upload/useUploadFile";
import { useBulkUploadContext } from "@/context/upload/BulkUploadContext";
import { useDuplicateUploadContext } from "@/context/upload/DuplicateUploadContext";
import { capitalizeFirstLetter } from "../helpers";

export default function UploadFile({
  fileData,
}: {
  fileData: BulkUploadDataModel;
}) {
  const { updateDataOnBulkUpload, removeDataOnBulkUpload } =
    useBulkUploadContext();
  const { addToDuplicateStore } = useDuplicateUploadContext();
  const {
    uploadFile,
    reuploadFile,
    isSuccess,
    isUploading,
    progress,
    error,
    duplicate,
    isValidate,
  } = useUploadFile();
  const isPause = useRef(false);
  const countRef = useRef(0);
  const abortControllerRef = useRef(new AbortController()); // Persist the same AbortController

  const status = useMemo(() => {
    return isUploading
      ? "UPLOADING"
      : isSuccess
      ? "SUCCESS"
      : error && isPause.current
      ? "PAUSE"
      : "FAILED";
  }, [isUploading, isSuccess, error, isPause.current]);

  const handleOnClose = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      removeDataOnBulkUpload(fileData.id);
      abortControllerRef.current.abort(); // Abort using the persisted AbortController
    },
    []
  );

  const handleReupload = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      if (isUploading) return;
      if (isPause.current) {
        isPause.current = false;
      }
      abortControllerRef.current = new AbortController();
      reuploadFile(fileData, abortControllerRef.current.signal);
    },
    [isUploading]
  );

  const handleOnPause = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      isPause.current = true;
      abortControllerRef.current.abort(); // Abort using the persisted AbortController
    },
    []
  );

  useEffect(() => {
    if (
      fileData.status !== "PENDING" ||
      (!duplicate && !isUploading) ||
      (!duplicate && countRef.current > 0)
    )
      return;
    countRef.current += 1;
    // Reset AbortController for new uploads
    abortControllerRef.current = new AbortController();
    uploadFile(fileData, abortControllerRef.current.signal);
  }, [isUploading, fileData]);

  useEffect(() => {
    updateDataOnBulkUpload({ ...fileData, progress });
  }, [progress]);

  useEffect(() => {
    updateDataOnBulkUpload({ ...fileData, status });
  }, [status]);

  useEffect(() => {
    if (!duplicate) return;
    addToDuplicateStore(duplicate);
  }, [duplicate]);

  return (
    <div className="px-3 py-2.5">
      <div className="grid w-full grid-cols-12 grid-rows-none gap-4">
        <div className="col-span-8 flex items-center gap-2">
          <TruncateText text={fileData.fileName} />
        </div>
        <div className="col-span-4 flex items-center justify-end gap-2">
          {status === "SUCCESS" || status === "PAUSE" || status === "FAILED" ? (
            <UploadStatus
              status={status}
              onClose={handleOnClose}
              onRetry={handleReupload}
            />
          ) : (
            <ProgressUpload
              progress={progress}
              onClose={handleOnClose}
              onPause={handleOnPause}
              isValidate={isValidate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const ProgressUpload = ({
  progress,
  onClose,
  onPause,
  isValidate,
}: {
  progress: number;
  isValidate: boolean;
  onClose: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
  onPause: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}) => {
  return (
    <>
      {isValidate ? (
        <span>Processing...</span>
      ) : (
        <>
          <span>{progress}%</span>
          <IconPlayerPause
            className="size-4 stroke-disabled_color hover:cursor-pointer"
            onClick={onPause}
          />
          <IconX
            className="size-4 stroke-disabled_color hover:cursor-pointer"
            onClick={onClose}
          />
        </>
      )}
    </>
  );
};

const UploadStatus = ({
  status,
  onClose,
  onRetry,
}: {
  status: StatusBulkUpload;
  onClose: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
  onRetry: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}) => {
  return (
    <>
      <div>{capitalizeFirstLetter(status)}</div>
      {status !== "SUCCESS" ? (
        <IconReload
          className="size-4 stroke-disabled_color hover:cursor-pointer"
          onClick={onRetry}
        />
      ) : null}
      {status === "PAUSE" ? (
        <IconX
          className="size-4 stroke-disabled_color hover:cursor-pointer"
          onClick={onClose}
        />
      ) : null}
    </>
  );
};
