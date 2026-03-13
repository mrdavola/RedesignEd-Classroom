"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.7;

/** Resize image to fit within MAX_DIMENSION and return a compressed base64 JPEG */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function StepUpload() {
  const { state, setState, nextStep } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(state.image);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const base64 = await compressImage(file);
        setPreview(base64);
        setState((prev) => ({ ...prev, image: base64 }));
        setTimeout(() => nextStep(), 800);
      } catch {
        setError("Could not process that image. Please try a different file.");
      }
    },
    [setState, nextStep],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Let&apos;s see what we&apos;re working with
        </h2>
        <p className="text-stone-500">
          Upload a photo of your classroom to see it reimagined
        </p>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-md aspect-video rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer ${
          isDragging
            ? "border-rose-400 bg-rose-50"
            : "border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100"
        }`}
      >
        {preview ? (
          <motion.img
            src={preview}
            alt="Classroom preview"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <>
            <Camera className="w-10 h-10 text-stone-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-stone-600">
                Drop your classroom photo here
              </p>
              <p className="text-xs text-stone-400 mt-1">
                or click to browse files
              </p>
            </div>
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-stone-400">Or proceed manually</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Skip button */}
      <Button variant="ghost" onClick={() => nextStep()}>
        Skip photo upload (Generic visuals)
      </Button>
    </div>
  );
}
