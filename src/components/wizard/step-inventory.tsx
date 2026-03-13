"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";
import { useWizard } from "@/lib/store/wizard-context";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import type { Inventory } from "@/types";

export function StepInventory() {
  const { state, setState, nextStep, prevStep } = useWizard();
  const [scanning, setScanning] = useState(false);

  // If there's an image, attempt to scan it for inventory
  useEffect(() => {
    if (!state.image) return;

    let cancelled = false;
    setScanning(true);

    fetch("/api/scan-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: state.image }),
    })
      .then((res) => res.json())
      .then((data: Partial<Inventory>) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          inventory: { ...prev.inventory, ...data },
        }));
      })
      .catch(() => {
        // Scan failed — keep defaults
      })
      .finally(() => {
        if (!cancelled) setScanning(false);
      });

    return () => {
      cancelled = true;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field: keyof Inventory, value: number) => {
    setState((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, [field]: value },
    }));
  };

  if (scanning) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ScanLine className="w-12 h-12 text-rose-700" />
        </motion.div>
        <p className="text-stone-600 font-medium">
          Scanning your classroom photo for furniture...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with badge */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900 mb-1">
            What&apos;s in the room?
          </h2>
          <p className="text-stone-500 text-sm">
            Adjust counts so the redesign uses only what you have.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1">
          Zero Budget Constraint
        </span>
      </div>

      {/* Big Items */}
      <section>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Big Items
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NumberInput
            label="Student Desks"
            value={state.inventory.studentDesks}
            onChange={(v) => updateField("studentDesks", v)}
            min={0}
            max={60}
          />
          <NumberInput
            label="Teacher Desks"
            value={state.inventory.teacherDesks}
            onChange={(v) => updateField("teacherDesks", v)}
            min={0}
            max={5}
          />
          <NumberInput
            label="Kidney Tables"
            value={state.inventory.kidneyTables}
            onChange={(v) => updateField("kidneyTables", v)}
            min={0}
            max={10}
          />
          <NumberInput
            label="Student Chairs"
            value={state.inventory.studentChairs}
            onChange={(v) => updateField("studentChairs", v)}
            min={0}
            max={60}
          />
        </div>
      </section>

      {/* The Details */}
      <section>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          The Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NumberInput
            label="Carpets / Rugs"
            value={state.inventory.carpets}
            onChange={(v) => updateField("carpets", v)}
            min={0}
            max={10}
          />
          <NumberInput
            label="Shelves"
            value={state.inventory.shelves}
            onChange={(v) => updateField("shelves", v)}
            min={0}
            max={20}
          />
          <NumberInput
            label="Easels"
            value={state.inventory.easels}
            onChange={(v) => updateField("easels", v)}
            min={0}
            max={10}
          />
          <NumberInput
            label="Bins"
            value={state.inventory.bins}
            onChange={(v) => updateField("bins", v)}
            min={0}
            max={50}
          />
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={prevStep}>
          Back
        </Button>
        <Button variant="primary" onClick={nextStep}>
          Continue
        </Button>
      </div>
    </div>
  );
}
