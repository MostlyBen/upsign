// Config
import allowStudentRegister from "./config/allowStudentRegister";
import getDomainRestriction from './config/getDomainRestriction';
import getTeacherSignupAllowed from "./config/getTeacherSignupAllowed";

// Data
import numberToArrayOfStrings from "./data/numberToArrayOfStrings";
import getNextFriday from "./data/getNextFriday";

// Groups
import getGroups from "./groups/getGroups";

// Info
import getSubdomain from "./info/getSubdomain";

// Sessions
import getTeacherSessions from "./sessions/getTeacherSessions";
import getHourSessions from "./sessions/getHourSessions";
import getSignupAllowed from "./sessions/getSignupAllowed";
import getUnsignedStudents from "./sessions/getUnsignedStudents";
import getAllStudents from "./sessions/getAllStudents";
import enrollStudent from "./sessions/enrollStudent";
import { unenrollFromHour } from "./sessions/enrollStudent";

// User
import getUserType from "./user/getUserType";
import setUserType from "./user/setUserType";

export {
  allowStudentRegister,
  getDomainRestriction,
  getTeacherSignupAllowed,

  numberToArrayOfStrings,
  getNextFriday,

  getGroups,

  getSubdomain,

  getTeacherSessions,
  getHourSessions,
  getSignupAllowed,
  getUnsignedStudents,
  getAllStudents,
  enrollStudent,
  unenrollFromHour,

  getUserType,
  setUserType,
}