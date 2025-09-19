"use client";

import type React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, BookOpen, LogOut } from "lucide-react";
import { routesConfig } from "@/router/routes";

// Theme Context for Light/Dark Mode
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    // Only store the token if it exists in the URL
    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }, [location.search]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function DashboardLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 dark:bg-sidebar/95 backdrop-blur-lg border-r border-white/20 dark:border-sidebar-border shadow-2xl transition-all duration-300 z-50 ${isSidebarOpen ? "w-72" : "w-22"
          }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-sidebar-border">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Talaba Paneli
                  </h1>
                  <p className="text-sm text-muted-foreground">HEMIS tizimi</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-accent rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {routesConfig
            .filter((item) => item.showInsideMenu) // Filter routes with showInSideMenu: true
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-accent text-sidebar-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-accent group-hover:bg-accent/80"}`}>
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-sidebar-foreground"}`} />
                    </div>
                    {isSidebarOpen && (
                      <span className={`ml-3 font-medium ${isActive ? "text-white" : "text-sidebar-foreground"}`}>
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-sidebar-border">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-accent">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                T
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Talaba</p>
                <p className="text-xs text-muted-foreground truncate">Talaba Paneli</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>
        {/* Header */}
        <header className="bg-white/95 dark:bg-sidebar/95 backdrop-blur-lg border-b border-white/20 dark:border-sidebar-border shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                {routesConfig.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Xush kelibsiz, Talaba</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-accent rounded-xl">
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-foreground" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}