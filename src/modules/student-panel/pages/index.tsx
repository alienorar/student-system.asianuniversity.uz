"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Moon, Sun, BookOpen,LogOut } from "lucide-react";
import { routesConfig } from "@/router/routes";
import { useGetTeacherProfile } from "../hooks/queries";
// Assuming this hook exists and returns the user data

// Theme Context
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    console.log("Applied theme:", theme); // Debugging
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log("Toggled to:", newTheme); // Debugging
      return newTheme;
    });
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

  // Fetch current user data using the hook
  const { data: userData, isLoading: isUserLoading } = useGetTeacherProfile();
  const user = userData?.data?.student; // Assuming the hook returns the structure from your response

  console.log("Current theme in DashboardLayout:", theme); // Debugging

  // Logout handler
  const handleLogout = () => {
    // Clear tokens from localStorage (adjust based on your auth implementation)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/50 shadow-2xl transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-72" : "w-22"
        }`}
      >
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Teacher Panel
                  </h1>   </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {routesConfig?.filter((item) => item.showInsideMenu !== false).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
                    />
                  </div>
                  {isSidebarOpen && (
                    <span
                      className={`ml-3 font-medium ${
                        isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/50 shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {routesConfig.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome to the Teacher Panel
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    disabled={isUserLoading}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs font-medium">
                        {user?.firstName?.charAt(0)}{user?.secondName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                      Student Id:  {user?.studentIdNumber || "Noma'lum foydalanuvchi"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start px-2 py-3 text-sm cursor-default select-none opacity-70">
                    <div className="font-medium">Ism: {user?.firstName || "-"}</div>
                    <div className="font-medium">Familiya: {user?.secondName || "-"}</div>
                    <div className="text-xs text-muted-foreground mt-1">Telefon: {user?.phone || "-"}</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-xs cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish (Logout)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}