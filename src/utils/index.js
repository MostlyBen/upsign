import allowStudentRegister from "./config/allowStudentRegister";
import getDomainRestriction from './config/getDomainRestriction';
import getTeacherSignupAllowed from "./config/getTeacherSignupAllowed";

import getGroups from "./groups/getGroups";

import getTeacherSessions from "./sessions/getTeacherSessions";
import getHourSessions from "./sessions/getHourSessions";
import getSignupAllowed from "./sessions/getSignupAllowed";
import getUnsignedStudents from "./sessions/getUnsignedStudents";
import getAllStudents from "./sessions/getAllStudents";
import enrollStudent from "./sessions/enrollStudent";
import { unenrollFromHour } from "./sessions/enrollStudent";

import getUserType from "./user/getUserType";
import setUserType from "./user/setUserType";

export {
  allowStudentRegister,
  getDomainRestriction,
  getTeacherSignupAllowed,

  getGroups,

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