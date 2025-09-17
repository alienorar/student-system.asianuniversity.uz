import { useQuery } from "@tanstack/react-query";
import { getLesssonStatistics, getStudentProfile } from "../service";
// import { getTeacherSchedule } from "../service";

// ============ GET TEACHER SHCEDULE ===========
export function useGetStudentProfile() {
    return useQuery({
        queryKey:["profile"],
        queryFn:()=> getStudentProfile()
    })
}

// ============ GET TEACHER SHCEDULE ===========
export function useGetLessonStatistics(params:any) {
    return useQuery({
        queryKey:["lessonStatistics",params],
        queryFn:()=> getLesssonStatistics(params)
    })
}
