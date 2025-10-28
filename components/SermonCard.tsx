import Link from "next/link";
import Image from "next/image";
import { Card, Stack, Text, Title, Flex, Badge } from "@mantine/core";
import { IconUser, IconCalendar, IconClock } from "@tabler/icons-react";
import { getColorForEventType } from "../lib/utils/badgeColor";
import { useMediaQuery } from "@mantine/hooks";
import { memo } from "react";

interface SermonCardProps {
  slug: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  duration: string;
  eventType: string;
}

const SermonCard = memo(function SermonCard({
  slug,
  title,
  description,
  eventType,
  speaker,
  date,
  duration,
}: SermonCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Link
      href={`sermons/sermon/${slug}`}
      passHref
      style={{ textDecoration: "none" }}
      aria-label={`Ver detalhes do sermão: ${title}`}
    >
      <Card
        maw={isMobile ? 200 : 400}
        miw={isMobile ? 340 : 400}
        mih={400}
        shadow="sm"
        radius="md"
        style={{ cursor: "pointer" }}
      >
        <Card.Section
          style={{ position: "relative", height: 200, overflow: "hidden" }}
        >
          <Image
            src={"/noah_logo.jpg"}
            alt={title}
            quality={75}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            style={{
              objectFit: "cover",
            }}
          />
          <Badge
            pos={"absolute"}
            top={180}
            left={isMobile ? 260 : 320}
            color={getColorForEventType(eventType)}
          >
            {eventType}
          </Badge>
        </Card.Section>

        <Stack p="md" gap="xs" justify="space-between" flex={1}>
          <Flex gap="xs" justify="space-between" align="center">
            <Title order={3} c={"violet"}>
              {title}
            </Title>
          </Flex>

          <Text size="sm" c="dimmed" ta="justify" lineClamp={3}>
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
                <IconUser size={14} stroke={1.2} />
                <Text size="xs">{speaker}</Text>
              </Flex>
              <Flex gap={4} align="center" c="dimmed">
                <IconCalendar size={14} stroke={1.2} />
                <Text size="xs">{date}</Text>
              </Flex>
              <Flex gap={4} align="center" c="dimmed">
                <IconClock size={14} stroke={1.2} />
                <Text size="xs">{duration}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </Card>
    </Link>
  );
});

export default SermonCard;
