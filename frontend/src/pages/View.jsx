import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

/* ---------------- helpers ---------------- */

const getTimeLeft = (expiresAt) => {
  if (!expiresAt) return null;

  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";

  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
};

const getRemainingViews = (maxViews, currentViews) => {
  if (typeof maxViews !== "number") return null;
  return Math.max(maxViews - (currentViews || 0), 0);
};

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return "Unknown size";
  
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/* ---------------- component ---------------- */

export default function View() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchPaste = async (pwd) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/view/${id}`, {
        params: pwd ? { password: pwd } : {},
      });

      setData(res.data);
      setNeedsPassword(false);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Unable to load this link";

      if (msg.toLowerCase().includes("password")) {
        setNeedsPassword(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaste();
    // eslint-disable-next-line
  }, [id]);

  /* ---------------- states ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-gray-400 dark:text-gray-400">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-24 px-4">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-gray-800 p-6 text-center shadow border border-gray-200 dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="flex justify-center py-24 px-4">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            🔒 Password Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This paste is protected.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 mb-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />

          <button
            onClick={() => fetchPaste(password)}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- main view ---------------- */

  const timeLeft = data?.expiresAt ? getTimeLeft(data.expiresAt) : null;
  const viewsLeft = getRemainingViews(
    data?.maxViews,
    data?.currentViews
  );

  return (
    <div className="flex justify-center py-24 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {data?.type === "file" ? "📁 Secure File" : "📄 Secure Text"}
        </h2>

        {/* META INFO */}
        <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300">
          {timeLeft && (
            <span>⏳ Expires in: <b>{timeLeft}</b></span>
          )}
          {viewsLeft !== null && (
            <span>👁️ Views remaining: <b>{viewsLeft}</b></span>
          )}
        </div>

        {/* TEXT */}
        {data?.type === "text" && (
          <>
            <pre className="whitespace-pre-wrap rounded-xl bg-gray-50 dark:bg-gray-900 p-4 text-sm overflow-auto text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {data?.content || "No text available"}
            </pre>

            <button
              onClick={() => {
                navigator.clipboard.writeText(data?.content || "");
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="mt-4 px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </>
        )}

        {/* FILE */}
        {data?.type === "file" && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-6 text-center border border-gray-200 dark:border-gray-700">
            {data?.fileMeta?.filename && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                📄 {data.fileMeta.filename}
              </p>
            )}

            {data?.fileMeta && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {data.fileMeta.mimetype} • {formatFileSize(data.fileMeta.filesize)}
              </p>
            )}

            <a
              href={`http://localhost:5000/api/file/${id}`}
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow hover:scale-[1.03] transition"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}