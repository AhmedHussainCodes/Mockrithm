'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export default function UserDetailsPage() {
  const router = useRouter();
  const { id: userId } = useParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, 'users', userId as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser(snap.data());
        } else {
          console.error('User not found');
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) return <p className="p-10">Loading user...</p>;
  if (!user) return <p className="p-10">User not found.</p>;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <button
        onClick={() => router.push('/admin/users')}
        className="flex items-center text-sm px-3 py-2 border border-white/50 rounded-lg shadow-sm text-white hover:bg-gray-100 hover:text-black transition"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold">User Details</h1>

      <div className="space-y-3 p-4 border border-white/10 rounded-lg bg-white/5">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        <p><span className="font-semibold">Status:</span> {user.status}</p>
      </div>

      <Button
        onClick={() => router.push(`/admin/users/${userId}/edit`)}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" /> Edit User
      </Button>
    </div>
  );
}
