"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, CreditCard, BookOpen, Users, BarChart3, Calendar, Sparkles,  GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useGetStudentProfile } from "../hooks/queries";

// Define the StudentData interface based on the provided student data
interface StudentData {
  id: number;
  fullName: string;
  studentIdNumber: string;
  email: string;
  phone: string;
  birthDateLocalDate: string;
  genderName: string;
  university: string;
  specialtyName: string;
  groupName: string;
  facultyName: string;
  educationFormName: string;
  paymentFormName: string;
  levelName: string;
  semesterName: string;
  semesterEducationYearName: string;
  avgGpa: string;
  address: string;
  image?: string;
}

export default function StudentDashboard() {
  // Initialize state with default values
  const [studentData, setStudentData] = useState<StudentData>({
    id: 0,
    fullName: "",
    studentIdNumber: "",
    email: "",
    phone: "",
    birthDateLocalDate: "",
    genderName: "",
    university: "",
    specialtyName: "",
    groupName: "",
    facultyName: "",
    educationFormName: "",
    paymentFormName: "",
    levelName: "",
    semesterName: "",
    semesterEducationYearName: "",
    avgGpa: "",
    address: "",
    image: "",
  });

  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentProfile();

  console.log("Profile Data:", data);

  // Update studentData when data is fetched
  useEffect(() => {
    if (data?.data?.student) {
      setStudentData({
        id: data.data.student.id,
        fullName: data.data.student.fullName,
        studentIdNumber: data.data.student.studentIdNumber,
        email: data.data.student.email,
        phone: data.data.student.phone,
        birthDateLocalDate: data.data.student.birthDateLocalDate,
        genderName: data.data.student.genderName,
        university: data.data.student.university,
        specialtyName: data.data.student.specialtyName,
        groupName: data.data.student.groupName,
        facultyName: data.data.student.facultyName,
        educationFormName: data.data.student.educationFormName,
        paymentFormName: data.data.student.paymentFormName,
        levelName: data.data.student.levelName,
        semesterName: data.data.student.semesterName,
        semesterEducationYearName: data.data.student.semesterEducationYearName,
        avgGpa: data.data.student.avgGpa,
        address: data.data.student.address,
        image: data.data.student.image,
      });
    }
  }, [data]);

  // Quick actions tailored for students
  const quickActions = [
    {
      title: "Dars Jadvali",
      description: "Jadvalni ko'rish",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      path: "/student-panel/schedule",
    },
    {
      title: "Baholar",
      description: "Baho natijalari",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-500",
      path: "/student-panel/grades",
    },
    {
      title: "Kurslar",
      description: "O'quv kurslari",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      path: "/student-panel/courses",
    },
    {
      title: "Guruh",
      description: "Guruh ma'lumotlari",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      path: "/student-panel/group",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl sm:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 dark:from-white/2 to-transparent"></div>
          <CardHeader className="relative z-10 text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white/30 dark:border-white/20 shadow-lg sm:shadow-xl">
                  {studentData.image ? (
                    <AvatarImage src={studentData.image || "/placeholder.svg"} alt="Profile" style={{ objectFit: "cover" }} />
                  ) : (
                    <AvatarFallback className="text-2xl sm:text-4xl bg-gradient-to-br from-white/20 dark:from-white/10 to-white/10 dark:to-white/5 text-white">
                      {studentData.fullName?.split(" ")[0]?.[0] || "S"}
                      {studentData.fullName?.split(" ")[1]?.[0] || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 sm:p-2">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              Xush kelibsiz, {studentData.fullName.split(" ")[0]}!
            </CardTitle>
            <CardDescription className="text-base sm:text-lg md:text-xl text-white/80 dark:text-white/70 max-w-xl sm:max-w-2xl mx-auto">
              HEMIS tizimida o'quv jarayonini boshqaring va muvaffaqiyatga erishing.
            </CardDescription>
          </CardHeader>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {/* Personal Information Card */}
          <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm border-0 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-700 dark:to-violet-700 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                Shaxsiy Ma'lumotlar
              </CardTitle>
              <CardDescription className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
                Talaba haqidagi asosiy ma'lumotlar va o'quv ma'lumotlari
              </CardDescription>
            </div>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 sm:p-3 rounded-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">To'liq Ism</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{studentData.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 sm:p-3 rounded-lg">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Email</p>
                        <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{studentData.email || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-lg">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Talaba ID</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{studentData.studentIdNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-800/30">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-lg">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Telefon</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{studentData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 sm:p-3 rounded-lg">
                        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Mutaxassislik</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{studentData.specialtyName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 sm:p-3 rounded-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Guruh</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{studentData.groupName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-6 sm:my-8" />

              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3">O'quv Ma'lumotlari</h4>
                {isLoading ? (
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ) : (
                  <div className="space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p><strong>Fakultet:</strong> {studentData.facultyName}</p>
                    <p><strong>Ta'lim Shakli:</strong> {studentData.educationFormName}</p>
                    <p><strong>To'lov Shakli:</strong> {studentData.paymentFormName}</p>
                    <p><strong>Kurs:</strong> {studentData.levelName}</p>
                    <p><strong>Semestr:</strong> {studentData.semesterName} ({studentData.semesterEducationYearName})</p>
                    <p><strong>O'rtacha GPA:</strong> {studentData.avgGpa}</p>
                    <p><strong>Manzil:</strong> {studentData.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm border-0 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-700 dark:to-violet-700 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                Tezkor Harakatlar
              </CardTitle>
              <CardDescription className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
                Tez-tez ishlatiladigan funksiyalar va imkoniyatlar
              </CardDescription>
            </div>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-0 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-card"
                    onClick={() => navigate(action.path)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <CardContent className="relative p-4 sm:p-6 text-center">
                      <div
                        className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} mb-3 sm:mb-4 group-hover:scale-105 sm:group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <CardTitle className="font-bold text-base sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-muted-foreground transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-muted-foreground">{action.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}