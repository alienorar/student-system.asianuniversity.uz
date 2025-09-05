import { useQuery } from "@tanstack/react-query";
import { getFinishedLesson } from "../service";

// ============ GET STUDENT SCHEDULE ===========
export function useGetFinishedLesson() {
    return useQuery({
        queryKey:["finished-lesson"],
        queryFn:()=> getFinishedLesson()
    })
}
