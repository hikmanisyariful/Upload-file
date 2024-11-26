import { IconFileUpload } from "@tabler/icons-react";
import { useCallback, useRef } from "react";
import { BulkUploadDataModel } from "@/components/fileManagement.type";
import {
  generateChecksum,
  getFileExtension,
  getFileNameWithoutExtension,
} from "@/components/helpers";
import { v4 as uuidv4 } from "uuid";
import { useBulkUploadContext } from "@/context/upload/BulkUploadContext";

const InputFiles = () => {
  const { addToBulkUploads } = useBulkUploadContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        const files = Array.from(selectedFiles);
        const dataFiles: BulkUploadDataModel[] = await Promise.all(
          files.map(async (file) => {
            const fileName = getFileNameWithoutExtension(file.name) ?? "";
            const extension = getFileExtension(file.name) ?? "";
            const checksum = await generateChecksum(file);

            return {
              id: uuidv4(),
              parentID: "",
              path: "",
              file,
              fileName,
              extension,
              checksum,
              progress: 0,
              status: "PENDING",
              isFolder: false,
              fromFolder: false,
            };
          })
        );
        addToBulkUploads(dataFiles);
      }
    },
    []
  );

  return (
    <label
      htmlFor="upload-file"
      className="flex gap-2 p-2 hover:cursor-pointer hover:bg-[#E8E8E8]"
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        id="upload-file"
        onChange={handleFileChange}
        multiple
      />
      <IconFileUpload />
      <span>Upload Files</span>
    </label>
  );
};

export default InputFiles;
