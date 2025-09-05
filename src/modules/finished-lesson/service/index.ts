import axiosInstance from "@/api";

// ============= SYNC STUDENTS BY EXEL ============
export async function getFinishedLesson() {
  return (await axiosInstance.get(`/schedule/student/finished/lesson/list`)).data
}

// ============= SYNC STUDENTS BY EXEL ============
export async function setFeedback(data:any) {
  return (await axiosInstance.post(`api/v1/feedback`,data)).data
}
