'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
import { ArrowLeft } from 'lucide-react';

export default function NewUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        createdAt: serverTimestamp(),
      });

      router.push('/admin/users');
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <button
        onClick={() => router.push('/admin/users')}
        className="flex items-center text-sm px-3 py-2 border border-white/50 rounded-lg shadow-sm text-white hover:bg-gray-100 hover:text-black transition"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold">Add User</h1>

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
          <label className="block text-sm mb-1">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
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
          Create User
        </Button>
      </form>
    </div>
  );
}
