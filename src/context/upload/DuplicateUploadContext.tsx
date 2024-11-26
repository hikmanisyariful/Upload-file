/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { BulkUploadDataModel } from "@/components/fileManagement.type";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBulkUploadContext } from "./BulkUploadContext";
import { iReqBodyGenerateDuplicateName } from "@/services/file/file.services.type";
import { useFetcherUploadFile } from "@/hooks/fetcher/useFetcherUploadFile";

type DuplicateUploadContextProps = {
  duplicateFilesStore: BulkUploadDataModel[];
  addToDuplicateStore: (dataFiles: BulkUploadDataModel) => void;
};

export const DuplicateUploadContext =
  createContext<DuplicateUploadContextProps>({
    duplicateFilesStore: [],
    addToDuplicateStore: () => undefined,
  });

export const useDuplicateUploadContext = () => {
  return useContext(DuplicateUploadContext);
};

export default function DuplicateUploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { replaceDuplicateDataOnBulkUpload } = useBulkUploadContext();
  const { generateDuplicateName } = useFetcherUploadFile();
  // Duplicate State
  const [duplicateFilesStore, setDuplicateFilesStore] = useState<
    BulkUploadDataModel[]
  >([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToDuplicateStore = useCallback((data: BulkUploadDataModel) => {
    setDuplicateFilesStore((prev) => {
      const exists = prev.some((conflict) => conflict.id === data.id);
      if (exists) {
        return prev;
      }
      return [...prev, data];
    });
  }, []);

  const replaceDuplicateFiles = useCallback(() => {
    if (duplicateFilesStore.length === 0) return;
    const newData = duplicateFilesStore.map((data) => {
      return {
        ...data,
        replace: true,
        keep: undefined,
      };
    });
    replaceDuplicateDataOnBulkUpload(newData);
    setDuplicateFilesStore([]);
    setOpenModal(false);
  }, [duplicateFilesStore]);

  const keepBothDuplicateFiles = useCallback(async () => {
    if (duplicateFilesStore.length === 0) return;

    try {
      setLoading(true);
      const results = await Promise.allSettled(
        duplicateFilesStore.map(async (data) => {
          const bodyGenerateName: iReqBodyGenerateDuplicateName = {
            name: data.fileName,
            extension: data.extension,
            parentID: data.parentID,
          };
          const responseGenerateDuplicateName = await generateDuplicateName(
            bodyGenerateName
          );
          if (responseGenerateDuplicateName.isError) {
            throw new Error("Invalid data");
          }
          return {
            ...data,
            fileName: responseGenerateDuplicateName.data?.name,
            keep: true,
            replace: false,
          } as BulkUploadDataModel;
        })
      );

      const newData: BulkUploadDataModel[] = results
        .filter(
          (result): result is PromiseFulfilledResult<BulkUploadDataModel> => {
            return result.status === "fulfilled";
          }
        )
        .map((result) => result.value);

      replaceDuplicateDataOnBulkUpload(newData);
      setDuplicateFilesStore([]);
      setLoading(false);
      setOpenModal(false);
    } catch (error) {
      setLoading(false);
      setOpenModal(false);
    }
  }, [duplicateFilesStore]);

  useEffect(() => {
    if (duplicateFilesStore.length < 1) return;
    setOpenModal(true);
  }, [duplicateFilesStore]);

  useEffect(() => {
    if (openModal) return;
    setDuplicateFilesStore([]);
  }, [openModal]);

  return (
    <DuplicateUploadContext.Provider
      value={{
        duplicateFilesStore,
        addToDuplicateStore,
      }}
    >
      {children}
    </DuplicateUploadContext.Provider>
  );
}
