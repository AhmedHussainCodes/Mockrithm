"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FeedbackDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const ref = doc(db, "feedback", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFeedback({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error loading feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFeedback();
  }, [id]);

  if (loading) return <p className="p-6">Loading feedback...</p>;

  if (!feedback) return <p className="p-6">Feedback not found.</p>;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button
        onClick={() => router.push("/admin/feedback")}
        className="flex items-center gap-2"
        variant="outline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Feedback
      </Button>

      <h1 className="text-2xl font-bold">Feedback Details</h1>

      <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <p><strong>Name:</strong> {feedback.name}</p>
        <p><strong>Email:</strong> {feedback.email}</p>
        <p><strong>Type:</strong> {feedback.type}</p>
        <p><strong>Status:</strong> {feedback.status}</p>
        <p><strong>Message:</strong> {feedback.message}</p>
        <p className="text-sm text-gray-400">
          <strong>Submitted:</strong>{" "}
          {feedback.createdAt?.toDate
            ? feedback.createdAt.toDate().toLocaleString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
