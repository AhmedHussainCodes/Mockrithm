"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Reuse the QuestionBuilder inline for simplicity
function QuestionBuilder({
  questions,
  onChange,
  label = "Interview Questions",
}: {
  questions: string[];
  onChange: (next: string[]) => void;
  label?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const q = draft.trim();
    if (!q) return;
    onChange([...questions, q]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(questions.filter((_, i) => i !== idx));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return;
    const clone = [...questions];
    const [it] = clone.splice(from, 1);
    clone.splice(to, 0, it);
    onChange(clone);
  };

  return (
    <div className="space-y-3">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {questions.length === 0 && (
          <div className="text-white/60 text-sm border border-dashed border-white/15 rounded p-3">
            No questions yet. Add your first one below.
          </div>
        )}
        {questions.map((q, idx) => (
          <div
            key={`${q}-${idx}`}
            className="flex items-center gap-2 bg-black/30 border border-white/10 p-2 rounded"
          >
            <div className="text-white/90 text-sm flex-1">{q}</div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => move(idx, idx - 1)}
                title="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => move(idx, idx + 1)}
                title="Move down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-600"
                onClick={() => remove(idx)}
                title="Remove"
              >
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type a question and press Enter"
          className="flex-1 bg-black/30 text-white border-white/10"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button className="bg-white text-black" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}

type InterviewDoc = {
  role: string;
  level: string;
  type: "Technical" | "Behavioural" | "Mixed" | string;
  techstack: string[];
  questions: string[];
  coverImage: string;
  finalized: boolean;
  userId?: string;
  createdBy?: string;
  createdAt?: any;
};

export default function EditInterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<InterviewDoc>({
    role: "",
    level: "",
    type: "Mixed",
    techstack: [],
    questions: [],
    coverImage: "/covers/default.png",
    finalized: true,
    userId: "all-users",
  });

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "interviews", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setLoaded(true);
        return;
      }
      const v: any = snap.data();
      setForm({
        role: v.role ?? "",
        level: v.level ?? "",
        type: v.type ?? "Mixed",
        techstack: Array.isArray(v.techstack)
          ? v.techstack
          : v.techstack
          ? String(v.techstack)
              .split(",")
              .map((t: string) => t.trim())
          : [],
        questions: Array.isArray(v.questions) ? v.questions : [],
        coverImage: v.coverImage || "/covers/default.png",
        finalized: v.finalized ?? true,
        userId: v.userId || "all-users",
        createdBy: v.createdBy,
        createdAt: v.createdAt,
      });
      setLoaded(true);
    });

    return () => unsub();
  }, [id]);

  const canSave = useMemo(() => {
    return (
      form.role.trim().length > 0 &&
      form.level.trim().length > 0 &&
      form.type !== ""
    );
  }, [form]);

  const updateInterview = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const ref = doc(db, "interviews", id);
      await updateDoc(ref, {
        role: form.role.trim(),
        level: form.level.trim(),
        type: form.type,
        techstack: form.techstack.map((t) => t.trim()).filter(Boolean),
        questions: form.questions.map((q) => q.trim()).filter(Boolean),
        coverImage: form.coverImage || "/covers/default.png",
        finalized: !!form.finalized,
        userId: form.userId || "all-users",
      });
      router.push("/admin/interviews");
    } catch (e) {
      console.error("Failed to update interview:", e);
    } finally {
      setSaving(false);
    }
  };

  const removeInterview = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "interviews", id));
      router.push("/admin/interviews");
    } catch (e) {
      console.error("Failed to delete interview:", e);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-10 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Interview</h1>
          <p className="text-white/70 mt-2">
            Update fields or remove this interview
          </p>
        </div>
        <div className="flex gap-2 justify-end">
  <Button
    variant="ghost"
    className="px-3 py-1.5 text-sm rounded-md bg-transparent border border-white/40 text-white hover:bg-white/10 transition-colors"
    onClick={() => router.push("/admin/interviews")}
  >
    Back
  </Button>

  <Button
    onClick={removeInterview}
    className="px-3 py-1.5 text-sm rounded-md border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition-colors"
  >
    Delete
  </Button>

  <Button
    onClick={updateInterview}
    disabled={!canSave || saving}
    className="px-3 py-1.5 text-sm rounded-md bg-white text-black border border-white/20 hover:bg-black hover:text-white transition-colors"
  >
    {saving ? "Saving..." : "Save Changes"}
  </Button>
</div>

      </div>

      <Card className="bg-black/50 backdrop-blur-sm border-white/10 rounded-2xl">
        <CardHeader className="border-b border-white/10">
          <div className="text-white/80">
            {loaded ? "Edit details below" : "Loading..."}
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <Input
            placeholder="Role (e.g., Frontend Engineer)"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="bg-black/30 text-white border-white/10"
          />

          <Input
            placeholder="Level (e.g., Junior, Mid, Senior)"
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            className="bg-black/30 text-white border-white/10"
          />

          <Select
            value={form.type}
            onValueChange={(v) => setForm((f) => ({ ...f, type: v as any }))}
          >
            <SelectTrigger className="w-full bg-black/30 text-white border-white/10">
              <SelectValue placeholder="Select interview type" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Behavioural">Behavioural</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={(e) =>
              setForm((f) => ({ ...f, coverImage: e.target.value }))
            }
            className="bg-black/30 text-white border-white/10"
          />

          <Input
            placeholder="Tech Stack (comma separated)"
            value={form.techstack.join(", ")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                techstack: e.target.value.split(",").map((t) => t.trim()),
              }))
            }
            className="bg-black/30 text-white border-white/10"
          />

          <QuestionBuilder
            questions={form.questions}
            onChange={(next) => setForm((f) => ({ ...f, questions: next }))}
          />

          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={!!form.finalized}
              onChange={(e) =>
                setForm((f) => ({ ...f, finalized: e.target.checked }))
              }
            />
            Finalized
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
