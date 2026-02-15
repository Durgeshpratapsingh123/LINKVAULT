import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import { getMyPastes, removeMyPaste } from "../utils/myPastes";
import { useAuth } from "../context/AuthContext";

export default function MyPastes() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    syncPastes();
  }, [user]);

  const syncPastes = async () => {
    const localPastes = getMyPastes();
    
    if (!user) {
      // Not logged in - show only localStorage pastes
      const currentTime = Date.now();
      const validPastes = localPastes.filter(p => {
        if (!p.expiresAt) return true;
        return new Date(p.expiresAt).getTime() > currentTime;
      });

      if (validPastes.length !== localPastes.length) {
        localStorage.setItem('linkvault_pastes', JSON.stringify(validPastes));
      }

      setItems(validPastes.map(p => ({ ...p, isAnonymous: true })));
      setLoading(false);
      return;
    }

    // Logged in - get authenticated pastes from backend
    try {
      const res = await api.get("/user/pastes");
      const serverPastes = res.data.pastes.map(p => ({
        pasteId: p.pasteId,
        type: p.type,
        expiresAt: p.expiresAt,
        maxViews: p.maxViews,
        currentViews: p.currentViews,
        createdAt: p.createdAt,
        deleteToken: null,
        isAnonymous: false,
      }));

      // Get anonymous pastes from localStorage
      const currentTime = Date.now();
      const anonymousPastes = localPastes.filter(p => {
        if (!p.expiresAt) return true;
        return new Date(p.expiresAt).getTime() > currentTime;
      }).map(p => ({ ...p, isAnonymous: true }));

      // Combine both
      const allPastes = [...serverPastes, ...anonymousPastes];
      setItems(allPastes);
    } catch (err) {
      console.error("Sync error:", err);
      setItems(localPastes.map(p => ({ ...p, isAnonymous: true })));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pasteId, deleteToken, isAnonymous) => {
    console.log("DELETE DEBUG:", { pasteId, deleteToken, isAnonymous });
    
    try {
      if (isAnonymous) {
        await api.delete(`/delete/${pasteId}`, {
          headers: {
            "x-delete-token": deleteToken,
          },
        });
        removeMyPaste(pasteId);
      } else {
        // For authenticated pastes, backend needs deleteToken or auth
        // You might need to update backend to handle auth-based deletion
        await api.delete(`/delete/${pasteId}`, {
          headers: {
            "x-delete-token": deleteToken,
          },
        });
      }

      setItems((prev) => prev.filter((p) => p.pasteId !== pasteId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const getTimeLeft = (expiresAt) => {
    if (!expiresAt) return "∞";

    const diff = new Date(expiresAt).getTime() - now;

    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Loading…</div>;
  }

  if (!items.length) {
    return (
      <div className="py-24 text-center text-gray-400">No pastes yet.</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Pastes</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((p) => {
            const expired =
              p.expiresAt && new Date(p.expiresAt).getTime() <= now;

            return (
              <motion.div
                key={p.pasteId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-5 shadow-sm ${
                  expired 
                    ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20' 
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {p.type === "file" ? "📁 File" : "📄 Text"}
                    </span>
                    {p.isAnonymous ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        Anonymous
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Account
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      expired ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {expired ? "Expired" : "Active"}
                  </span>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                  <div>
                    Created:{" "}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "Unknown"}
                  </div>

                  <div>Expires in: {getTimeLeft(p.expiresAt)}</div>

                  <div>
                    Views left:{" "}
                    {typeof p.maxViews === "number"
                      ? Math.max(p.maxViews - (p.currentViews || 0), 0)
                      : "∞"}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {expired ? (
                    <button
                      disabled
                      className="flex-1 text-center rounded-lg bg-gray-400 dark:bg-gray-600 text-white py-2 text-sm cursor-not-allowed opacity-60"
                    >
                      Expired
                    </button>
                  ) : (
                    <a
                      href={`/view/${p.pasteId}`}
                      className="flex-1 text-center rounded-lg bg-blue-600 text-white py-2 text-sm hover:opacity-90"
                    >
                      Open
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(p.pasteId, p.deleteToken, p.isAnonymous)}
                    className="rounded-lg border border-red-400 text-red-500 px-3 text-sm hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}