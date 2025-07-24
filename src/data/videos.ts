// src/data/videos.ts
import { VideoData } from "../types/types";

// Inga thaan namma video data-va hardcode panrom.
// Ovvoru video-kum oru unique 'id' and 'likeCount' irukuradhu mukkiyam.
export const videoData: VideoData[] = [
  {
    id: 'video-01',
    url: 'https://assets.mixkit.co/videos/48284/48284-720.mp4',
    user: { name: '@react_dev', avatar: 'https://i.pravatar.cc/150?u=react_dev' },
    description: 'Having fun with React Native! #coding #devlife',
    likeCount: 123000,
  },
  {
    id: 'video-02',
    url: 'https://assets.mixkit.co/videos/344/344-720.mp4',
    user: { name: '@nature_lover', avatar: 'https://i.pravatar.cc/150?u=nature_lover' },
    description: 'Morning run at the beach ☀️',
    likeCount: 45100,
  },
  {
    id: 'video-03',
    url: 'https://assets.mixkit.co/videos/303/303-720.mp4',
    user: { name: '@foodie', avatar: 'https://i.pravatar.cc/150?u=foodie' },
    description: 'Sweet treats!',
    likeCount: 2000000,
  },
  {
    id: 'video-04',
    url: 'https://assets.mixkit.co/videos/33872/33872-720.mp4',
    user: { name: '@surfer_dude', avatar: 'https://i.pravatar.cc/150?u=surfer_dude' },
    description: 'Catching the perfect wave!',
    likeCount: 89000,
  },
];
