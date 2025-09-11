import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "../service";
// import { getTeacherSchedule } from "../service";

// ============ GET TEACHER SHCEDULE ===========
export function useGetStudentProfile() {
    return useQuery({
        queryKey:["profile"],
        queryFn:()=> getStudentProfile()
    })
}
