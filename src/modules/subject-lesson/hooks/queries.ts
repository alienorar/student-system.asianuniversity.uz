import { useQuery } from "@tanstack/react-query";
import { getLesssonBySubjectId } from "../service";

// ============ GET TEACHER SHCEDULE ===========
export function useGetLessonBySubjectId(subjectId:number|string|undefined) {
    return useQuery({
        queryKey:["subject-lesson"],
        queryFn:()=> getLesssonBySubjectId(subjectId)
    })
}