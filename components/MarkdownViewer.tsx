"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Title, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({
  content,
  className,
}: MarkdownViewerProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div
      className={className}
      style={{
        color: isDark ? "#C1C2C5" : "#212529",
        lineHeight: "1.7",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <Title
              order={1}
              style={{
                fontSize: "2em",
                fontWeight: 700,
                marginTop: "24px",
                marginBottom: "16px",
                color: isDark ? "#e1e4e8" : "#1a202c",
                borderBottom: `2px solid ${isDark ? "#373A40" : "#e1e4e8"}`,
                paddingBottom: "8px",
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <Title
              order={2}
              style={{
                fontSize: "1.5em",
                fontWeight: 700,
                textAlign: isMobile ? "left" : "justify",
                marginTop: "24px",
                marginBottom: "16px",
                color: isDark ? "#F8F9FA" : "#2d3748",
                borderBottom: `1px solid ${isDark ? "#373A40" : "#e1e4e8"}`,
                paddingBottom: "8px",
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <Title
              order={3}
              style={{
                fontSize: "1.25em",
                fontWeight: 600,
                textAlign: isMobile ? "left" : "justify",
                marginTop: "20px",
                marginBottom: "12px",
                color: isDark ? "#F8F9FA" : "#2d3748",
              }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              style={{
                marginBottom: "16px",
                lineHeight: "1.7",
                textWrap: "pretty",
                textAlign: isMobile ? "left" : "justify",
              }}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                margin: "16px 0",
                padding: "12px 20px",
                borderLeft: "4px solid #7c3aed",
                background: isDark ? "#2b2841" : "#f5f3ff",
                color: isDark ? "#e5dbff" : "#4c1d95",
                fontStyle: "italic",
                textWrap: "pretty",
                borderRadius: "4px",
              }}
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                style={{
                  background: isDark ? "#2c2e33" : "#f6f8fa",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontFamily: "Monaco, Consolas, monospace",
                  fontSize: "0.9em",
                  color: isDark ? "#ff6b9d" : "#e01e5a",
                }}
                {...props}
              />
            ) : (
              <code
                style={{
                  display: "block",
                  background: isDark ? "#2c2e33" : "#f6f8fa",
                  padding: "16px",
                  borderRadius: "6px",
                  overflow: "auto",
                  fontFamily: "Monaco, Consolas, monospace",
                  fontSize: "0.9em",
                  border: `1px solid ${isDark ? "#373A40" : "#e1e4e8"}`,
                  margin: "16px 0",
                }}
                {...props}
              />
            ),
          ul: ({ node, ...props }) => (
            <ul
              style={{
                margin: "16px 0",
                paddingLeft: "32px",
                textAlign: isMobile ? "left" : "justify",
              }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              style={{
                margin: "16px 0",
                paddingLeft: "32px",
                textAlign: isMobile ? "left" : "justify",
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{
                margin: "8px 0",
                textAlign: isMobile ? "left" : "justify",
              }}
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              style={{
                color: isDark ? "#9775fa" : "#7c3aed",
                textDecoration: "none",
                fontWeight: 500,
              }}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong style={{ fontWeight: 700 }} {...props} />
          ),
          em: ({ node, ...props }) => (
            <em style={{ fontStyle: "italic" }} {...props} />
          ),
        }}
      >
        {content ||
          "*Nenhum conteúdo ainda... Digite algo no editor à esquerda para ver a prévia aqui.*"}
      </ReactMarkdown>
    </div>
  );
}
