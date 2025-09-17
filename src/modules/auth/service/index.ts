import axiosInstance from "@/api";

export async function studentLogin(data: { username: string; password: string }) {
  return (await axiosInstance.post(`api/v1/student/hemis/login`, data)).data
}
