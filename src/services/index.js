// Config
import allowStudentRegister from "./config/allowStudentRegister";
import getDomainRestriction from "./config/getDomainRestriction";
import getNumberSessions from "./config/getNumberSessions";
import getSessionTimes from "./config/getSessionTimes";
import getSignupAllowed from "./config/getSignupAllowed";
import getTeacherSignupAllowed from "./config/getTeacherSignupAllowed";
import setDomainRestriction from "./config/setDomainRestriction";

// Data
import getNextFriday from "./data/getNextFriday";

// Groups
import getGroups from "./groups/getGroups";

// Sessions
import enrollStudent from "./sessions/enrollStudent";
import getAllStudents from "./sessions/getAllStudents";
import getHourSessions from "./sessions/getHourSessions";
import getTeacherSessions from "./sessions/getTeacherSessions";
import getUnsignedStudents from "./sessions/getUnsignedStudents";

// User
import getUserType from "./user/getUserType";
import setUserType from "./user/setUserType";


export {
  // Config
  allowStudentRegister,
  getDomainRestriction,
  getNumberSessions,
  getSessionTimes,
  getSignupAllowed,
  getTeacherSignupAllowed,
  setDomainRestriction,
  // Data
  getNextFriday,
  // Groups
  getGroups,
  // Sessions
  enrollStudent,
  getAllStudents,
  getHourSessions,
  getTeacherSessions,
  getUnsignedStudents,
  // User
  getUserType,
  setUserType,
}