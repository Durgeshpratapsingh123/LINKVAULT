import axios from "axios";

export default function PasteCard({ paste }) {
  const handleDelete = async () => {
    await axios.delete(
      `http://localhost:5000/api/delete/${paste.id}`,
      {
        headers: {
          "x-delete-token": paste.deleteToken,
        },
      }
    );

    const updated = (
      JSON.parse(localStorage.getItem("linkvault_pastes")) || []
    ).filter((p) => p.id !== paste.id);

    localStorage.setItem(
      "linkvault_pastes",
      JSON.stringify(updated)
    );

    window.location.reload();
  };

  return (
    <div className="bg-white p-3 rounded shadow flex justify-between">
      <a
        href={`/view/${paste.id}`}
        className="text-blue-600 underline"
      >
        {paste.id}
      </a>

      <button
        onClick={handleDelete}
        className="text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
