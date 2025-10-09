import { Schedule, Profile, FinishedLesson, SubjectLesson } from "@/modules"
import { Calendar, User } from "lucide-react"



export const routesConfig = [
    {
        path: "/student-panel/statistics",
        label: "Statistika",
        element: Profile,
        icon: User,
        showInsideMenu: true

    },
       {
        path: "/student-panel/statistics/:id",
        element:SubjectLesson,
        icon: Calendar,
        showInsideMenu:false


    },
    {
        path: "/student-panel/schedule",
        label: "Dars jadvali",
        element: Schedule,
        icon: Calendar,
        showInsideMenu: true
    },

    {
        path: "/student-panel/finished-lesson",
        label: "O'tilgan darslar",
        element: FinishedLesson,
        icon: Calendar,
        showInsideMenu: true


    },
 

]