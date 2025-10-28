"use client";

import { useMantineColorScheme, Box, Textarea } from "@mantine/core";
import MarkdownViewer from "./MarkdownViewer";
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do seu sermão em Markdown...",
  height = 600,
}: MarkdownEditorProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Estado local para input imediato
  const [localValue, setLocalValue] = useState(value);

  // Debounce do valor para preview (300ms)
  const [debouncedValue] = useDebouncedValue(localValue, 300);

  // Sincronizar valor externo com local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Atualizar parent apenas quando debounced value mudar
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  return (
    <Box
      style={{
        display: "flex",
        gap: 0,
        height: `${height}px`,
        alignItems: "stretch",
        border: `1px solid ${isDark ? "#373A40" : "#dee2e6"}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Editor - 50% width */}
      <Box
        style={{
          width: "50%",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Textarea
          value={localValue}
          onChange={(event) => setLocalValue(event.currentTarget.value)}
          placeholder={placeholder}
          styles={{
            input: {
              height: "100%",
              minHeight: `${height}px`,
              fontFamily: "'JetBrains Mono', 'Monaco', 'Consolas', 'Courier New', monospace",
              fontSize: "14px",
              lineHeight: "1.6",
              padding: "20px",
              border: "none",
              borderRadius: 0,
              backgroundColor: isDark ? "#1A1B1E" : "#ffffff",
              color: isDark ? "#C1C2C5" : "#212529",
              resize: "none",
              "&:focus": {
                borderColor: "transparent",
                outline: "none",
              },
            },
            wrapper: {
              height: "100%",
            },
            root: {
              height: "100%",
            },
          }}
        />
      </Box>

      {/* Viewer - 50% width */}
      <Box
        style={{
          width: "50%",
          minWidth: 320,
          borderLeft: isDark ? "1px solid #373A40" : "1px solid #dee2e6",
          overflow: "hidden",
          backgroundColor: isDark ? "#25262b" : "#fafbfc",
        }}
      >
        <Box
          style={{
            height: "100%",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <MarkdownViewer content={debouncedValue} />
        </Box>
      </Box>
    </Box>
  );
}
