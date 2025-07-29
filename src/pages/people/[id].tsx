import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { deletePerson  } from "@/api/peoples";
import { Person } from "@/types/person";
import { editPersonSwal, confirmSwal, successSwal, errorSwal } from "@/utils/swal";
import { logout } from "@/api/auth"; 
import { useAuth } from "@/hooks/useAuth";
import { fetchPersonById } from "@/api/peoples";

export default function PersonPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  console.log(user?.name);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(setLoading);
  
  const loadPerson = useCallback(async () => {
    try {
      const data = await fetchPersonById(Number(id));
      setPerson(data);
    } catch (err) {
      console.error("Failed to load person:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadPerson();
    }
  }, [id,loadPerson]);

  const handleEditProfile = async () => {
    if (!person) return;

    await editPersonSwal(person, loadPerson); // 🔁 reload updated person
  }; 

  const handleDeleteProfile = async () => {
    if (!person) return;
  const result = await confirmSwal("This profile will be permanently deleted.");
    if (result.isConfirmed) {
      try {
        await deletePerson(person.id);
        await successSwal("Profile deleted.");
        await logout();      // ✅ clear token and user
        setUser(null);       // ✅ update React state
        router.push("/login"); // redirect after delete
      } catch (error) {
      console.error("Summarization failed:", error);
      await errorSwal("Something went wrong while summarizing.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!person) return <p className="text-center">Person not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary rounded-lg shadow">
      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-4">
        👤 {person.name}
      </h1>
      <p className="text-sm text-wanderer-text dark:text-white mb-2">
        📧 {person.email}
      </p>

      <div className="mb-3">
        <h2 className="text-sm font-bold text-wanderer-text dark:text-white">📝 Bio:</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words max-h-60 overflow-auto">
          {person.bio || "No bio provided."}
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleEditProfile}
          className="text-sm text-blue-500 hover:underline"
        >
          ✏️ Edit Profile
        </button>

        <button
          onClick={handleDeleteProfile}
          className="text-sm text-red-500 hover:underline"
        >
          🗑️ Delete Profile
        </button>
      </div>
      <div className="mt-6 text-right">
        <a 
          onClick={() => router.back()}
          className="text-sm text-blue-500 hover:underline cursor-pointer">
          ← Back
        </a>
      </div>
    </div>
  );
}
