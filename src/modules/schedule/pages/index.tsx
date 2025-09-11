
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users, MapPin, BookOpen, GraduationCap, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CameraModal from "./modal";
import { useGetStudentSchedule } from "../hooks/queries";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  id: string;
  subjectName: string;
  lessonDate: number;
  lessonDateTime: string;
  startTime: string | null;
  endTime: string | null;
  groupName: string;
  auditoriumName: string;
  buildingName: string;
  trainingTypeName: string;
  semesterName: string;
  educationYearCode: string;
  educationYearName: string;
  lessonPairCode: string;
  lessonPairName: string;
}

// Utility function to format Unix timestamp to readable date
const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Utility function to generate a week's dates for display
const getWeekDates = (referenceDate: number = Date.now()) => {
  const dates = [];
  const startDate = new Date(referenceDate);
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatUnixTimestamp(date.getTime() / 1000));
  }
  return dates;
};

export default function SchedulePage() {
  const teacherEmployeeId = localStorage.getItem("teacherEmployeeId");
  console.log("Teacher Employee ID:", teacherEmployeeId);

  const [params, setParams] = useState({
    size: 100,
    page: 0,
    time: "TODAY",
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetStudentSchedule(params);

  console.log("Schedule Data:", data);
  console.log("Params:", params);

  const handleTimeChange = (value: string) => {
    setParams((prev) => ({ ...prev, time: value }));
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
    setCurrentLessonId(null);
  };

  // Safely access content with fallback
  const content = data?.data?.content || [];

  // Group lessons by date
  const groupedSchedule = content.reduce(
    (acc: Record<string, ScheduleItem[]>, item: ScheduleItem) => {
      const dateKey = formatUnixTimestamp(item.lessonDate);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {}
  );

  // Get unique dates from the data and sort them
  const dataDates = Object.keys(groupedSchedule).sort((a, b) => {
    const dateA = new Date(a.split(".").reverse().join("-"));
    const dateB = new Date(b.split(".").reverse().join("-"));
    return dateA.getTime() - dateB.getTime();
  });

  // For WEEK view, include data dates or fall back to current week if no data
  const sortedDates = params.time === "WEEK" && dataDates.length > 0
    ? dataDates
    : params.time === "WEEK"
      ? getWeekDates(content[0]?.lessonDate * 1000 || Date.now()) // Use first lesson date if available
      : dataDates.length > 0
        ? dataDates
        : [formatUnixTimestamp(Date.now() / 1000)]; // Fallback to today

  console.log("Grouped Schedule:", groupedSchedule);
  console.log("Sorted Dates:", sortedDates);
  console.log("Data Dates:", dataDates);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Modern floating header with glassmorphism */}
      <div className="sticky top-4 z-10 mb-8">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-blue-500/10 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dars Jadvali
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Zamonaviy ta'lim tizimi
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <Select onValueChange={handleTimeChange} defaultValue={params.time}>
                <SelectTrigger className="relative w-full sm:w-[200px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/50">
                  <SelectValue placeholder="Vaqtni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 rounded-xl shadow-2xl">
                  <SelectItem value="TODAY" className="rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Bugun
                    </div>
                  </SelectItem>
                  <SelectItem value="WEEK" className="rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      Hafta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state with modern skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="group relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-0 rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
              <CardHeader className="relative p-6">
                <Skeleton className="h-6 w-3/4 mb-3 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                <Skeleton className="h-4 w-1/2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              </CardHeader>
              <CardContent className="relative p-6 space-y-4">
                <Skeleton className="h-20 w-full rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                <Skeleton className="h-20 w-full rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error state with modern styling */}
      {isError && (
        <Card className="max-w-lg mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Xatolik</h3>
            <p className="text-sm text-white/80 mb-4">Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.</p>
            <Button
              onClick={() => refetch()}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Qayta Urinish
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No data state with modern styling */}
      {!isLoading && !isError && sortedDates.length === 0 && (
        <Card className="max-w-lg mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Dars Jadvali Mavjud Emas</h3>
            <p className="text-sm text-white/80 mb-4">
              {params.time === "TODAY" ? "Bugun" : "Hafta"} uchun rejalashtirilgan darslar yo'q.
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Qayta Yuklash
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modern schedule cards */}
      {!isLoading && !isError && sortedDates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedDates.map((dateKey, dateIndex) => (
            <Card
              key={dateKey}
              className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{
                animationDelay: `${dateIndex * 100}ms`,
              }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:via-purple-500/10 group-hover:to-indigo-500/20 transition-all duration-500"></div>

              {/* Floating orbs for visual interest */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>

              <CardHeader className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="drop-shadow-sm">{dateKey}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative p-6 space-y-4">
                {groupedSchedule[dateKey]?.length > 0 ? (
                  groupedSchedule[dateKey]
                    .sort((a:any, b:any) => parseInt(a.lessonPairCode) - parseInt(b.lessonPairCode)) // Sort by lessonPairCode
                    .map((lesson: ScheduleItem, index: number) => (
                      <div
                        key={index}
                        className="group/lesson relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-5 rounded-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        {/* Lesson card gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30 dark:from-transparent dark:via-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover/lesson:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative">
                          {/* Subject header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="space-y-3">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover/lesson:text-blue-700 dark:group-hover/lesson:text-blue-300 transition-colors duration-300">
                                {lesson.subjectName}
                              </h3>
                              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-xl">
                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {formatUnixTimestamp(lesson.lessonDate)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                {lesson.trainingTypeName}
                              </Badge>
                              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 px-4 py-2 rounded-xl shadow-sm">
                                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-bold text-emerald-800 dark:text-emerald-200">
                                  {lesson.startTime && lesson.endTime
                                    ? `${lesson.startTime} - ${lesson.endTime}`
                                    : `Juftlik ${lesson.lessonPairName}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Lesson details */}
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg transition-all duration-300 hover:shadow-md">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Guruh: <span className="font-bold text-blue-700 dark:text-blue-300">{lesson.groupName}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg transition-all duration-300 hover:shadow-md">
                              <div className="p-2 bg-purple-500/10 rounded-lg">
                                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Xona: <span className="font-bold text-purple-700 dark:text-purple-300">{lesson.auditoriumName}</span>
                                <span className="text-gray-500 dark:text-gray-400"> ({lesson.buildingName})</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg transition-all duration-300 hover:shadow-md">
                              <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Semestr: <span className="font-bold text-indigo-700 dark:text-indigo-300">{lesson.semesterName}</span>
                                <span className="text-gray-500 dark:text-gray-400"> ({lesson.educationYearCode})</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center p-6 text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Bu kun uchun darslar yo'q</p>
                  </div>
                )}
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

      {/* Add some CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
