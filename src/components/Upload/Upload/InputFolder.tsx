/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconFolderUp } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BulkUploadDataModel, FormDataEntry } from "../../fileManagement.type";
import {
  extractRootDirectory,
  generateChecksum,
  getFileExtension,
  getFileNameWithoutExtension,
} from "../../helpers";
import { v4 as uuidv4 } from "uuid";
import { useFetcherUploadFile } from "@/hooks/fetcher/useFetcherUploadFile";
import { useBulkUploadContext } from "@/context/upload/BulkUploadContext";
import { iReqBodyGenerateDuplicateName } from "@/services/file/file.services.type";

const InputFolder = () => {
  const { addToBulkUploads } = useBulkUploadContext();
  const { generateDuplicateName } = useFetcherUploadFile();
  const abortControllerRef = useRef(new AbortController());
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataFolderFiles, setDataFolderFiles] = useState<BulkUploadDataModel[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [alternatifRootFolderName, setAlternatifRootFolderName] = useState<
    string | null
  >();

  const handleFolderChange = useCallback(async () => {
    const folderInput = inputRef.current;
    if (!folderInput?.files) return;
    const files = folderInput.files;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append(file.webkitRelativePath, file);
    });
    const formDataEntry: FormDataEntry[] = await Promise.all(
      Array.from(formData.entries()).map(async (fileArr) => {
        const [path, file] = fileArr;
        if (file instanceof File) {
          return { path, file };
        } else {
          return null;
        }
      })
    );

    // onChange(formDataEntry);
    const dataFiles: BulkUploadDataModel[] = (
      await Promise.allSettled(
        formDataEntry.map(async (data) => {
          if (!data) {
            throw new Error("Invalid data");
          }
          const { path, file } = data;
          const fileName = getFileNameWithoutExtension(file.name) ?? "";
          const extension = getFileExtension(file.name) ?? "";
          const pathFolder = path.substring(0, path.lastIndexOf("/"));
          const checksum = await generateChecksum(file);

          return {
            id: uuidv4(),
            parentID: "",
            path: pathFolder,
            file,
            fileName,
            extension,
            checksum,
            progress: 0,
            status: "PENDING",
            isFolder: false,
            fromFolder: true,
          };
        })
      )
    )
      .filter(
        (result): result is PromiseFulfilledResult<BulkUploadDataModel> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
    const dataPath = dataFiles.map((fileData) => {
      return {
        path: fileData.path,
      };
    });
    const rootDirectoryFolderName = extractRootDirectory(dataPath);

    const payload: iReqBodyGenerateDuplicateName = {
      name: rootDirectoryFolderName[0] ?? "",
      parentID: "",
      isFolder: true,
    };
    abortControllerRef.current = new AbortController();
    const responseCheckMetaFolder = await generateDuplicateName(
      payload,
      abortControllerRef.current.signal
    );

    if (responseCheckMetaFolder.isError) return;
    if (responseCheckMetaFolder.data.exist) {
      setDataFolderFiles(dataFiles);
      setAlternatifRootFolderName(responseCheckMetaFolder.data.name);
      setOpenModal(true);
    } else {
      addToBulkUploads(dataFiles);
    }
  }, []);

  const replaceDuplicateFolder = useCallback(() => {
    if (dataFolderFiles.length === 0) return;
    const newData = dataFolderFiles.map((data) => {
      return {
        ...data,
        replace: undefined,
        keep: undefined,
      };
    });
    addToBulkUploads(newData);
    setDataFolderFiles([]);
    setOpenModal(false);
  }, [dataFolderFiles]);

  const keepBothDuplicateFolder = useCallback(() => {
    if (dataFolderFiles.length === 0) return;

    const updatedData = dataFolderFiles.map((item) => {
      const pathSegments = item.path.split("/");
      if (alternatifRootFolderName) {
        pathSegments[0] = alternatifRootFolderName;
      }
      return {
        ...item,
        path: pathSegments.join("/"),
        replace: undefined,
        keep: undefined,
      };
    });
    addToBulkUploads(updatedData);
    setDataFolderFiles([]);
    setAlternatifRootFolderName(null);
    setOpenModal(false);
  }, [dataFolderFiles, alternatifRootFolderName]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute("webkitdirectory", ""); // Ensure webkitdirectory is set
    }
  }, []);

  return (
    <>
      <label
        htmlFor="upload-folder"
        className="flex gap-2 p-2 hover:cursor-pointer hover:bg-[#E8E8E8]"
      >
        <input
          type="file"
          id="upload-folder"
          multiple
          ref={inputRef}
          onChange={handleFolderChange}
          hidden
        />
        <IconFolderUp />
        <span>Upload Folder</span>
      </label>
    </>
  );
};

export default InputFolder;
