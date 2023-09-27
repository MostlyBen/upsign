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
import setNumberSessions from "./config/setNumberSessions";
import setSessionTimes from "./config/setSessionTimes";

// Data
import getDefaultDay from "./data/getDefaultDay";
import getSchoolName from "./data/getSchoolName";
import setDefaultDay from "./data/setDefaultDay";
import setSchoolName from "./data/setSchoolName";

// Enrollment
import enrollStudent from "./enrollment/enrollStudent";
import getHourEnrollments from "./enrollment/getHourEnrollments";
import getSessionEnrollments from "./enrollment/getSessionEnrollments";
import getStudentEnrollments from "./enrollment/getStudentEnrollments";
import unenrollFromHour from "./enrollment/unenrollFromHour";
import updateEnrollment from "./enrollment/updateEnrollment";

// Groups
import getGroupOptions from "./groups/getGroupOptions";
import setGroupOptions from "./groups/setGroupOptions";

// Sessions
import addTeacherSession from "./sessions/addTeacherSession";
import getHourSessions from "./sessions/getHourSessions";
import getTeacherSessions from "./sessions/getTeacherSessions";
import getUnsignedStudents from "./sessions/getUnsignedStudents";
import unenrollFromSession from "./enrollment/unenrollFromSession";
import updateSession from "./sessions/updateSession";

// User
import deleteUser from "./user/deleteUser";
import getAllStudents from "./user/getAllStudents";
import getAllUsers from "./user/getAllUsers";
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
  setNumberSessions,
  setSessionTimes,
  // Data
  getDefaultDay,
  getSchoolName,
  setDefaultDay,
  setSchoolName,
  // Enrollment
  enrollStudent,
  getHourEnrollments,
  getSessionEnrollments,
  getStudentEnrollments,
  unenrollFromHour,
  unenrollFromSession,
  updateEnrollment,
  // Groups
  getGroupOptions,
  setGroupOptions,
  // Sessions
  addTeacherSession,
  getAllStudents,
  getHourSessions,
  getTeacherSessions,
  getUnsignedStudents,
  updateSession,
  // User
  deleteUser,
  getUser,
  getAllUsers,
  getUserType,
  setUserType,
  updateUser,
}