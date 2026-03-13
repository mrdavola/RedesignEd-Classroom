"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";

export function StepUpload() {
  const { state, setState, nextStep } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(state.image);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setState((prev) => ({ ...prev, image: base64 }));
        // Brief delay so user sees the preview before advancing
        setTimeout(() => nextStep(), 800);
      };
      reader.readAsDataURL(file);
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
