"use client";

import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`transition-all duration-200 ${isOver ? "scale-[1.01]" : ""}`}>
      {children}
    </div>
  );
}
