
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, MapPin,  GraduationCap, ChevronRight, Star } from "lucide-react";
import CameraModal from "./modal";
import { useGetStudentSchedule } from "../hooks/queries";

// Utility functions
const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getDayOfWeek = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  return days[date.getDay()];
};

const getWeekDates = (referenceDate: number = Date.now()) => {
  const dates = [];
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = formatUnixTimestamp(date.getTime() / 1000);
    const dayName = getDayOfWeek(date.getTime() / 1000);
    dates.push({ dateKey, dayName, timestamp: date.getTime() / 1000 });
  }
  return dates;
};

const getCurrentTime = () => {
  return new Date().toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

export default function SchedulePage() {
  const [params, _setParams] = useState({
    size: 100,
    page: 0,
    time: "WEEK", // or "TODAY"
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(formatUnixTimestamp(Date.now() / 1000));

  const { data, isLoading, isError, refetch } = useGetStudentSchedule(params);

  const stopCamera = () => {
    setIsCameraOpen(false);
    setCurrentLessonId(null);
  };

  // const handleTimeChange = (value: string) => {
  //   setParams((prev) => ({ ...prev, time: value }));
  //   if (value === "TODAY") {
  //     setSelectedDay(formatUnixTimestamp(Date.now() / 1000));
  //   }
  // };

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

  const weekDays = getWeekDates(content[0]?.lessonDate * 1000 || Date.now());
  const todaysLessons = groupedSchedule[selectedDay] || [];

  return (
    <div className="min-h-screen">
      {/* Floating header */}
      <div className="sticky top-0 z-50 px-4 sm:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Dars Jadvali
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">
                      Zamonaviy ta'lim tizimi • {getCurrentTime()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  {/* <Select onValueChange={handleTimeChange} defaultValue={params.time}>
                    <SelectTrigger className="relative w-[200px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/50">
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
                  </Select> */}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Jonli</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left: Today's Detailed Schedule */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Bugungi Darslar
                </h2>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                  {selectedDay}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {todaysLessons.length} ta dars
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 rounded-2xl shadow-xl">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-xl" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 rounded-2xl shadow-xl">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Xatolik
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                  >
                    Qayta Yuklash
                  </Button>
                </CardContent>
              </Card>
            ) : todaysLessons.length > 0 ? (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-800 scrollbar-track-transparent">
                {todaysLessons
                  .sort((a:any, b:any) => parseInt(a.lessonPairCode) - parseInt(b.lessonPairCode))
                  .map((lesson:any, index:any) => (
                    <Card
                      key={index}
                      className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Time indicator */}
                          <div className="flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white">
                            <div className="text-xs font-medium opacity-80">Juft</div>
                            <div className="text-2xl font-bold">{lesson.lessonPairCode}</div>
                            <div className="text-xs font-medium opacity-80">
                              {lesson.startTime ? lesson.startTime.split(':').slice(0, 2).join(':') : '--:--'}
                            </div>
                          </div>

                          {/* Lesson details */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {lesson.subjectName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1">
                                    {lesson.trainingTypeName}
                                  </Badge>
                                  {lesson.startTime && lesson.endTime && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                      <Clock className="h-4 w-4" />
                                      {lesson.startTime} - {lesson.endTime}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {lesson.groupName}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {lesson.auditoriumName} • {lesson.buildingName}
                                </span>
                              </div>
                            </div>

                        
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 rounded-2xl shadow-xl">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Darslar Mavjud Emas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bu kun uchun rejalashtirilgan darslar yo'q
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Weekly Overview Cards */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Haftalik Ko'rinish
              </h2>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-800 scrollbar-track-transparent">
              {weekDays.map((day, index) => {
                const dayLessons = groupedSchedule[day.dateKey] || [];
                const isSelected = selectedDay === day.dateKey;
                const isToday = day.dateKey === formatUnixTimestamp(Date.now() / 1000);

                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg hover:shadow-xl ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30"
                        : "bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800"
                    } backdrop-blur-xl rounded-2xl overflow-hidden`}
                    onClick={() => setSelectedDay(day.dateKey)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-white/20"
                                : isToday
                                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                                  : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            {isToday && (
                              <Star
                                className={`h-5 w-5 ${isSelected ? "text-yellow-200" : "text-emerald-600 dark:text-emerald-400"}`}
                              />
                            )}
                            {!isToday && (
                              <Calendar
                                className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-600 dark:text-gray-400"}`}
                              />
                            )}
                          </div>
                          <div>
                            <div
                              className={`font-bold ${
                                isSelected ? "text-white" : "text-gray-800 dark:text-gray-100"
                              }`}
                            >
                              {day.dayName}
                            </div>
                            <div
                              className={`text-sm ${
                                isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {day.dateKey}
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            isSelected
                              ? "bg-white/20 text-white"
                              : dayLessons.length > 0
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          } border-0`}
                        >
                          {dayLessons.length}
                        </Badge>
                      </div>

                      {dayLessons.length > 0 ? (
                        <div className="space-y-2">
                          {dayLessons.slice(0, 2).map((lesson:any, lessonIndex:any) => (
                            <div
                              key={lessonIndex}
                              className={`p-3 rounded-xl ${
                                isSelected ? "bg-white/10 backdrop-blur-sm" : "bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              <div
                                className={`text-sm font-semibold truncate ${
                                  isSelected ? "text-white" : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {lesson.subjectName}
                              </div>
                              <div
                                className={`text-xs flex items-center gap-1 mt-1 ${
                                  isSelected ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                <Clock className="h-3 w-3" />
                                Juft {lesson.lessonPairCode}
                                {lesson.startTime && ` • ${lesson.startTime.split(':').slice(0, 2).join(':')}`}
                              </div>
                            </div>
                          ))}
                          {dayLessons.length > 2 && (
                            <div
                              className={`text-xs text-center py-1 ${
                                isSelected ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              +{dayLessons.length - 2} ta dars
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`text-sm text-center py-3 ${
                            isSelected ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Darslar yo'q
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CameraModal visible={isCameraOpen} onClose={stopCamera} lessonId={currentLessonId} />

      {/* Add CSS animations */}
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
