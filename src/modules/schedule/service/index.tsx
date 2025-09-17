/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/api";

// ============= SYNC STUDENTS BY EXEL ============
export async function getStudentSchedule(params:any) {
  return (await axiosInstance.get(`/api/v1/student/schedule/list`, { params })).data
}


// import axiosInstance from "@/api" // axiosInstance ni import qilish

export async function uploadFile(file: Blob): Promise<{
    [x: string]: any; id: any
}> {
  const formData = new FormData()
  formData.append("file", file, "user_photo.jpg")

  try {
    const response = await axiosInstance.post("https://edu.asianuniversity.uz/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Muhim: FormData uchun
      },
    })

    // if (!response.data || !response.data.link || !response.data.link.id) {
    //   throw new Error("Yuklangan rasm IDsi topilmadi.")
    // }
    return { id: response.data.link }
  } catch (error: any) {
    console.error("Rasm yuklashda xatolik:", error)
    const errorMessage = error.response?.data?.message || error.message || "Noma'lum xatolik"
    throw new Error(`Rasmni yuklashda xatolik: ${errorMessage}`)
  }
}

export async function startLessonApi(lessonId: string, imageUrl: string): Promise<any> {
  try {
    // POST so'rovini yuborish, parametrlar URL query qismida qoladi
    const response = await axiosInstance.post(`/schedule/start-lesson`, null, {
      // null or empty object for body as per curl example
      params: {
        lessonId: lessonId,
        image_url: imageUrl,
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Darsni boshlashda xatolik:", error)
    const errorMessage = error.response?.data?.message || error.message || "Noma'lum xatolik"
    throw new Error(`Darsni boshlashda xatolik: ${errorMessage}`)
  }
}


