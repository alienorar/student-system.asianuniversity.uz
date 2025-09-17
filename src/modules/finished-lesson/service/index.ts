import axiosInstance from "@/api";

// ============= SYNC STUDENTS BY EXEL ============
export async function getFinishedLesson() {
  return (await axiosInstance.get(`/api/v1/student/schedule/finished/lesson/list`)).data
}

// ============= SYNC STUDENTS BY EXEL ============
export async function setFeedback(data:any) {
  return (await axiosInstance.post(`api/v1/student/feedback`,data)).data
}

// ============= Get ============
export async function getSubject() {
  return (await axiosInstance.get(`api/v1/student/lesson/subject/list`)).data
}
