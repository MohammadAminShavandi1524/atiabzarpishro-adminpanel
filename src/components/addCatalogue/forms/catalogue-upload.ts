import type { UploadResponse } from "../catalogue.types";

interface UploadFileOptions {
  file: File;

  url: string;

  onProgress: (value: number) => void;

  onFinalizing: (value: boolean) => void;
}

export const uploadCatalogueFile = ({
  file,
  url,
  onProgress,
  onFinalizing,
}: UploadFileOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.upload.onloadstart = () => {
      onProgress(0);

      onFinalizing(false);
    };

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const rawProgress = Math.round((event.loaded / event.total) * 100);

      onProgress(Math.min(rawProgress, 95));
    };

    xhr.upload.onload = () => {
      onProgress(95);

      onFinalizing(true);
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        onFinalizing(false);

        reject(new Error("Upload failed"));

        return;
      }

      try {
        const response: UploadResponse = JSON.parse(xhr.responseText);

        if (!response.url) {
          throw new Error("URL not returned");
        }

        onProgress(100);

        onFinalizing(false);

        resolve(response.url);
      } catch {
        onFinalizing(false);

        reject(new Error("Invalid upload response"));
      }
    };

    xhr.onerror = () => {
      onFinalizing(false);

      reject(new Error("Upload failed"));
    };

    xhr.onabort = () => {
      onFinalizing(false);

      reject(new Error("Upload aborted"));
    };

    xhr.send(formData);
  });
};
