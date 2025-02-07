"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void,
    onProgress?: (progress: number) => void,
    fileType?: "image" | "video"
}

export default function FileUploadProps({ onSuccess, onProgress, fileType }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [Error, setError] = useState<string | null>(null);
    const onError = (err: { message: string }) => {
        console.log('Error: ', err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false);
        setError(null);
        onSuccess(res);
    };

    const handleUploadProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete));
        }

    };

    const handleUploadStart = () => {
        setUploading(true);
        setError(null);
    }

    const validateFile = (file: File) => {
        if (file.type === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload video");
                return false
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("Video must be less than 10 MB");
                return false
            }
        } else {
            const validTypes = ["image/jpeg", "image/png", "image/webp"]
            if (!validTypes.includes(file.type)) {
                setError("Please upload image(JPEG, PNG, webP)");
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5 MB");
                return false;
            }
        }
        return false;
    }
    return (
        <div className="space-y-2">
            <IKUpload
                fileName={fileType === "video" ? "video" : "image"}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleUploadProgress}
                onUploadStart={handleUploadStart}
                validateFile={validateFile}
                useUniqueFileName={true}
                folder={fileType === "video" ? "/videos" : "/images"}
            />
            {uploading && (
                <div className="flex gap-2 items-center text-primary text-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                </div>)}
            {Error && (
                <div className="text-error text-sm">{Error}</div>
            )}
        </div>
    );
}