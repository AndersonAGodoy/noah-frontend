export type Sermon = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  duration: string;
  date: string;
  time: string;
  eventType: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  references: {
    id: string;
    reference: string;
    text: string;
    sermonId: string;
  }[];
  contentSections: {
    id: string;
    type: string;
    content: string;
    sermonId: string;
  }[];
};

export type SermonPage = {
  items: Sermon[];
  nextCursor: string | null;
};
