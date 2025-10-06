import axiosInstance from "@/api";

// ============= SYNC STUDENTS BY EXEL ============
export async function getTeacherProfile() {
  return (await axiosInstance.get(`api/v1/student/profile`)).data
}