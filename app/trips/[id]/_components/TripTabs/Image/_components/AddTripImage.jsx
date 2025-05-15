"use client";

import { addImageToTrip } from "@/actions/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AddTripImage({ trip }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/image");
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
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      if (!selectedImage.type.includes("image")) {
        alert("Please select a valid image file");
        return;
      }
      setLoading(true);
      let authParams;
      try {
        authParams = await authenticator();
      } catch (authError) {
        console.error("Failed to authenticate for upload:", authError);
        return;
      }
      const { signature, expire, token, publicKey } = authParams;

      try {
        const uploadResponse = await upload({
          expire,
          token,
          signature,
          publicKey,
          file: selectedImage,
          fileName: selectedImage.name,

          //   onProgress: (event) => {
          //     setProgress((event.loaded / event.total) * 100);
          //   },

          abortSignal: abortController.signal,
        });

        const imageObj = {
          url: uploadResponse.url,
          name: uploadResponse.name,
          fileId: uploadResponse.fileId,
          thumbnailUrl: uploadResponse.thumbnailUrl,
        };

        const updatedTrip = await addImageToTrip({
          tripId: trip.id,
          imageObj: imageObj,
        });
        if (updatedTrip) {
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
          console.error("Server error:", error.message);
        } else {
          console.error("Upload error:", error);
        }
        toast.error("Upload failed. Please try again later.");
      } finally {
        setLoading(false);
      }

      setSelectedImage(null);
      setPreviewUrl(null);
      setOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="" size="icon" className={"flex  w-30"}>
          <ImagePlus className="h-4 w-4" />
          <div>Add Image</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>
            Upload an image to your trip gallery
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            {previewUrl ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  objectFit="cover"
                  fill
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-muted rounded-full  hover:bg-black/70 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="h-8 w-8 " />
                <p className="text-sm ">Click to upload an image</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedImage || loading}
            onClick={handleUpload}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
