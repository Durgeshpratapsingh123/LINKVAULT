import { useRef, useState ,useEffect} from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { addMyPaste } from "../utils/myPastes";
import { useAuth } from "../context/AuthContext";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function UploadCard() {
  const { user } = useAuth();
  const [mode, setMode] = useState("text");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // form state
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [expiryMode, setExpiryMode] = useState("preset");
  const [expiry, setExpiry] = useState(600);
  const [customDateTime, setCustomDateTime] = useState("");

  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [maxViews, setMaxViews] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
      );
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    setError("");

    if (mode === "text" && !text.trim()) {
      return setError("Text cannot be empty");
    }
    if (mode === "file" && !file) {
      return setError("Please choose a file");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (mode === "text") formData.append("text", text);
      if (mode === "file") formData.append("file", file);

      let expirySeconds;
      if (expiryMode === "custom" && customDateTime) {
        const selectedTime = new Date(customDateTime).getTime();
        const now = Date.now();
        const diff = selectedTime - now;

        if (diff <= 0) {
          setLoading(false);
          return setError("Selected date/time must be in the future");
        }

        expirySeconds = Math.floor(diff / 1000);
      } else {
        expirySeconds = expiry;
      }
      

      formData.append("expiresIn", expirySeconds);
      if (passwordEnabled && password) formData.append("password", password);
      if (oneTime) formData.append("oneTimeView", true);
      if (maxViews) formData.append("maxViews", maxViews);

      const res = await api.post("/upload", formData);
      setResult(res.data);

      if (!user) {
        addMyPaste({
          pasteId: res.data.id,
          deleteToken: res.data.deleteToken,
          expiresAt: res.data.expiresAt,
          type: mode,
          maxViews: maxViews ? parseInt(maxViews) : null,
          currentViews: 0,
          isAnonymous: true,
        });
      }

      setText("");
      setFile(null);
      setCopied(false);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/view/${result.id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-xl"
    >
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <span className="text-3xl">🔗</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create a Secure Paste
            </span>
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Share text or files with expiry and access control
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="relative mb-8 grid grid-cols-2 rounded-2xl bg-gray-100 dark:bg-gray-700/50 p-1.5 backdrop-blur-sm">
          <div
            className={`absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all duration-300 ease-out ${
              mode === "file"
                ? "translate-x-[calc(100%+0.375rem)]"
                : "translate-x-1.5"
            }`}
          />
          <button
            onClick={() => setMode("text")}
            className={`relative z-10 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "text"
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => setMode("file")}
            className={`relative z-10 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "file"
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            📁 File
          </button>
        </div>

        {/* Input */}
        {mode === "text" ? (
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here…"
            className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-5 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-10 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 group"
          >
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {file ? (
                <>
                  <span className="text-blue-600 dark:text-blue-400">
                    {file.name}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </>
              ) : (
                <>
                  Click to choose a file
                  <br />
                  <span className="text-xs text-gray-500">
                    Max {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB
                  </span>
                </>
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-6 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 group"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              showAdvanced ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-6 border border-gray-200 dark:border-gray-700/50"
          >
            {/* Expiry Settings */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Expiry Settings
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExpiryMode("preset")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    expiryMode === "preset"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Preset Times
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryMode("custom")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    expiryMode === "custom"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Custom Date/Time
                </button>
              </div>

              {expiryMode === "preset" && (
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded-xl p-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer"
                >
                  <option value={600}>10 minutes</option>
                  <option value={1800}>30 minutes</option>
                  <option value={3600}>1 hour</option>
                  <option value={86400}>1 day</option>
                  <option value={604800}>7 days</option>
                </select>
              )}

              {expiryMode === "custom" && (
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-xl p-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              )}
            </div>

            {/* Password Protection */}
            <label className="flex gap-3 items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={passwordEnabled}
                onChange={(e) => setPasswordEnabled(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                🔒 Password protect
              </span>
            </label>

            {passwordEnabled && (
              <motion.input
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl p-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            )}

            {/* One Time View */}
            <label className="flex gap-3 items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={oneTime}
                onChange={(e) => setOneTime(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                👁️ One-time view only
              </span>
            </label>

            {/* Max Views */}
            <div>
              <input
                type="number"
                placeholder={
                  oneTime
                    ? "Disabled (one-time view enabled)"
                    : "Max views (optional)"
                }
                value={oneTime ? "" : maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                disabled={oneTime}
                className={`w-full rounded-xl p-3 border-2 ${
                  oneTime
                    ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none`}
              />
              {oneTime && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  💡 One-time view is enabled, so max views is automatically set
                  to 1
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-200 dark:border-red-800/50 p-4"
          >
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              {error}
            </p>
          </motion.div>
        )}

        {/* Success */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800/50 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                Secure link created!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-xl bg-white dark:bg-gray-800 px-4 py-3 text-sm font-mono border border-green-200 dark:border-green-800/50 text-gray-800 dark:text-gray-200 truncate">
                {`${window.location.origin}/view/${result.id}`}
              </code>
              <button
                onClick={copyLink}
                className={`px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-lg ${
                  copied
                    ? "bg-green-600 dark:bg-green-500"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
                }`}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 py-4 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating…
            </span>
          ) : (
            "Create Secure Link"
          )}
        </button>
      </div>
    </motion.div>
  );
}
