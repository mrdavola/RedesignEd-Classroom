"use client";

import { useState } from "react";
import { ClipboardCopy, Mail, Check, Pencil, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { PrincipalEmail } from "@/types";

interface PrincipalEmailViewProps {
  data: PrincipalEmail;
}

export function PrincipalEmailView({ data }: PrincipalEmailViewProps) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(data.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`Subject: ${data.subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-4">
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-stone-500 w-16">To:</span>
          <span className="text-stone-400 italic">Your principal</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-stone-500 w-16">Subject:</span>
          <span className="font-medium text-stone-900">{data.subject}</span>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
          <span className="text-xs text-stone-400">{editing ? "Editing" : "Preview"}</span>
          <button onClick={() => setEditing(!editing)} className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1 transition-colors">
            {editing ? (<><Eye className="w-3 h-3" /> Preview</>) : (<><Pencil className="w-3 h-3" /> Edit</>)}
          </button>
        </div>
        <div className="p-4">
          {editing ? (
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full min-h-[300px] text-sm text-stone-700 leading-relaxed resize-y focus:outline-none" />
          ) : (
            <div className="prose prose-sm prose-stone max-w-none"><ReactMarkdown>{body}</ReactMarkdown></div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleCopy} className="flex-1">
          {copied ? (<><Check className="w-4 h-4 mr-1.5" /> Copied</>) : (<><ClipboardCopy className="w-4 h-4 mr-1.5" /> Copy to Clipboard</>)}
        </Button>
        <a href={mailtoUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm"><Mail className="w-4 h-4 mr-1.5" /> Open in Mail</Button>
        </a>
      </div>

      {data.citations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Research Citations</p>
          <div className="space-y-1.5">
            {data.citations.map((cite, i) => (
              <div key={i} className="text-xs text-stone-500">
                <span className="text-stone-700">{cite.claim}</span>{" — "}<span className="italic">{cite.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
