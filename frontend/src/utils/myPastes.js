const KEY = "linkvault_pastes";

export const getMyPastes = () => {
  try {
    const data = JSON.parse(localStorage.getItem("linkvault_pastes")) || [];
    return data.filter(p => p.pasteId && p.deleteToken);
  } catch {
    return [];
  }
};


export const addMyPaste = ({ pasteId, deleteToken }) => {
  const pastes = getMyPastes();

  const updated = [
    {
      pasteId,
      deleteToken,
      createdAt: new Date().toISOString(),
    },
    ...pastes,
  ];

  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const removeMyPaste = (pasteId) => {
  const pastes = getMyPastes();
  const filtered = pastes.filter((p) => p.pasteId !== pasteId);
  localStorage.setItem(KEY, JSON.stringify(filtered));
};
