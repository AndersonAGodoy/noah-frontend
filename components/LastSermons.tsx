import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconChecks,
  IconClockHour4,
  IconEdit,
  IconPencilShare,
  IconSquareRoundedX,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { getColorForEventType } from "../lib/utils/badgeColor";
type SermonProps = {
  id: string;
  title: string;
  speaker: string;
  eventType: string;
  date: string;
  onRemove?: () => void;
  onpublish?: () => void;
  isPending?: boolean;
  isPublished?: boolean;
};

export default function LastSermons({
  id,
  title,
  speaker,
  eventType,
  date,
  onRemove,
  onpublish,
  isPending,
  isPublished,
}: SermonProps) {
  const isMobile = useMediaQuery("(max-width: 1175px)");

  return (
    <Card shadow="sm" mt="sm" padding="lg" radius="md" withBorder>
      <Card.Section p="md">
        <Box
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "xs" : "md",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack>
            <Text ta={isMobile ? "center" : "initial"}>{title}</Text>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              c={"dimmed"}
            >
              <IconUsers size={14} stroke={1.5} />
              <Text c="dimmed" ml={"xs"}>
                {speaker}
              </Text>

              <Text c="dimmed" mr={"xs"} ml={"xs"}>
                •
              </Text>
              <IconClockHour4 size={14} stroke={1.5} />
              <Text c="dimmed" ml={"xs"}>
                {date}
              </Text>
            </Box>
          </Stack>
          <Flex
            mt={isMobile ? "xs" : "md"}
            gap={isMobile ? "xs" : "md"}
            align={isMobile ? "flex-start" : "center"}
            direction={isMobile ? "column" : "row"}
            justify={isMobile ? "flex-start" : "space-between"}
          >
            <Badge
              size={isMobile ? "sm" : "md"}
              variant="filled"
              fullWidth={isMobile}
              color={getColorForEventType(eventType)}
            >
              {eventType}
            </Badge>

            <Button
              fullWidth={isMobile}
              color="violet"
              mr={"xs"}
              variant="outline"
              leftSection={
                isPublished ? <IconChecks color="green" /> : <IconPencilShare />
              }
              onClick={onpublish}
              disabled={isPublished}
              loading={isPending}
            >
              {isPublished ? "Sermão publicado" : " Publicar Sermão"}
            </Button>

            {!isPublished && (
              <Button
                component={Link}
                fullWidth={isMobile}
                variant="outline"
                href={`/dashboard/sermons/update/${id}`}
                color="violet"
                mr={"xs"}
                leftSection={<IconEdit />}
              >
                Editar
              </Button>
            )}
            <Button
              fullWidth={isMobile}
              variant="outline"
              color="red"
              onClick={onRemove}
              leftSection={<IconSquareRoundedX />}
            >
              Remover
            </Button>
          </Flex>
        </Box>
      </Card.Section>
    </Card>
  );
}
