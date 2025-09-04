"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogIn, Shield } from "lucide-react"
import { useSignInMutation } from "../hooks/mutations"
// import { useSignInMutation } from "../hooks/queries"

export default function SignInPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { mutate, isPending, error } = useSignInMutation()

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username && password) {
            mutate({ username, password }) 
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-1 gap-12 items-center justify-center">
                {/* Login card */}
                <div className="flex justify-center">
                    <Card className="w-full max-w-md bg-white/95 dark:bg-card/95 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                        {/* Card header with gradient */}
                        <div className="bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 p-8 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <LogIn className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-white mb-2">Tizimga kirish</CardTitle>
                            <CardDescription className="text-white/80 text-lg">
                                Foydalanuvchi nomi va parol orqali kiring
                            </CardDescription>
                        </div>

                        <CardContent className="p-8 space-y-6">
                            {/* Login form */}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Foydalanuvchi nomi"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="password"
                                        placeholder="Parol"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm text-center">
                                        Xato: Noto'g'ri foydalanuvchi nomi yoki parol
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isPending || !username || !password}
                                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    size="lg"
                                >
                                    <LogIn className="mr-3 h-6 w-6" />
                                    {isPending ? "Yuklanmoqda..." : "Kirish"}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-card text-muted-foreground">Xavfsiz va tez</span>
                                </div>
                            </div>

                            {/* Security info */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Xavfsiz autentifikatsiya</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Tizim orqali himoyalangan kirish</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">
                                        Tizimga kirishda muammo bo'lsa, administrator bilan bog'laning
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <p className="text-white/60 text-sm text-center">© 2024 Asian University. Barcha huquqlar himoyalangan.</p>
            </div>
        </div>
    )
}