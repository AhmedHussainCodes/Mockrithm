"use client";

import type { Interview } from "@/app/user/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface InterviewTableProps {
  interviews: Interview[];
}

export function InterviewTable({ interviews }: InterviewTableProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Level</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow
              key={interview.id}
              className="cursor-pointer hover:bg-gray-900 border-gray-200"
              onClick={() => router.push(`/user/interviews/${interview.id}`)}
            >
              <TableCell className="font-medium text-gray-300">
                {interview.role}
              </TableCell>
              <TableCell className="text-gray-300">{interview.level}</TableCell>
              <TableCell className="text-gray-300">{interview.type}</TableCell>
              <TableCell>
               <Badge
  variant={interview.finalized ? "default" : "secondary"}
  className={
    interview.finalized
      ? "bg-black text-white hover:bg-gray-800 border border-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-rounded border-gray-400"
  }
>
  {interview.finalized ? "Completed" : "In Progress"}
</Badge>

              </TableCell>
              <TableCell className="text-gray-300">
                {formatDate(interview.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
