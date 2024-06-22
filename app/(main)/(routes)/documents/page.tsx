"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DocumentPage() {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create); // fileName.functionName

  const onCreate = () => {
    const promise = create({
      title: "Untitled", // for every new one
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button onClick={onCreate} className="flex gap-x-2">
        <PlusCircle />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentPage;
