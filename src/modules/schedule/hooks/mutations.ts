import { useMutation } from "@tanstack/react-query";
import { uploadFile, startLessonApi } from "../service";
import { toast } from "sonner"

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    onError: (error: Error) => {
      console.error("Rasm yuklashda xatolik:", error);
      toast.error(`Rasm yuklashda xatolik: ${error.message}`, {
       style: { background: "#ffffff", border:"2px solid red", color: "red" },
      });
    },
  });
}

export function useStartLesson() {
  return useMutation({
    mutationFn: ({ lessonId, imageUrl }: { lessonId: string; imageUrl: string }) => startLessonApi(lessonId, imageUrl),
    onError: (error: Error) => {
      console.error("Darsni boshlashda xatolik:", error);
      toast.error(`Darsni boshlashda xatolik: ${error.message}`, {
        style: { background: "#ffffff", border:"2px solid red", color: "red" },
      });
    },
    onSuccess: () => {
      toast.success("Dars muvaffaqiyatli boshlandi.", {
        style: { background: "#34d399", color: "#fff" },
      });
    },
  });
}