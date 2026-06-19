export type TeacherContactChannel = {
  value: string;
  visible: boolean;
};

export type TeacherAvailabilitySlot = {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  from: string;
  to: string;
};

export type TeacherProfileData = {
  bio?: string;
  subjects?: string[];
  levels?: string[];
  contactEnabled?: boolean;
  contactAllowParents?: boolean;
  contactAllowTeachers?: boolean;
  contactNote?: string;
  contactChannels?: {
    phone?: TeacherContactChannel;
    whatsapp?: TeacherContactChannel;
    facebook?: TeacherContactChannel;
    linkedin?: TeacherContactChannel;
    emailPro?: TeacherContactChannel;
  };
  pushPrefs?: {
    mur: boolean;
    messages: boolean;
    digest: boolean;
    news: boolean;
  };
  notificationInterests?: string[];
  availability?: {
    enabled: boolean;
    acceptsTutoring: boolean;
    slots: TeacherAvailabilitySlot[];
  };
  avatarMode?: "photo" | "catalog";
};

export type TeacherPublicProfile = {
  id: number;
  fullName: string;
  username: string | null;
  image: string | null;
  avatarConfig: { id: string; style?: string; gradient?: string; icon?: string } | null;
  avatarMode: "photo" | "catalog";
  bio: string | null;
  schoolName: string | null;
  subjects: string[];
  levels: string[];
  contactEnabled: boolean;
  contactNote: string | null;
  contactChannels: TeacherProfileData["contactChannels"];
  stats: {
    publications: number;
    views: number;
    likes: number;
    rankPosts: number;
    rankLikes: number;
    totalTeachers: number;
  };
  availability: TeacherProfileData["availability"];
  isOwnProfile: boolean;
  canMessage: boolean;
  verificationApproved: boolean;
};

export type TeacherProfileFormState = {
  fullName: string;
  phone: string;
  bio: string;
  subjects: string[];
  levels: string[];
  schoolName: string;
  contactEnabled: boolean;
  contactNote: string;
  contactAllowParents: boolean;
  contactAllowTeachers: boolean;
  contactChannels: NonNullable<TeacherProfileData["contactChannels"]>;
  pushPrefs: NonNullable<TeacherProfileData["pushPrefs"]>;
  notificationInterests: string[];
  availability: NonNullable<TeacherProfileData["availability"]>;
  avatarMode: "photo" | "catalog";
  avatarConfig: { id: string; style?: string; gradient?: string; icon?: string } | null;
  image: string | null;
};
