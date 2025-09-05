
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setAccessToken, } from "../../../utils/token-service";
import { studentLogin } from "../service";


export function useSignInMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: any) => studentLogin(data),
        onSuccess: (response: any) => {
            const access_token = response?.data?.accessToken;
            console.log(response?.data.accessToken);
            
            setAccessToken(access_token);
            navigate("/student-panel");
        },
        onError: (error: any) => {
            console.log(error)
        }


    })
}