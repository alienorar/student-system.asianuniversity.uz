"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, TrendingUp, Clock, BookOpen, Star, AlertCircle } from "lucide-react"
import { useGetLessonStatistics } from "../hooks/queries"

const Index = () => {
  const [searchParams, setSearchParams] = useState({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  })
  const [statistics, setStatistics] = useState<any>()

  // Pass only startDate and endDate to the hook
  const { data: lessonStatistics } = useGetLessonStatistics({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  })

  useEffect(() => {
    if (lessonStatistics?.data) {
      setStatistics(lessonStatistics?.data)
    }
  }, [lessonStatistics])

  const handleStartDateChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, startDate: value }))
  }

  const handleEndDateChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, endDate: value }))
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === 0) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500"
    if (rating >= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lesson Statistics Dashboard</h1>
        <p className="text-muted-foreground">Track lesson performance, ratings, and attendance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter statistics by date range</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">From Date</Label>
            <Input
              id="startDate"
              type="date"
              value={searchParams.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">To Date</Label>
            <Input
              id="endDate"
              type="date"
              value={searchParams.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons (Year)</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.lessonCountForCurrentYear || 0}</div>
            <p className="text-xs text-muted-foreground">{statistics.lessonCountForInterval || 0} in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((statistics.finishedLessonLoadPercentageForInterval || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics.finishedLessonCount || 0} finished, {statistics.canceledLessonCount || 0} canceled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Late Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(statistics.averageLateTime)}</div>
            <p className="text-xs text-muted-foreground">Total: {formatTime(statistics.allLateTime)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.allLessonRatings || 0}</div>
            <p className="text-xs text-muted-foreground">From {statistics.subjects?.length || 0} subjects</p>
          </CardContent>
        </Card>
      </div>

      {statistics.monthlyLateList && statistics.monthlyLateList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Monthly Late Statistics
            </CardTitle>
            <CardDescription>Late arrival patterns by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.monthlyLateList.map((month: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">{month.monthName}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Late Count: <span className="font-medium">{month.lateCount}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Late Time: <span className="font-medium">{formatTime(month.lateInSeconds)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium">{formatTime(month.averageLateTime)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Subject Ratings
          </CardTitle>
          <CardDescription>Average ratings for subjects in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.subjects?.length > 0 ? (
                statistics.subjects.map((subject: any, index: number) => (
                  <TableRow key={subject.subjectId || index}>
                    <TableCell className="max-w-[200px] truncate" title={subject.subjectName}>
                      {subject.subjectName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getRatingColor(subject.averageRating)}`}></div>
                        <span className="font-medium">{subject.averageRating.toFixed(2)}/5</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No subject ratings available for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index