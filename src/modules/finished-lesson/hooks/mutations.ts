
import { useMutation } from "@tanstack/react-query";
import { setFeedback } from "../service";
import { toast } from "sonner";


export function useSetFeedback() {
    return useMutation({
        mutationFn: (data: any) => setFeedback(data),
        onSuccess: () => {
            toast.success("Dars muvaffaqiyatli boshlandi.", {
                style: { background: "#34d399", color: "#fff" },
            });
        },
        onError: (error: any) => {
            console.error("Darsni boshlashda xatolik:", error);
            toast.error(`Darsni boshlashda xatolik: ${error.message}`, {
                style: { background: "#ffffff", border: "2px solid red", color: "red" },
            });
        }


    })
}