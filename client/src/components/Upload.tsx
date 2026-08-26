import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Authentication request failed: ${message}`);
  }
};

interface UploadProps {
  children: ReactNode;
  type: string;
  setProgress: (progress: number) => void;
  setData: (data: unknown) => void;
}

const Upload = ({ children, type, setProgress, setData }: UploadProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  const onError = (err: unknown) => {
    if (err instanceof ImageKitAbortError) {
      console.error("Upload aborted:", err.reason);
    } else if (err instanceof ImageKitInvalidRequestError) {
      console.error("Invalid upload request:", err.message);
    } else if (err instanceof ImageKitUploadNetworkError) {
      console.error("Upload network error:", err.message);
    } else if (err instanceof ImageKitServerError) {
      console.error("ImageKit server error:", err.message);
    } else {
      console.error("Upload error:", err);
    }
    toast.error("Image upload failed!");
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      abortController.current?.abort();
      abortController.current = new AbortController();
      const { signature, expire, token, publicKey } = await authenticator();
      const response = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature,
        expire,
        token,
        useUniqueFileName: true,
        abortSignal: abortController.current.signal,
        onProgress: (progress) => {
          setProgress((progress.loaded / progress.total) * 100);
        },
      });

      setData(response);
    } catch (error) {
      onError(error);
    } finally {
      abortController.current = null;
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
        onChange={onChange}
      />
      <div className="cursor-pointer" onClick={() => ref.current?.click()}>
        {children}
      </div>
    </>
  );
};

export default Upload;