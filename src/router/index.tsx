import type React from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"

import { SignIn, StudentPanel } from "@/modules"
import { routesConfig } from "./routes"
import App from "@/App"
import { ThemeProvider } from "@/modules/student-panel/pages"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("access_token") || localStorage.getItem("accessToken")

  if (!accessToken) {
    window.location.href = "/"
    return null
  }

  return <>{children}</>
}

const AuthenticatedRedirect = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("access_token") || localStorage.getItem("accessToken")

  if (accessToken) {
    window.location.href = "/student-panel"
    return null
  }

  return <>{children}</>
}

const Index = () => {
  const renderRoutes = () =>
    routesConfig.flatMap((route) => {
      const Component = route.element
      return <Route key={route.path} path={route.path} element={<Component />} />
    })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route
          path="/"
          element={
            <AuthenticatedRedirect>
              <SignIn />
            </AuthenticatedRedirect>
          }
        />

        <Route
          path="/student-panel"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <StudentPanel />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          {renderRoutes()}
        </Route>
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default Index
