import Link from "next/link";
import Image from "next/image";
import { Card, Stack, Text, Title, Flex, Badge } from "@mantine/core";
import { IconUser, IconCalendar, IconClock } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { getColorForEventType } from "../lib/utils/badgeColor";

interface SermonCardProps {
  slug: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  duration: string;
  eventType: string;
}

export function SermonCard({
  slug,
  title,
  description,
  eventType,
  speaker,
  date,
  duration,
}: SermonCardProps) {
  return (
    <Link
      href={`sermons/sermon/${slug}`}
      passHref
      style={{ textDecoration: "none" }}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ textDecoration: "none" }}
      >
        <Card
          maw={400}
          miw={400}
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
              quality={80}
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="sermon-image"
              placeholder="blur"
              blurDataURL="/noah_logo.jpg"
              style={{
                objectFit: "cover",
              }}
            />
            <Badge
              pos={"absolute"}
              top={180}
              left={320}
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

            <Flex gap="xs" justify="space-between">
              <Flex gap={2} align="center">
                <IconUser size={16} stroke={1.5} />
                <Text size="sm">{speaker}</Text>
              </Flex>
              <Flex gap={2} align="center">
                <IconCalendar size={16} stroke={1.5} />
                <Text size="sm">{date}</Text>
              </Flex>
              <Flex gap={2} align="center">
                <IconClock size={16} stroke={1.5} />
                <Text size="sm">{duration}</Text>
              </Flex>
            </Flex>
          </Stack>
        </Card>
      </motion.div>
    </Link>
  );
}
