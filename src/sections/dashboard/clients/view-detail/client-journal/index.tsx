'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { StickyNote, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';

import useTranslate from '@/hook/use-translate';
import { toast } from '@/hook/use-toast';

interface ClientJournalProps {
  notes: any[];
  onAddNote?: (note: string) => void;
  setNoteToDelete?: (note: any) => void;
}

export const ClientJournal = ({ notes, onAddNote,  setNoteToDelete }: ClientJournalProps) => {
  const { t } = useTranslate();
  const user = useUser();
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: t("clientDetail.emptyNote"),
        description: t("clientDetail.enterNoteMessage"),
        variant: "destructive",
      });
      return;
    }
    onAddNote?.(newNote);
    setNewNote("");
  };

  const sortedNotes = notes
    ? [...notes].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          {t("clientDetail.clientJournal")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-3">
          <Textarea
            placeholder={t("clientDetail.addNotePlaceholder")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote}
              size="sm"
              className="min-w-20 text-xs"
            >
              {t("clientDetail.add")}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        {sortedNotes.length > 0 && (
          <div className="space-y-3 mt-6">
            {sortedNotes.map((note: any) => (
              <div key={note.id} className="p-4 rounded-lg border border-border relative">
                <p className="text-sm whitespace-pre-wrap pr-8">{note.note}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>
                    {note.profiles?.first_name} {note.profiles?.last_name}
                  </span>
                  <span>•</span>
                  <span>{format(new Date(note.created_at), 'PPp')}</span>
                </div>
                {(note.created_by === user?.user?.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 transition-opacity"
                    onClick={() => setNoteToDelete?.(note)}
                  >
                    <Trash2 className="h-8 w-8 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
