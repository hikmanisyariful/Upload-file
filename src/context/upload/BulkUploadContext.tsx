"use client";

import { BulkUploadDataModel } from "@/components/fileManagement.type";
import BulkUpload from "@/components/BulkUpload";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DuplicateUploadProvider from "./DuplicateUploadContext";
import usePreventRefresh from "@/hooks/upload/usePreventRefresh";

type BulkUploadContextProps = {
  bulkUploadDataState: BulkUploadDataModel[];
  addToBulkUploads: (dataFiles: BulkUploadDataModel[]) => void;
  updateDataOnBulkUpload: (updatedData: BulkUploadDataModel) => void;
  removeDataOnBulkUpload: (id: string) => void;
  replaceDuplicateDataOnBulkUpload: (
    duplicateDataFiles: BulkUploadDataModel[]
  ) => void;
  haveUploadingProcess: boolean;
  closeBulkUpload: (isOpen: boolean) => void;
};

export const BulkUploadContext = createContext<BulkUploadContextProps>({
  bulkUploadDataState: [],
  addToBulkUploads: () => undefined,
  updateDataOnBulkUpload: () => undefined,
  removeDataOnBulkUpload: () => undefined,
  replaceDuplicateDataOnBulkUpload: () => undefined,
  haveUploadingProcess: false,
  closeBulkUpload: () => undefined,
});

export const useBulkUploadContext = () => {
  return useContext(BulkUploadContext);
};

export default function BulkUploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bulkUploadDataState, setBulkUploadDataState] = useState<
    BulkUploadDataModel[]
  >([]);
  const [shouldWarn, setShouldWarn] = useState(false);
  const [open, setOpen] = useState(true);

  const addToBulkUploads = useCallback((data: BulkUploadDataModel[]) => {
    setBulkUploadDataState((prev) => [...prev, ...data]);
    setOpen(true);
  }, []);

  const updateDataOnBulkUpload = useCallback(
    (updatedData: BulkUploadDataModel) => {
      setBulkUploadDataState((prev) =>
        prev.map((data) =>
          data.id === updatedData.id ? { ...updatedData } : data
        )
      );
    },
    []
  );

  const removeDataOnBulkUpload = useCallback((id: string) => {
    setBulkUploadDataState((prev) => prev.filter((data) => data.id !== id));
  }, []);

  const replaceDuplicateDataOnBulkUpload = useCallback(
    (duplicateDataFiles: BulkUploadDataModel[]) => {
      setBulkUploadDataState((prevData) =>
        prevData.map((item) => {
          const duplicateItem = duplicateDataFiles.find(
            (dup) => dup.id === item.id
          );
          return duplicateItem || item;
        })
      );
    },
    []
  );

  const closeBulkUpload = () => {
    setBulkUploadDataState([]);
    setOpen(false);
  };

  const haveUploadingProcess = useMemo(() => {
    const findUploadingData = bulkUploadDataState.filter(
      (data) => data.status === "UPLOADING"
    );

    return findUploadingData.length > 0;
  }, [bulkUploadDataState]);

  usePreventRefresh(shouldWarn);

  useEffect(() => {
    if (bulkUploadDataState.length === 0 || !haveUploadingProcess) {
      setShouldWarn(false);
      return;
    }
    setShouldWarn(true); // Enable the warning when component mounts

    return () => {
      setShouldWarn(false); // Disable the warning when component unmounts
    };
  }, [bulkUploadDataState.length, haveUploadingProcess]);

  return (
    <BulkUploadContext.Provider
      value={{
        bulkUploadDataState,
        addToBulkUploads,
        updateDataOnBulkUpload,
        removeDataOnBulkUpload,
        replaceDuplicateDataOnBulkUpload,
        haveUploadingProcess,
        closeBulkUpload,
      }}
    >
      <DuplicateUploadProvider>
        {children}
        {bulkUploadDataState.length > 0 && open ? <BulkUpload /> : null}
      </DuplicateUploadProvider>
    </BulkUploadContext.Provider>
  );
}
