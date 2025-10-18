"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Importação dinâmica para evitar SSR issues
const Viewer = dynamic(
  () => import("@bytemd/react").then((mod) => mod.Viewer),
  { ssr: false }
);

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const plugins = [gfm(), highlight()];

export default function MarkdownViewer({
  content,
  className,
}: MarkdownViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>Carregando conteúdo...</div>;
  }

  return (
    <div className={className}>
      <Viewer value={content} plugins={plugins} />
    </div>
  );
}
