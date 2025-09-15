import axiosInstance from "@/api";

// ============= SYNC STUDENTS BY EXEL ============
export async function getStudentProfile() {
  return (await axiosInstance.get(`api/v1/student/profile`)).data
}

// ============= Get ============
export async function getLesssonStatistics(params:any) {
  return (await axiosInstance.get(`/api/v1/student/statistics/lesson/load`,{params})).data
}
