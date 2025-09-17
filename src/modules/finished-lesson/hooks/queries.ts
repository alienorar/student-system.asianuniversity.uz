import { useQuery } from "@tanstack/react-query";
import { getFinishedLesson, getSubject } from "../service";

// ============ GET STUDENT SCHEDULE ===========
export function useGetFinishedLesson() {
    return useQuery({
        queryKey:["finished-lesson"],
        queryFn:()=> getFinishedLesson()
    })
}

export function useGetSubject() {
    return useQuery({
        queryKey:["subject"],
        queryFn:()=> getSubject()
    })
}