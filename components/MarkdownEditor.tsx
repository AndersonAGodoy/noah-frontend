"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Importação dinâmica para evitar SSR issues
const Editor = dynamic(
  () => import("@bytemd/react").then((mod) => mod.Editor),
  { ssr: false }
);

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const plugins = [gfm(), highlight()];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do seu sermão em Markdown...",
  height = 600,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          height: `${height}px`,
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        Carregando editor...
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Editor
        value={value}
        onChange={onChange}
        plugins={plugins}
        placeholder={placeholder}
      />
    </div>
  );
}
