import { useState } from "react";
import { useGetFinishedLesson } from "../hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, User, Calendar, Timer, Star } from "lucide-react";
import { useSetFeedback } from "../hooks/mutations";

// Define the Feedback type
interface Feedback {
  id: number | string;
  lessonSessionId: number | string;
  comment: string;
  rating: number;
  createdAt: string | Date;
}

// Define the Lesson type according to the expected lesson object structure
interface Lesson {
  id?: number | string;
  teacherName?: string;
  startedAt?: string | Date;
  endedAt?: string | Date;
  delayInSeconds?: number;
  feedback?: Feedback | null;
}

const Index = () => {
  const { data, isLoading, error } = useGetFinishedLesson();
  const { mutate: setFeedbackMutation, isPending } = useSetFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Safe access to data with fallback
  const lessons = data?.data ?? [];
  const isSuccess = data?.success ?? false;
  const errorMessage = data?.errorMessage ?? "An unexpected error occurred.";

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
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight">
        Finished Lessons
      </h1>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl"
            >
              <CardHeader className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
                <Skeleton className="h-7 w-3/4 rounded-md" />
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-lg mx-auto shadow-lg dark:bg-red-900/30">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Error
          </AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            Failed to fetch lessons: {error.message}
          </AlertDescription>
        </Alert>
      ) : !isSuccess ? (
        <Alert variant="destructive" className="max-w-lg mx-auto shadow-lg dark:bg-red-900/30">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Error
          </AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            {errorMessage}
          </AlertDescription>
        </Alert>
      ) : lessons.length === 0 ? (
        <Alert className="max-w-lg mx-auto shadow-lg dark:bg-gray-800/50">
          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <AlertTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            No Data
          </AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            No lessons found.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson: Lesson) => (
            <Card
              key={lesson.id ?? `lesson-${Math.random()}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <CardHeader className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Lesson #{lesson.id ?? "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                    <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">
                      <strong>Teacher:</strong> {lesson.teacherName ?? "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">
                      <strong>Started:</strong>{" "}
                      {lesson.startedAt
                        ? new Date(lesson.startedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">
                      <strong>Ended:</strong>{" "}
                      {lesson.endedAt
                        ? new Date(lesson.endedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                    <Timer className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">
                      <strong>Delay:</strong>{" "}
                      {lesson.delayInSeconds != null
                        ? `${lesson.delayInSeconds} seconds`
                        : "N/A"}
                    </span>
                  </div>
                  {lesson.feedback ? (
                    <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        <span className="font-medium">
                          <strong>Rating:</strong>{" "}
                          <div className="inline-flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= (lesson.feedback?.rating ?? 0)
                                    ? "text-yellow-500 dark:text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          <strong>Comment:</strong> {lesson.feedback.comment ?? "No comment"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-medium">
                          <strong>Feedback Given:</strong>{" "}
                          {lesson.feedback.createdAt
                            ? new Date(lesson.feedback.createdAt).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => openModal(lesson.id ?? "")}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-sm font-medium px-5 py-2 transition-colors duration-200"
                      >
                        Darsni Baholash
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Darsni Baholash
            </h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className={`p-1 ${
                    rating >= star
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                  onClick={() => setRating(star)}
                >
                  <Star className="h-6 w-6" fill={rating >= star ? "currentColor" : "none"} />
                </Button>
              ))}
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="Fayl biriktirish va izoh qoldirish"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={closeModal}
                variant="outline"
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg px-5 py-2 font-medium"
              >
                Yopish
              </Button>
              <Button
                onClick={submitFeedback}
                disabled={rating === 0 || isPending}
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg px-5 py-2 font-medium transition-colors duration-200"
              >
                {isPending ? "Yuborilmoqda..." : "Baholash"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;