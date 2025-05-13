"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Loader, UploadCloud, X } from "lucide-react";
import { deleteImageFromTrip } from "@/actions/image";
import { Button } from "@/components/ui/button";

export default function TripImageSingle({ imageObj, trip }) {
  console.log(imageObj);

  const [loading, setLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  async function handleRemoveImage(e, fileId) {
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await fetch("/api/image/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: fileId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }

      await deleteImageFromTrip({
        trip: trip,
        fileId: fileId,
      });

      const result = await response.json();
      console.log("File deleted successfully:", result);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setLoading(false);
    }

    setIsLightboxOpen(false);
  }

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div className="aspect-square w-full">
      <div className="relative w-full h-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden group">
        <Image
          src={imageObj?.thumbnailUrl}
          alt="Selected preview"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          style={{ objectFit: "fill" }}
          className="cursor-pointer group-hover:brightness-90 transition-all"
          onClick={openLightbox}
        />

        <div className="absolute top-2 right-2 flex flex-col space-y-1.5 z-10">
          {loading ? (
            <Loader className="animate-spin text-gray-500" size={20} />
          ) : (
            <Button
              variant=""
              size="sm"
              onClick={(e) => handleRemoveImage(e, imageObj?.fileId)}
              aria-label="Delete image"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 bg-opacity-85 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imageObj?.url}
              alt="Enlarged preview"
              width={1920}
              height={1080}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                width: "auto",
                height: "auto",
              }}
              className="rounded-md shadow-2xl"
            />
            <button
              onClick={closeLightbox}
              className="absolute top-[-12px] right-[-12px] sm:top-2 sm:right-2 bg-white text-black rounded-full p-1.5 shadow-lg hover:bg-gray-200 transition-colors z-60"
              aria-label="Close image viewer"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
