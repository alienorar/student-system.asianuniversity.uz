"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MessageCircle, Hash,  Star, CheckCircle, XCircle, Clock, BookOpen } from "lucide-react";
import { useGetLessonBySubjectId } from "../hooks/queries";

interface Feedback {
  id: number;
  lessonSessionId: number;
  comment: string;
  rating: number;
  createdAt: string;
}

interface Lesson {
  teacherName: string;
  lessonDateTime: string;
  status: "FINISHED" | "CANCELED";
  ranking: number;
  feedback: Feedback | null;
}

interface SubjectData {
  subjectId: number;
  subjectName: string;
  lessons: Lesson[];
  totalLessonsCount: number;
  finishedLessonsCount: number;
  canceledLessonsCount: number;
  futureLessonsCount: number;
  finishedLessonsPercentage: number;
  canceledLessonsPercentage: number;
  futureLessonsPercentage: number;
}

const SubjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetLessonBySubjectId(id);
  const [subjectData, setSubjectData] = useState<SubjectData | null>(null);
  const [params, setParams] = useState({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    if (data?.data) {
      setSubjectData(data.data);
    }
  }, [data]);

  // Calculate average rating from lessons
  const calculateAverageRating = (lessons: Lesson[]) => {
    const validRankings = lessons
      .filter((lesson) => lesson.ranking > 0)
      .map((lesson) => lesson.ranking);
    return validRankings.length > 0
      ? (validRankings.reduce((sum, rank) => sum + rank, 0) / validRankings.length).toFixed(2)
      : "Ma'lumot yo'q";
  };

  // Pagination calculations
  const paginatedLessons = useMemo(() => {
    if (!subjectData?.lessons) return [];
    return subjectData.lessons.slice(
      (params.page - 1) * params.size,
      params.page * params.size
    );
  }, [subjectData?.lessons, params.page, params.size]);

  const totalItems = subjectData?.lessons?.length || 0;
  const totalPages = Math.ceil(totalItems / params.size);

  // Handle page change
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

  // Format date
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("uz-UZ", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "Noma'lum sana";
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-slate-400">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Xatolik yuz berdi: {error?.message || "Noma'lum xatolik"}</p>
          <Button
            className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate(-1)}
          >
            Orqaga
          </Button>
        </div>
      </div>
    );
  }

  // Handle case when no data is available
  if (!subjectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground dark:text-slate-400">Ma'lumotlar topilmadi</p>
          <Button
            className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate(-1)}
          >
            Orqaga
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-transparent max-w-screen-2xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card className="bg-card/50 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-border/50 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground dark:text-slate-200">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              {subjectData.subjectName || "Fan Tafsilotlari"} (ID: {subjectData.subjectId})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">Fan ID: </span>
              {subjectData.subjectId}
            </p>
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              <span className="font-medium">O'rtacha baho: </span>
              {calculateAverageRating(subjectData.lessons)}/5
            </p>
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">Jami darslar: </span>
              {subjectData.totalLessonsCount || 0}
            </p>
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              <span className="font-medium">Tugallangan darslar: </span>
              {subjectData.finishedLessonsCount || 0} ({subjectData.finishedLessonsPercentage || 0}%)
            </p>
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <span className="font-medium">Bekor qilingan darslar: </span>
              {subjectData.canceledLessonsCount || 0} ({subjectData.canceledLessonsPercentage || 0}%)
            </p>
            <p className="flex items-center gap-2 text-foreground dark:text-slate-300">
              <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Kelajakdagi darslar: </span>
              {subjectData.futureLessonsCount || 0} ({subjectData.futureLessonsPercentage || 0}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Table */}
      <Card className="bg-card/50 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-border/50 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground dark:text-slate-200">
            Darslar Ro'yxati
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedLessons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground dark:text-slate-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Darslar topilmadi</p>
              <p className="text-sm">Bu fan bo'yicha darslar mavjud emas.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 dark:bg-slate-700/50">
                      <TableHead className="text-foreground dark:text-slate-200">O'qituvchi</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Sana va Vaqt</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Holati</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Baho</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Izoh</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Fikr-mulohaza ID</TableHead>
                      <TableHead className="text-foreground dark:text-slate-200">Fikr-mulohaza Sanasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLessons.map((lesson: Lesson, index: number) => (
                      <TableRow
                        key={index}
                        className={`border-t border-border/50 dark:border-slate-700/50 hover:bg-muted/20 dark:hover:bg-slate-700/20 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white dark:bg-slate-800/50" : "bg-gray-50 dark:bg-slate-900/50"
                        }`}
                      >
                        <TableCell className="text-foreground dark:text-slate-300">{lesson.teacherName}</TableCell>
                        <TableCell className="text-foreground dark:text-slate-300">{formatDate(lesson.lessonDateTime)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={lesson.status === "FINISHED" ? "default" : "destructive"}
                            className="font-medium w-[120px]"
                          >
                            {lesson.status === "FINISHED" ? "Tugallangan" : "Bekor qilingan"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground dark:text-slate-300">
                          {lesson.ranking > 0 ? (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                              {`${lesson.ranking.toFixed(2)}/5`}
                            </div>
                          ) : (
                            "Baho yo'q"
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs text-foreground dark:text-slate-300">
                          <p className="text-sm leading-relaxed line-clamp-2 break-words">
                            {lesson.feedback?.comment || "Izoh yo'q"}
                          </p>
                        </TableCell>
                        <TableCell className="text-foreground dark:text-slate-300">
                          {lesson.feedback?.id || "Yo'q"}
                        </TableCell>
                        <TableCell className="text-foreground dark:text-slate-300">
                          {lesson.feedback?.createdAt ? formatDate(lesson.feedback.createdAt) : "Yo'q"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination - Always show controls */}
              <div className="p-4 border-t border-border/50 dark:border-slate-700/50 bg-muted/20 dark:bg-slate-700/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
                    <span>
                      {totalItems > 0
                        ? `${(params.page - 1) * params.size + 1}-${Math.min(params.page * params.size, totalItems)} dan ${totalItems}`
                        : "0 dan 0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={params.size.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger className="w-24 bg-white/70 dark:bg-slate-800/70 border-border/50 dark:border-slate-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handlePageChange(params.page - 1)}
                      disabled={params.page === 1}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 border-border/50 dark:border-slate-700/50 text-foreground dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90"
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
                            className={`w-8 h-8 p-0 ${
                              params.page === pageNumber
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                : "bg-white/70 dark:bg-slate-800/70 border-border/50 dark:border-slate-700/50 text-foreground dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90"
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        ));
                      })()}
                      {totalPages > 5 && params.page < totalPages - 2 && (
                        <span className="text-sm text-muted-foreground dark:text-slate-400">...</span>
                      )}
                    </div>
                    <Button
                      onClick={() => handlePageChange(params.page + 1)}
                      disabled={params.page === totalPages}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 border-border/50 dark:border-slate-700/50 text-foreground dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90"
                    >
                      Keyingi
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={() => navigate(-1)}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      >
        Orqaga
      </Button>
    </div>
  );
};

export default SubjectPage;