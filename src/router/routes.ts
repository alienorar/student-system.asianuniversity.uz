import { Schedule, Profile, FinishedLesson } from "@/modules"
import { Calendar, User } from "lucide-react"



export const routesConfig = [
      {
        path: "/student-panel",
        label: "Profil",
        element: Profile,
        icon:User,
        
    },
    {
        path: "/student-panel/schedule",
        label: "Dars jadvali",
        element: Schedule,
        icon:Calendar

    },
  
    {
        path: "/student-panel/finished-lesson",
        label: "O'tilgan darslar",
        element: FinishedLesson,
        icon:Calendar

    },
  
]