import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
