import {
  IconChevronDown,
  IconChevronUp,
  IconCloudUpload,
  IconX,
} from "@tabler/icons-react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { useMemo } from "react";
import UploadFile from "./UploadFile";
import { useBulkUploadContext } from "@/context/upload/BulkUploadContext";

export default function BulkUpload() {
  const { bulkUploadDataState } = useBulkUploadContext();
  const [isMinimized, setIsMinimized] = React.useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="z-100 fixed bottom-[16px] right-[16px]">
      <div className="flex max-h-[580px] w-[425px] flex-col divide-y divide-gray-300 rounded-md border border-gray-300 bg-white shadow-md">
        <WholeUploadProgress>
          {isMinimized ? (
            <IconChevronUp
              onClick={handleMinimize}
              className="hover:cursor-pointer"
            />
          ) : (
            <IconChevronDown
              onClick={handleMinimize}
              className="hover:cursor-pointer"
            />
          )}
        </WholeUploadProgress>
        <OverlayScrollbarsComponent
          options={{ scrollbars: { autoHide: "scroll" } }}
          className="shrink-0 grow basis-auto overflow-y-auto transition-all duration-300 max-h-[450px] opacity-100"
        >
          <div className="divide-y divide-gray-300 px-4">
            {bulkUploadDataState.map((data) => {
              return <UploadFile key={data.id} fileData={data} />;
            })}
          </div>
        </OverlayScrollbarsComponent>
        <FooterBulkUpload />
      </div>
    </div>
  );
}

const FooterBulkUpload = () => {
  const { bulkUploadDataState, haveUploadingProcess } = useBulkUploadContext();
  const infoUpload = useMemo(() => {
    const totalUploadingFile = bulkUploadDataState.filter(
      (data) => data.status === "UPLOADING"
    );
    const totalSuccessFile = bulkUploadDataState.filter(
      (data) => data.status === "SUCCESS"
    );
    if (haveUploadingProcess) {
      if (totalUploadingFile.length > 1) {
        return `Uploading ${totalUploadingFile.length} files...`;
      } else {
        return `Uploading ${totalUploadingFile.length} file.`;
      }
    } else {
      if (totalSuccessFile.length > 1) {
        return `Uploaded ${totalSuccessFile.length} files...`;
      } else {
        return `Uploaded ${totalSuccessFile.length} file.`;
      }
    }
  }, [bulkUploadDataState, haveUploadingProcess]);

  return (
    <div className={"flex w-full justify-between max-h-auto p-4 opacity-100"}>
      <div className="flex flex-grow items-center gap-4">
        <IconCloudUpload className="size-4 stroke-disabled_color" />
        <span className="stroke-disabled_color">{infoUpload}</span>
      </div>
    </div>
  );
};

const WholeUploadProgress = ({ children }: { children: React.ReactNode }) => {
  const { bulkUploadDataState, haveUploadingProcess, closeBulkUpload } =
    useBulkUploadContext();

  const progress = useMemo(() => {
    const findSuccessData = bulkUploadDataState.filter(
      (data) => data.status === "SUCCESS"
    );
    if (findSuccessData.length === 0) return 0;
    const totalProgressFiles = findSuccessData.reduce((acc, curr) => {
      return acc + curr.progress;
    }, 0);
    return totalProgressFiles / findSuccessData.length;
  }, [bulkUploadDataState]);

  return (
    <div className="grid w-full grid-cols-11 grid-rows-none gap-4 p-4">
      <div className="col-span-9 flex items-center gap-4">
        <span className="text-lg font-medium tracking-tight text-black">
          Upload
        </span>
        <BarProgress progress={progress} color="#0588F0" height="8px" />
      </div>
      <div className="col-span-2 flex w-full items-center justify-end gap-2">
        {children}
        {progress === 100 || !haveUploadingProcess ? (
          <IconX
            className="hover:cursor-pointer"
            onClick={() => {
              closeBulkUpload(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

type BarProgressProps = {
  progress: number; // Progress percentage (0 to 100)
  height?: string; // Optional height of the bar
  color?: string; // Optional color for the progress bar
  backgroundColor?: string; // Optional background color of the bar
};

const BarProgress: React.FC<BarProgressProps> = ({
  progress,
  height = "8px",
  color = "#4caf50",
  backgroundColor = "#F0F0F3",
}) => {
  return (
    <div
      style={{
        backgroundColor,
        borderRadius: "8px",
        width: "100%",
        height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          borderRadius: "8px",
          height: "100%",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
};
