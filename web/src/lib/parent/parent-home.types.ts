export type ParentHomeMessagePreview = {
  id: number;
  labelKey: string | null;
  otherUserName: string | null;
  preview: string;
  unreadCount: number;
  updatedAt: string;
};

export type ParentHomeNewsPreview = {
  id: number;
  titleFr: string;
  titleAr: string;
  excerptFr: string;
  excerptAr: string;
  publishedAt: string;
  unread: boolean;
};

export type ParentHomeChildToday = {
  childId: number;
  pendingMissions: number;
  pendingGeny: number;
  screenMinutesToday: number;
  dailyScreenLimit: number;
  readingStreakDays: number;
};

export type ParentHomeExtras = {
  messagePreviews: ParentHomeMessagePreview[];
  totalUnreadMessages: number;
  newsPreviews: ParentHomeNewsPreview[];
  childrenToday: ParentHomeChildToday[];
};
