import axiosInstance from "@/api";

export async function studentLogin(data: { username: string; password: string }) {
  return (await axiosInstance.post(`student/hemis/login`, data)).data
}
