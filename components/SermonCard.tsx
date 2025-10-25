import Link from "next/link";
import Image from "next/image";
import { Card, Stack, Text, Title, Flex, Badge } from "@mantine/core";
import { IconUser, IconCalendar, IconClock } from "@tabler/icons-react";
import { getColorForEventType } from "../lib/utils/badgeColor";
import { useMediaQuery } from "@mantine/hooks";
import { formatDate } from "../lib/utils/formatDate";

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
        radius="md"
        style={{ cursor: "pointer" }}
      >
        <Card.Section
          style={{
            position: "relative",
            height: isMobile ? 180 : 200,
            overflow: "hidden",
          }}
        >
          <Image
            src={"/noah_logo.jpg"}
            alt={title}
            quality={80}
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="/noah_logo.jpg"
            style={{
              objectFit: "cover",
            }}
          />
          <Badge
            pos={"absolute"}
            top={8}
            left={8}
            color={getColorForEventType(eventType)}
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
