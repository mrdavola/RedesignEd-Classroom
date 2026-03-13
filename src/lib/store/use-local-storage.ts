"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Auto-clean: strip any base64 image that was stored by older versions
        if (parsed && typeof parsed === "object" && "image" in parsed && typeof parsed.image === "string" && parsed.image.length > 1000) {
          delete parsed.image;
          window.localStorage.setItem(key, JSON.stringify(parsed));
        }
        setStored(parsed);
      }
    } catch {
      // Corrupted data — remove and start fresh
      window.localStorage.removeItem(key);
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // QuotaExceededError — skip persistence silently
    }
  };

  return [stored, setValue];
}
