"use client";

import { useState } from "react";
import { useGetFinishedLesson } from "../hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, User, Calendar, Timer, Star, MessageSquare, Award, BookOpen } from "lucide-react";
import { useSetFeedback } from "../hooks/mutations";

// Define the Feedback type
interface Feedback {
  id: number | string;
  lessonSessionId: number | string;
  comment: string;
  rating: number;
  createdAt: string | Date;
}

// Define the Lesson type according to the JSON response
interface Lesson {
  id: number | string;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  startedAt: string | Date;
  endedAt: string | Date;
  delayInSeconds: number;
  feedback: Feedback | null;
}

// Define the Subject type based on the JSON response
interface Subject {
  subjectId: number;
  subjectName: string;
  lessons: Lesson[];
}

// Define the Response type
interface ResponseData {
  timestamp: number;
  success: boolean;
  errorMessage: string;
  data: Subject[];
}

const Index = () => {
  const { data, isLoading, error, refetch } = useGetFinishedLesson();
  const { mutate: setFeedbackMutation, isPending } = useSetFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Flatten the lessons from all subjects into a single array
  const lessons: Lesson[] =
    (data as ResponseData)?.data?.flatMap((subject: Subject) => subject.lessons) ?? [];

  console.log("Lessons Data:", lessons);
  const isSuccess = (data as ResponseData)?.success ?? false;
  const errorMessage = (data as ResponseData)?.errorMessage ?? "Kutilmagan xatolik yuz berdi.";

  const openModal = (lessonId: string | number) => {
    setSelectedLessonId(lessonId);
    setIsModalOpen(true);
    setRating(0); // Reset rating
    setComment(""); // Reset comment
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLessonId(null);
  };

  const submitFeedback = () => {
    if (selectedLessonId && rating > 0) {
      setFeedbackMutation(
        { lessonSessionId: selectedLessonId, comment, rating },
        {
          onSuccess: () => {
            closeModal();
            refetch(); // Refresh the lesson data after successful feedback submission
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 p-4 sm:p-6 lg:p-8">
      {/* Modern floating header */}
      <div className="sticky top-4 z-10 mb-8">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Tugallangan Darslar
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
                O'tkazilgan darslar va baholash
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-0 rounded-2xl shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5"></div>
              <CardHeader className="relative p-6 bg-gradient-to-r from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30">
                <Skeleton className="h-6 w-3/4 mb-3 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
              </CardHeader>
              <CardContent className="relative p-6 space-y-4">
                <Skeleton className="h-20 w-full rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                <Skeleton className="h-20 w-full rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                <Skeleton className="h-12 w-full rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-lg bg-red-50/80 dark:bg-red-950/20 backdrop-blur-xl rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertTitle className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Xatolik
                </AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300 mt-1">
                  Darslarni yuklashda xatolik: {error.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      ) : !isSuccess ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-lg bg-red-50/80 dark:bg-red-950/20 backdrop-blur-xl rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertTitle className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Xatolik
                </AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300 mt-1">
                  {errorMessage}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      ) : lessons.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-lg bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <AlertTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Ma'lumot yo'q
                </AlertTitle>
                <AlertDescription className="text-slate-700 dark:text-slate-300 mt-1">
                  Hozircha tugallangan darslar mavjud emas.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson: Lesson, index: number) => (
            <Card
              key={lesson.id}
              className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 group-hover:from-purple-500/20 group-hover:via-indigo-500/10 group-hover:to-blue-500/20 transition-all duration-500"></div>

              {/* Floating orbs for visual interest */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>

              <CardHeader className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6">
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="drop-shadow-sm">{lesson.subjectName}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative p-6">
                <div className="space-y-4">
                  {/* Teacher Info */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">O'qituvchi</p>
                      <p className="font-bold text-blue-700 dark:text-blue-300">
                        {lesson.teacherName ?? "Noma'lum"}
                      </p>
                    </div>
                  </div>

                  {/* Start Time */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Boshlangan vaqt</p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-300">
                        {lesson.startedAt
                          ? new Date(lesson.startedAt).toLocaleString("uz-UZ")
                          : "Ma'lum emas"}
                      </p>
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tugallangan vaqt</p>
                      <p className="font-bold text-orange-700 dark:text-orange-300">
                        {lesson.endedAt
                          ? new Date(lesson.endedAt).toLocaleString("uz-UZ")
                          : "Ma'lum emas"}
                      </p>
                    </div>
                  </div>

                  {/* Delay */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Timer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kechikish</p>
                      <p className="font-bold text-purple-700 dark:text-purple-300">
                        {lesson.delayInSeconds != null
                          ? `${lesson.delayInSeconds} soniya`
                          : "Ma'lum emas"}
                      </p>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {lesson.feedback ? (
                    <div className="space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Baholash</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (lesson.feedback?.rating ?? 0)
                                    ? "text-yellow-500 dark:text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-500"
                                }`}
                              />
                            ))}
                            <span className="ml-2 font-bold text-yellow-700 dark:text-yellow-300">
                              {lesson.feedback.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>

                      {lesson.feedback.comment && (
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Izoh</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                              {lesson.feedback.comment}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2 border-t border-yellow-200/50 dark:border-yellow-800/50">
                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Baholangan: {" "}
                          <span className="font-medium">
                            {lesson.feedback.createdAt
                              ? new Date(lesson.feedback.createdAt).toLocaleString("uz-UZ")
                              : "Ma'lum emas"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Button
                        onClick={() => openModal(lesson.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold py-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Darsni Baholash
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative">
            {/* Modal background with glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-xl rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 rounded-3xl"></div>

            <div className="relative bg-transparent p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 dark:border-slate-700/50">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Darsni Baholash
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Dars sifatini baholang va fikringizni bildiring
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className={`p-2 hover:scale-110 transition-all duration-200 ${
                        rating >= star
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-gray-400 dark:text-gray-500 hover:text-yellow-400"
                      }`}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className="h-8 w-8"
                        fill={rating >= star ? "currentColor" : "none"}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Izoh va takliflar
                </label>
                <textarea
                  className="w-full p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/50 dark:border-slate-600/50 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Dars haqida fikringizni bildiring..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-white/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-600/90 rounded-xl font-medium transition-all duration-300"
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={rating === 0 || isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Yuborilmoqda...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Baholash
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;