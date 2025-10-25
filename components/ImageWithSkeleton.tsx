"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Skeleton, Center } from "@mantine/core";
import { IconBuildingChurch } from "@tabler/icons-react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
}

export const ImageWithSkeleton = ({
  src,
  alt,
  aspectRatio = "16/9",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {/* Skeleton loading */}
      {!isLoaded && !hasError && (
        <Skeleton
          height="100%"
          width="100%"
          animate
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <Center
            h="100%"
            style={{
              background: "linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)",
            }}
          >
            <IconBuildingChurch
              size={48}
              color="var(--mantine-color-violet-4)"
              style={{ opacity: 0.6 }}
            />
          </Center>
        </Skeleton>
      )}

      {/* Imagem real */}
      <Image
        src={src}
        alt={alt}
        fill
        quality={85}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        style={{
          objectFit: "cover",
          transition: "opacity 0.3s ease-in-out",
          opacity: isLoaded ? 1 : 0,
        }}
      />

      {/* Overlay gradiente */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Fallback para erro */}
      {hasError && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, var(--mantine-color-violet-1) 0%, var(--mantine-color-violet-2) 100%)",
            zIndex: 1,
          }}
        >
          <Center h="100%">
            <IconBuildingChurch
              size={48}
              color="var(--mantine-color-violet-6)"
              style={{ opacity: 0.8 }}
            />
          </Center>
        </Box>
      )}
    </Box>
  );
};
