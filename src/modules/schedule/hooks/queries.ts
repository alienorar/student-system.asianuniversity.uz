import { useQuery } from "@tanstack/react-query";
import { getStudentSchedule } from "../service";

// ============ GET STUDENT SCHEDULE ===========
export function useGetStudentSchedule(params:any) {
    return useQuery({
        queryKey:["schedule",params],
        queryFn:()=> getStudentSchedule(params)
    })
}
