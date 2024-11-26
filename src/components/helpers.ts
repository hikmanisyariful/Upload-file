export function formatFileSize(sizeInBytes: number): string {
  const units = ["Byte", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  for (let i = 0; i < units.length; i++) {
    if (size < 1024 || i === units.length - 1) {
      return `${size.toFixed(0)} ${units[i]}`;
    }
    size /= 1024;
  }
  return `${size.toFixed(0)} Byte`;
}

export function formatLastModified(updatedDate: string): string {
  const now = new Date();
  const lastModifiedDate = new Date(updatedDate);
  const timeDifference = now.getTime() - lastModifiedDate.getTime();
  if (lastModifiedDate.toDateString() === now.toDateString()) {
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }
  return lastModifiedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const getFileExtension = (fileName: string): string | null => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : null;
};

export const getFileNameWithoutExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
};

export async function generateChecksum(file: File) {
  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Generate the hash with the Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  // Convert ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export const chunkingFile = (file: File, totalChunks: number) => {
  const chunkSize = Math.ceil(file.size / totalChunks);
  const chunks = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = file.slice(start, end);
    chunks.push(chunk);
  }
  return chunks;
};

export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const extractRootDirectory = (data: { path: string }[]) => {
  const rootDirectories = Array.from(
    new Set(data.map((item) => item.path.split("/")[0]).filter((name) => name))
  );
  return rootDirectories;
};
