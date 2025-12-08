import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface ModuleNotesProps {
  moduleId: number;
}

export function ModuleNotes({ moduleId }: ModuleNotesProps) {
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const utils = trpc.useUtils();
  const { data: notes, isLoading } = trpc.notes.list.useQuery({ moduleId });

  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      utils.notes.list.invalidate({ moduleId });
      setNewNoteContent("");
      toast.success("Note created successfully");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const updateNote = trpc.notes.update.useMutation({
    onSuccess: () => {
      utils.notes.list.invalidate({ moduleId });
      setEditingNoteId(null);
      setEditContent("");
      toast.success("Note updated successfully");
    },
    onError: () => {
      toast.error("Failed to update note");
    },
  });

  const deleteNote = trpc.notes.delete.useMutation({
    onSuccess: () => {
      utils.notes.list.invalidate({ moduleId });
      toast.success("Note deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    createNote.mutate({ moduleId, content: newNoteContent });
  };

  const handleUpdateNote = (id: number) => {
    if (!editContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    updateNote.mutate({ id, content: editContent });
  };

  const handleDeleteNote = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote.mutate({ id });
    }
  };

  const startEditing = (id: number, content: string) => {
    setEditingNoteId(id);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
          <CardDescription>Loading your notes...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
        <CardDescription>Take personal notes as you learn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Note Form */}
        <div className="space-y-2">
          <Textarea
            placeholder="Write a new note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button
            onClick={handleCreateNote}
            disabled={createNote.isPending || !newNoteContent.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Existing Notes */}
        <div className="space-y-3">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id} className="bg-muted/30">
                <CardContent className="pt-4">
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={updateNote.isPending}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm whitespace-pre-wrap mb-3">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {new Date(note.createdAt).toLocaleDateString()} at{" "}
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(note.id, note.content)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNote(note.id)}
                            disabled={deleteNote.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet. Create your first note above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
