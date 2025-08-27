'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react'; // <-- Import back arrow

export default function EditUserPage() {
  const router = useRouter();
  const { id: userId } = useParams(); // dynamic ID from the URL

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    role: 'User',
    status: 'Active',
  });

  // Fetch user by ID from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, 'users', userId as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || '',
            role: data.role || 'User',
            status: data.status || 'Active',
          });
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

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', userId as string), {
        name: form.name,
        role: form.role,
        status: form.status,
      });

      router.push('/admin/users'); // Go back to user list
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (loading) return <p className="p-10">Loading user...</p>;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
<button
  onClick={() => router.push('/admin/users')}
  className="flex items-center text-sm px-3 py-2 border border-white/50 rounded-lg shadow-sm text-white hover:bg-gray-100 hover:text-black transition"
>
  <ArrowLeft className="h-4 w-4 mr-1" /> Back
</button>


      <h1 className="text-2xl font-bold">Edit User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <Select
            value={form.role}
            onValueChange={(val) => setForm({ ...form, role: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <Select
            value={form.status}
            onValueChange={(val) => setForm({ ...form, status: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Update User
        </Button>
      </form>
    </div>
  );
}
