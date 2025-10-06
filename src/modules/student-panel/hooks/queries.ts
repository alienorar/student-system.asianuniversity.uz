import { useQuery } from "@tanstack/react-query";
import { getTeacherProfile } from "../service";

// ============ GET TEACHER SHCEDULE ===========
export function useGetTeacherProfile() {
    return useQuery({
        queryKey:["profile"],
        queryFn:()=> getTeacherProfile()
    })
}