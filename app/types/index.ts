import { User } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export type UserType = "new" | "student" | "teacher";

export type Session = {
  capacity: number,
  id?: string,
  number_enrolled: number,
  restricted_to?: string | string[],
  advanced_restriction_type?: "OR" | "AND",
  room?: string,
  session: number,
  subtitle?: string,
  teacher: string | null,
  teacher_id?: string,
  title?: string,
  created_at?: Date,
}

export type UpsignUser = {
  email: string,
  name: string,
  type: string,
  uid?: string,
  groups?: string[],
  nickname?: string,
}

export type RootContext = {
  db: Firestore,
  user: UpsignUser,
  userType?: UserType,
  authUser?: User,
}

export type Attendance = "present" | "tardy" | "absent" | "" | null;

export type Enrollment = {
  id?: string;
  attendance?: Attendance;
  name: string;
  session?: number;
  session_id?: string;
  teacher_id?: string;
  uid?: string;
  flag?: string;
  locked?: boolean;
  nickname?: string;
}

export type DefaultDayOption = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "today" | "tomorrow";
