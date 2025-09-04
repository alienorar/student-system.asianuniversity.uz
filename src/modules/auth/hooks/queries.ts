import { useQuery } from "@tanstack/react-query";
import { studentLogin } from "../service";

// ============ STUDENT LOGIN ===========
export function useStudentLogin(data: { username: string; password: string }) {
    return useQuery({
        queryKey: ["login", data],
        queryFn: () => studentLogin(data)
    })
}
