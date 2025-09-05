import { useState } from "react";
import { useGetFinishedLesson,} from "../hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, User, Calendar, Timer, Star } from "lucide-react";
import { useSetFeedback } from "../hooks/mutations";

// Define the Lesson type according to the expected lesson object structure
interface Lesson {
  id?: number | string;
  teacherName?: string;
  startedAt?: string | Date;
  endedAt?: string | Date;
  delayInSeconds?: number;
}

const Index = () => {
  const { data, isLoading, error } = useGetFinishedLesson();
  const {mutate :setFeedbackMutation,isPending} = useSetFeedback();
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
    <div className="container mx-auto p-6  min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">
        Finished Lessons
      </h1>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              className="bg-card/95 backdrop-blur-sm border-0 shadow-lg rounded-xl"
            >
              <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
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
              className="bg-card/95 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/95"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Lesson #{lesson.id ?? "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      <strong>Teacher:</strong> {lesson.teacherName ?? "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                    <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      <strong>Started:</strong>{" "}
                      {lesson.startedAt
                        ? new Date(lesson.startedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                    <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      <strong>Ended:</strong>{" "}
                      {lesson.endedAt
                        ? new Date(lesson.endedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                    <Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      <strong>Delay:</strong>{" "}
                      {lesson.delayInSeconds != null
                        ? `${lesson.delayInSeconds} seconds`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => openModal(lesson.id ?? "")}
                      className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg text-sm px-4 py-1.5 transition-colors duration-200"
                    >
                      Darsni Baholash
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
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
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="Fayl biriktirish va izoh qoldirish"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={closeModal}
                variant="outline"
                className="mr-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg px-4 py-1.5"
              >
                Yopish
              </Button>
              <Button
                onClick={submitFeedback}
                disabled={rating === 0 || isPending}
                className="bg-yellow-200 dark:bg-yellow-700 text-gray-800 dark:text-gray-100 hover:bg-yellow-300 dark:hover:bg-yellow-600 rounded-lg px-4 py-1.5 transition-colors duration-200"
              >
                {isPending? "Yuborilmoqda..." : "Baholash"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;