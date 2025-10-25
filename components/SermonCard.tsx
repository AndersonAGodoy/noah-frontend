import Link from "next/link";
import { Card, Stack, Text, Title, Flex, Badge } from "@mantine/core";
import { IconUser, IconCalendar, IconClock } from "@tabler/icons-react";
import { getColorForEventType } from "../lib/utils/badgeColor";
import { useMediaQuery } from "@mantine/hooks";
import { formatDate } from "../lib/utils/formatDate";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

interface SermonCardProps {
  slug: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  duration: string;
  eventType: string;
}

export default function SermonCard({
  slug,
  title,
  description,
  eventType,
  speaker,
  date,
  duration,
}: SermonCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const formattedDate = formatDate(date);
  return (
    <Link
      href={`sermons/sermon/${slug}`}
      passHref
      style={{ textDecoration: "none" }}
    >
      <Card
        w="100%"
        h={{ base: 380, sm: 400 }}
        shadow="sm"
        radius="lg"
        style={{
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid transparent",
        }}
        __vars={{
          "--card-hover-transform": "translateY(-4px) scale(1.02)",
          "--card-hover-shadow":
            "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)",
          "--card-hover-border": "1px solid var(--mantine-color-violet-2)",
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "var(--card-hover-transform)";
            e.currentTarget.style.boxShadow = "var(--card-hover-shadow)";
            e.currentTarget.style.border = "var(--card-hover-border)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.border = "1px solid transparent";
          }
        }}
      >
        <Card.Section style={{ position: "relative" }}>
          <ImageWithSkeleton
            src="/noah_logo.jpg"
            alt={title}
            aspectRatio="16/9"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge
            pos="absolute"
            top={12}
            left={12}
            color={getColorForEventType(eventType)}
            size={isMobile ? "md" : "sm"}
            style={{
              zIndex: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(8px)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            variant="filled"
          >
            {eventType}
          </Badge>
        </Card.Section>

        <Stack
          p={{ base: "sm", sm: "md" }}
          gap="xs"
          justify="space-between"
          flex={1}
        >
          <Flex gap="xs" justify="space-between" align="center">
            <Title
              order={3}
              c={"violet"}
              size={isMobile ? "lg" : "md"}
              lineClamp={2}
            >
              {title}
            </Title>
          </Flex>

          <Text
            size={isMobile ? "md" : "sm"}
            c="dimmed"
            ta="justify"
            lineClamp={3}
          >
            {description}
          </Text>

          {/* Rodapé aprimorado */}
          <Flex direction="column" mt="sm" gap={8}>
            <Flex
              gap="md"
              align="center"
              justify="flex-start"
              style={{
                borderTop: "1px solid #eee",
                paddingTop: 8,
              }}
            >
              <Flex gap={4} align="center" c="dimmed">
                <IconUser size={isMobile ? 16 : 14} stroke={1.2} />
                <Text size={isMobile ? "sm" : "xs"}>{speaker}</Text>
              </Flex>
              <Flex gap={4} align="center" c="dimmed">
                <IconCalendar size={isMobile ? 16 : 14} stroke={1.2} />
                <Text size={isMobile ? "sm" : "xs"}>{formattedDate}</Text>
              </Flex>
              <Flex gap={4} align="center" c="dimmed">
                <IconClock size={isMobile ? 16 : 14} stroke={1.2} />
                <Text size={isMobile ? "sm" : "xs"}>{duration}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </Card>
    </Link>
  );
}
