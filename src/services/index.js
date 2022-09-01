// Config
import allowStudentRegister from "./config/allowStudentRegister";
import getDomainRestriction from "./config/domainRestriction/getDomainRestriction";
import getNumberSessions from "./config/getNumberSessions";
import getSessionTimes from "./config/getSessionTimes";
import getSignupAllowed from "./config/signupAllowed/getSignupAllowed";
import getTeacherRegisterAllowed from "./config/teacherRegister/getTeacherRegisterAllowed";
import setDomainRestriction from "./config/domainRestriction/setDomainRestriction";
import setSignupAllowed from "./config/signupAllowed/setSignupAllowed";
import setTeacherRegisterAllowed from "./config/teacherRegister/setTeacherRegisterAllowed";

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
import getUser from "./user/getUser";
import getUserType from "./user/getUserType";
import setUserType from "./user/setUserType";
import updateUser from "./user/updateUser";


export {
  // Config
  allowStudentRegister,
  getDomainRestriction,
  getNumberSessions,
  getSessionTimes,
  getSignupAllowed,
  getTeacherRegisterAllowed,
  setDomainRestriction,
  setSignupAllowed,
  setTeacherRegisterAllowed,
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
  getUser,
  getUserType,
  setUserType,
  updateUser,
}