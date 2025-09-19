"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TrendingUp, Clock, BookOpen, Star } from "lucide-react"
import { useGetLessonStatistics } from "../hooks/queries"
import { useNavigate } from "react-router-dom"

const Index = () => {
 const navigate = useNavigate();

  // Sukut bo'yicha sanalarni o'rnatish
  const today = new Date();
  const currentYear = today.getFullYear();
  const defaultDateFrom = `${currentYear}-09-01`;
  const defaultDateTo = today.toISOString().split('T')[0];

  // Vaqtinchalik kiritilgan qiymatlar uchun holat
  const [tempSearchParams, setTempSearchParams] = useState({
    size: 10,
    page: 0,
    startDate: defaultDateFrom,
    endDate: defaultDateTo,
  });

  // Qo'llanilgan qidiruv parametrlari uchun holat
  const [searchParams, setSearchParams] = useState({
    size: 10,
    page: 0,
    startDate: defaultDateFrom,
    endDate: defaultDateTo,
  });

  const [statistics, setStatistics] = useState<any>();

  const { data: lessonStatistics } = useGetLessonStatistics({
    size: searchParams.size,
    page: searchParams.page,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });

  useEffect(() => {
    if (lessonStatistics?.data) {
      setStatistics(lessonStatistics?.data);
    }
  }, [lessonStatistics]);

  const handleDateFromChange = (value: string) => {
    setTempSearchParams((prev) => ({ ...prev, startDate: value }));
  };

  const handleDateToChange = (value: string) => {
    setTempSearchParams((prev) => ({ ...prev, endDate: value }));
  };

  const handleSearch = () => {
    setSearchParams(tempSearchParams);
  };

  // Handle row click to navigate to single subject page
  const handleRowClick = (subjectId: string) => {
    navigate(`/student-panel/statistics/${subjectId}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} daq ${remainingSeconds} sek`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Statistika yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Darslar statistikasi boshqaruv paneli</h1>
        <p className="text-muted-foreground">Darslar samaradorligi, baholar va davomat ko'rsatkichlarini kuzating</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Filtrlar
          </CardTitle>
          <CardDescription>Statistikani sana oralig'i bo'yicha filtrlang</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Boshlanish sanasi</Label>
            <Input
              id="dateFrom"
              type="date"
              value={tempSearchParams.startDate}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTo">Tugash sanasi</Label>
            <Input
              id="dateTo"
              type="date"
              value={tempSearchParams.endDate}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>
          <div className="space-y-2 flex items-end">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              Qidirish
            </Button>
          </div>
        </CardContent>
      </Card>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="w-full rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base font-semibold text-primary">Jami darslar (yil)</CardTitle>
      <BookOpen className="h-5 w-5 text-violet-500" />
    </CardHeader>
    <CardContent className="flex flex-col gap-1">
      <div className="text-3xl font-bold text-primary">{statistics.lessonCountForCurrentYear}</div>
      <p className="text-sm text-gray-500">{statistics.lessonCountForInterval} tanlangan davrda</p>
    </CardContent>
  </Card>

  <Card className="w-full rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base font-semibold text-primary">Tugallanish darajasi</CardTitle>
      <TrendingUp className="h-5 w-5 text-violet-500" />
    </CardHeader>
    <CardContent className="flex flex-col gap-1">
      <div className="text-3xl font-bold text-primary">
        {Math.round((statistics.finishedLessonLoadPercentageForInterval || 0) * 100)}%
      </div>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-green-600">{statistics.finishedLessonCount}</span> tugallangan,{" "}
        <span className="font-medium text-red-500">{statistics.canceledLessonCount}</span> bekor qilingan
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 text-xs rounded-full bg-violet-100 text-violet-600 font-medium border border-violet-200">
          {tempSearchParams.startDate}
        </span>
        <span className="text-xs text-gray-400">→</span>
        <span className="px-3 py-1 text-xs rounded-full bg-violet-100 text-violet-600 font-medium border border-violet-200">
          {tempSearchParams.endDate}
        </span>
        <span className="text-xs text-primary italic">davr davomida</span>
      </div>
    </CardContent>
  </Card>

  <Card className="w-full rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base font-semibold text-primary">Kechikish vaqti</CardTitle>
      <Clock className="h-5 w-5 text-violet-500" />
    </CardHeader>
    <CardContent className="flex flex-col gap-1">
      <div className="text-3xl font-bold text-primary">{formatTime(statistics.lessonsLateTime || 0)}</div>
      <p className="text-sm text-gray-500">Jami kechikish vaqti</p>
    </CardContent>
  </Card>

  <Card className="w-full rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base font-semibold text-primary">Yillik tugallanish</CardTitle>
      <Star className="h-5 w-5 text-violet-500" />
    </CardHeader>
    <CardContent className="flex flex-col gap-1">
      <div className="text-3xl font-bold text-primary">
        {Math.round((statistics.finishedLessonLoadPercentageForCurrentYear || 0) * 100)}%
      </div>
      <p className="text-sm text-gray-500">Joriy yil bo'yicha</p>
    </CardContent>
  </Card>
</div>

      {statistics.subjects && statistics.subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Fanlar bo'yicha statistika
            </CardTitle>
            <CardDescription>Har bir fan bo'yicha batafsil ma'lumot</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fan nomi</TableHead>
                  <TableHead>O'rtacha baho</TableHead>
                  <TableHead>Jami darslar</TableHead>
                  <TableHead>Tugallangan</TableHead>
                  <TableHead>Bekor qilingan</TableHead>
                  <TableHead>Tugallanish foizi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.subjects.map((subject: any) => {
                  const completionRate = subject.lessonCount > 0 
                    ? Math.round((subject.finishedLessonCount / subject.lessonCount) * 100)
                    : 0;
                  
                  return (
                    <TableRow 
                      key={subject.subjectId} 
                      onClick={() => handleRowClick(subject.subjectId)} // Add onClick handler
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" // Add cursor and hover styles
                    >
                      <TableCell className="font-medium max-w-[200px] truncate" title={subject.subjectName}>
                        {subject.subjectName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getRatingColor(subject.averageRating)}`}></div>
                          <span className="font-medium">{subject.averageRating.toFixed(2)}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subject.lessonCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{subject.finishedLessonCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${subject.canceledLessonCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {subject.canceledLessonCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                completionRate >= 80 ? 'bg-green-500' : 
                                completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{completionRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;