"use client"
import { ReactNode, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className={`flex min-h-screen flex-1 flex-col px-5 xs:px-10 md:px-16 ${darkMode ? "bg-gray-900 text-white" : "bg-neutral-100 text-black"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-end mt-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-800 text-white dark:bg-gray-200 dark:text-black">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="mt-10 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
