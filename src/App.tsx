// App.tsx
import { Outlet } from "react-router-dom"
import { useEffect } from "react"
// import { Toaster } from "@/components/ui/sonner"

function App() {
  useEffect(() => {
    // Console'da debug ma'lumotlarini ko'rsatish
    console.log("App initialized - localStorage check:", {
      access_token: !!localStorage.getItem("access_token"),
      user_data: !!localStorage.getItem("user_data"), 
      tokenLength: localStorage.getItem("access_token")?.length || 0,
      currentPath: window.location.pathname
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}

export default App