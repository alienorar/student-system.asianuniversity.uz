"use client";

import { useState, useMemo } from "react";
import { useGetFinishedLesson, useGetSubject } from "../hooks/queries";
import { useSetFeedback } from "../hooks/mutations";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageCircle, Calendar, Hash, BookOpen, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Define the Feedback type
interface Feedback {
  id: number | string;
  lessonSessionId: number | string;
  comment: string;
  rating: number;
  createdAt: string | Date;
}

// Define the Lesson type
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

// Define the Subject type (from API response)
interface Subject {
  subjectId: number;
  subjectName: string;
  lessons: Lesson[];
}

// Define SubjectOption for filtering (from subject API)
interface SubjectOption {
  subjectId: number;
  subjectName: string;
}

const StudentFeedbackTable = () => {
  const [params, setParams] = useState({
    size: 10,
    page: 1,
    subjectId: "all" as string,
  });

  const { data, isLoading, isError, refetch } = useGetFinishedLesson();
  const { data: subjectData, isLoading: isSubjectLoading } = useGetSubject();
  const { mutate: setFeedbackMutation, isPending } = useSetFeedback();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Extract subject options from API response
  const subjectOptions = useMemo(() => {
    if (subjectData?.success && Array.isArray(subjectData?.data)) {
      return subjectData.data as SubjectOption[];
    }
    return [] as SubjectOption[];
  }, [subjectData]);

  // Extract and flatten lessons from API response
  const allLessons = useMemo(() => {
    if (!data?.success || !Array.isArray(data?.data)) {
      return [] as Lesson[];
    }
    
    const flattenedLessons: Lesson[] = [];
    data.data.forEach((subject: Subject) => {
      if (Array.isArray(subject.lessons)) {
        subject.lessons.forEach((lesson: Lesson) => {
          flattenedLessons.push({
            ...lesson,
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
          });
        });
      }
    });
    
    return flattenedLessons;
  }, [data]);

  // Format date
  const formatDate = (date: string | Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Noma'lum sana";
    }
  };

  // Get star color based on rating
  const getStarColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  // Get badge color based on rating
  const getBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
  };

  // Handle subject filter change
  const handleSubjectChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      subjectId: value,
      page: 1,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setParams((prev) => ({
      ...prev,
      subjectId: "all",
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      size: parseInt(value),
      page: 1,
    }));
  };

  // Open and close modal
  const openModal = (lessonId: string | number) => {
    setSelectedLessonId(lessonId);
    setIsModalOpen(true);
    setRating(0);
    setComment("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLessonId(null);
  };

  // Submit feedback
  const submitFeedback = () => {
    if (selectedLessonId && rating > 0) {
      setFeedbackMutation(
        { lessonSessionId: selectedLessonId, comment, rating },
        {
          onSuccess: () => {
            closeModal();
            refetch();
          },
        }
      );
    }
  };

  // Filter lessons based on subject
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) =>
      params.subjectId === "all" ? true : String(lesson.subjectId) === params.subjectId
    );
  }, [allLessons, params.subjectId]);

  // Pagination calculations
  const totalItems = filteredLessons.length;
  const totalPages = Math.ceil(totalItems / params.size);
  const paginatedLessons = useMemo(() => {
    return filteredLessons.slice(
      (params.page - 1) * params.size,
      params.page * params.size
    );
  }, [filteredLessons, params.page, params.size]);

  // Calculate average rating
  const { averageRating, feedbackCount } = useMemo(() => {
    const totalRating = filteredLessons.reduce((sum, lesson) => sum + (lesson.feedback?.rating || 0), 0);
    const count = filteredLessons.filter((lesson) => lesson.feedback).length;
    return {
      averageRating: count > 0 ? totalRating / count : 0,
      feedbackCount: count,
    };
  }, [filteredLessons]);

  // Get selected subject name for filter display
  const selectedSubjectName = useMemo(() => {
    if (params.subjectId === "all") return "Barcha fanlar";
    const subject = subjectOptions.find(s => String(s.subjectId) === params.subjectId);
    return subject?.subjectName || "Noma'lum fan";
  }, [params.subjectId, subjectOptions]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border overflow-hidden">
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data?.success) {
    return (
      <div className="p-6 text-center text-destructive max-w-screen-2xl mx-auto">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Darslarni yuklashda xatolik yuz berdi</p>
        <p className="text-sm">Iltimos, keyinroq urinib ko'ring.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-transparent max-w-screen-2xl mx-auto">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Tugallangan Darslar va Fikr-mulohazalar
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Star className={`h-5 w-5 ${getStarColor(averageRating)} fill-current`} />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({feedbackCount} ta baholash)</span>
          </div>
          {totalItems > 0 && (
            <Badge variant="outline" className="text-xs">
              {paginatedLessons.length} dan {totalItems} ko'rsatilmoqda
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filtrlar:</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <Select
            value={params.subjectId}
            onValueChange={handleSubjectChange}
            disabled={isSubjectLoading || subjectOptions.length === 0}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={isSubjectLoading ? "Yuklanmoqda..." : "Fan tanlang"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha fanlar</SelectItem>
              {subjectOptions.map((option) => (
                <SelectItem key={option.subjectId} value={String(option.subjectId)}>
                  {option.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {params.subjectId !== "all" && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Aktiv filtr:</span>
              <Badge variant="secondary" className="text-xs">
                {selectedSubjectName}
              </Badge>
            </div>
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Tozalash
            </Button>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Elementlar soni:</span>
          <Select value={params.size.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border overflow-hidden">
        {paginatedLessons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {params.subjectId !== "all"
                ? "Tanlangan fan bo'yicha darslar topilmadi."
                : "Hozircha tugallangan darslar mavjud emas."}
            </p>
            <p className="text-sm">
              {params.subjectId !== "all"
                ? "Boshqa fanlarni sinab ko'ring."
                : "Yangi darslar kutilmoqda."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground w-[100px]">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Dars ID
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground w-[200px]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Fan
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground w-[150px]">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Baho
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground w-[300px]">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Izoh
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground w-[150px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Sana
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground w-[150px]">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Amallar
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLessons.map((lesson, index) => (
                    <tr
                      key={lesson.id || index}
                      className="border-t border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <td className="p-4 w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{lesson.id}
                        </span>
                      </td>
                      <td className="p-4 w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-sm font-medium text-foreground" title={lesson.subjectName}>
                          {lesson.subjectName}
                        </span>
                      </td>
                      <td className="p-4 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {(() => {
                          const hasFeedback = !!lesson.feedback;
                          const r = lesson.feedback?.rating ?? 0;

                          if (!hasFeedback) {
                            return <span className="text-sm text-muted-foreground italic">Baholanmagan</span>;
                          }

                          return (
                            <div className="flex items-center gap-2">
                              <Badge className={`${getBadgeColor(r)} text-xs px-2 py-1`}>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < r ? getStarColor(r) + " fill-current" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </Badge>
                              <span className="text-sm font-medium text-foreground">{r}/5</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-4 w-[300px] overflow-hidden">
                        {lesson.feedback?.comment ? (
                          <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                            {lesson.feedback.comment}
                          </p>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            Izoh qoldirilmagan
                          </span>
                        )}
                      </td>
                      <td className="p-4 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {lesson.feedback?.createdAt ? (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(lesson.feedback.createdAt)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {!lesson.feedback && (
                          <Button
                            onClick={() => openModal(lesson.id)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold py-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Darsni Baholash
                            </div>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-border/50 bg-muted/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {((params.page - 1) * params.size) + 1}-
                      {Math.min(params.page * params.size, totalItems)} dan {totalItems}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePageChange(params.page - 1)}
                      disabled={params.page === 1}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Oldingi
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pagesToShow = 5;
                        let startPage = Math.max(1, params.page - Math.floor(pagesToShow / 2));
                        const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

                        if (endPage - startPage + 1 < pagesToShow) {
                          startPage = Math.max(1, endPage - pagesToShow + 1);
                        }

                        const pageNumbers = Array.from(
                          { length: endPage - startPage + 1 },
                          (_, i) => startPage + i
                        );

                        return pageNumbers.map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            variant={params.page === pageNumber ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        ));
                      })()}
                      {totalPages > 5 && params.page < totalPages - 2 && (
                        <span className="text-sm text-muted-foreground">...</span>
                      )}
                    </div>
                    <Button
                      onClick={() => handlePageChange(params.page + 1)}
                      disabled={params.page === totalPages}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Keyingi
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Feedback Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative">
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
                  Dars sifatini baholang va fikr-mulohazangizni qoldiring
                </p>
              </div>

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

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Izoh
                </label>
                <textarea
                  className="w-full p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/50 dark:border-slate-600/50 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Dars haqida fikr-mulohazangizni yozing..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

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
                      Yuborish
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

export default StudentFeedbackTable;