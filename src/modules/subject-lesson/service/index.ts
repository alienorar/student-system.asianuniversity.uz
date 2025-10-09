import axiosInstance from "@/api";

// ============= Get ============
export async function getLesssonBySubjectId(subjectId:number|string|undefined) {
  return (await axiosInstance.get(`api/v1/student/lesson/list/${subjectId}`)).data
}