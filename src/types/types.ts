// src/types/types.ts

// Type for a single video object
export interface VideoData {
  id: string;
  url: string;
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  likeCount: number; // likeCount-ah number-a add panrom
}

// Type for user data stored in Firestore
export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
