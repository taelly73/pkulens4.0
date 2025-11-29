

export enum UserRole {
  UNDERGRAD_LOW = 'Freshman/Sophomore',
  UNDERGRAD_HIGH = 'Junior/Senior',
  GRADUATE = 'Graduate Student',
  INTERNATIONAL = 'International Student'
}

export enum ActivityCategory {
  ACADEMIC = 'Academic',
  SOCIAL = 'Social',
  CULTURE = 'Culture',
  SPORTS = 'Sports',
  CAREER = 'Career',
  VOLUNTEER = 'Volunteer'
}

export interface Activity {
  id: string;
  title: string;
  titleEn?: string;
  organizer: string;
  date: string; // Event Start Date
  time: string; // Event Time
  location: string;
  category: ActivityCategory;
  description: string;
  descriptionEn?: string;
  image: string;
  externalLink?: string; 
  tags: string[];
  registrationDeadline: string; // New field: When registration closes
  status?: 'registering' | 'closed' | 'ended' | 'upcoming'; // Derived status
  registeredCount?: number;
  maxCapacity?: number;
}

export interface Review {
  id: string;
  activityId: string;
  activityTitle: string;
  rating: number;
  content: string;
  timestamp: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  description: string;
}

export interface User {
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: ActivityCategory[];
  joinedActivities: string[]; // IDs of upcoming/joined
  savedActivities: string[]; // IDs
  completedActivities: string[]; // IDs of past/finished
  redeemedRewards: string[]; // IDs of rewards
  points: number;
  reviews: Review[];
}

export enum ViewState {
  HOME = 'HOME',
  ACTIVITIES = 'ACTIVITIES',
  INTERACTION = 'INTERACTION',
  MY_ACTIVITIES = 'MY_ACTIVITIES',
  ACTIVITY_DETAIL = 'ACTIVITY_DETAIL',
  CATEGORY_DETAIL = 'CATEGORY_DETAIL',
  LOGIN = 'LOGIN'
}

export type PostTag = 'Discussion' | 'Team Up' | 'Lost & Found' | 'Help';

export interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  user: string;
  userRole?: string;
  avatar?: string;
  content: string;
  image?: string;
  tag: PostTag;
  timestamp: string;
  likes: number;
  commentsCount: number; 
  isLiked?: boolean;
  comments: Comment[]; 
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'system';
  content: string;
  timestamp: string;
  isRead: boolean;
  receiver: string; 
  sender?: string; 
  linkId?: string; 
}