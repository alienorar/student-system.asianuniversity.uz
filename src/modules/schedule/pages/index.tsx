"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Users, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
import CameraModal from "./modal"
import { useGetStudentSchedule } from "../hooks/queries"

interface ScheduleItem {
  id: string
  subjectName: string
  lessonDate: number
  lessonDateTime: string
  startTime: string
  endTime: string
  groupName: string
  auditoriumName: string
  buildingName: string
  trainingTypeName: string
  semesterName: string
  educationYearCode: string
  educationYearName: string
  lessonPairCode: string
  lessonPairName: string
}

// Utility function to format Unix timestamp to readable date
const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export default function SchedulePage() {
  const teacherEmployeeId = localStorage.getItem("teacherEmployeeId")
  console.log("Teacher Employee ID:", teacherEmployeeId)

  const [params, setParams] = useState({
    size: 100,
    page: 0,
    time: "TODAY",
  })
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

  const { data, isLoading, isError } = useGetStudentSchedule(params)

  console.log("Schedule Data:", data)

  const handleTimeChange = (value: string) => {
    setParams((prev) => ({ ...prev, time: value }))
  }

  const stopCamera = () => {
    setIsCameraOpen(false)
    setCurrentLessonId(null)
  }

  // Safely access content with fallback
  const content = data?.data?.content || []

  const groupedSchedule = content.reduce(
    (acc: Record<string, ScheduleItem[]>, item: ScheduleItem) => {
      const dateKey = formatUnixTimestamp(item.lessonDate)
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(item)
      return acc
    },
    {}
  )

  const sortedDates = Object.keys(groupedSchedule).sort((a, b) => {
    const dateA = new Date(a.split(".").reverse().join("-"))
    const dateB = new Date(b.split(".").reverse().join("-"))
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="p-2 sm:p-4 bg-transparent">
      {/* Always render the header and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dars Jadvali</h2>
        <Select onValueChange={handleTimeChange} defaultValue={params.time}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card/95 border-border rounded-lg shadow-sm">
            <SelectValue placeholder="Vaqtni tanlang" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-lg shadow-lg">
            <SelectItem value="TODAY">Bugun</SelectItem>
            <SelectItem value="WEEK">Hafta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card/95 backdrop-blur-sm border-0 shadow-sm rounded-lg">
              <CardHeader className="p-3 sm:p-4">
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center text-destructive text-sm sm:text-base">
          <p>Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.</p>
        </div>
      )}

      {/* No data state */}
      {!isLoading && !isError && sortedDates.length === 0 && (
        <div className="text-center text-muted-foreground text-sm sm:text-base">
          <p>{params.time === "TODAY" ? "Bugun" : "Hafta"} uchun dars jadvali mavjud emas.</p>
        </div>
      )}

      {/* Data available state */}
      {!isLoading && !isError && sortedDates.length > 0 && (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {sortedDates.map((dateKey) => (
            <Card key={dateKey} className="bg-card/95 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-sky-500 p-3 sm:p-4">
                <CardTitle className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  {dateKey}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 grid gap-3 sm:gap-4">
                {groupedSchedule[dateKey].map((lesson: ScheduleItem, index: number) => (
                  <div
                    key={index}
                    className="bg-background/80 p-3 sm:p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex flex-col gap-1 sm:gap-2">
                        <h3 className="text-md sm:text-md font-semibold text-foreground">{lesson.subjectName}</h3>
                        <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-900/10 sm:px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-md">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-[15px]">Sana: {formatUnixTimestamp(lesson.lessonDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 sm:gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-xs px-2.5 py-1"
                        >
                          {lesson.trainingTypeName}
                        </Badge>
                        <div className="flex items-center gap-2 bg-sky-50/50 dark:bg-sky-900/10 px-2 sm:px-3 py-1.5 rounded-md text-sky-600 dark:text-sky-300 font-semibold text-xs sm:text-sm">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-lg">{lesson.startTime} - {lesson.endTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-muted-foreground text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                        <span>Guruh: {lesson.groupName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                        <span>
                          Xona: {lesson.auditoriumName} ({lesson.buildingName})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                        <span>
                          Semestr: {lesson.semesterName} ({lesson.educationYearCode})
                        </span>
                      </div>
                    </div>
                    {/* <Button
                      onClick={() => {
                        setCurrentLessonId(lesson.id)
                        setIsCameraOpen(true)
                      }}
                      className="mt-3 w-full sm:w-auto bg-sky-500 text-white hover:bg-sky-600 rounded-lg text-xs sm:text-sm px-3 sm:px-4 py-2"
                    >
                      Darsni boshlash
                    </Button> */}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CameraModal
        visible={isCameraOpen}
        onClose={stopCamera}
        lessonId={currentLessonId}
      />
    </div>
  )
}