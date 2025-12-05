import { useState } from "react";

import { OverviewContent } from "./content";
import { OverviewHeader } from "./header";

import { TabMode, ViewMode } from "../type";
import { mockSessions, mockWaitlist } from "../mock";

export const Overview = () => {
  const [tabMode, setTabMode] = useState<TabMode>("bookings");
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        tabMode={tabMode}
        setTabMode={setTabMode}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        allSessions={mockSessions}
        waitlist={mockWaitlist}
      />
      <OverviewContent
        viewMode={viewMode}
        tabMode={tabMode}
        currentDate={currentDate}
        editingNotes={editingNotes}
        setEditingNotes={setEditingNotes}
        notes={notes}
        setNotes={setNotes}
        setCurrentDate={setCurrentDate}
        setViewMode={setViewMode}
        waitlist={mockWaitlist}
        sessions={mockSessions}
      />
    </div>
  );
};