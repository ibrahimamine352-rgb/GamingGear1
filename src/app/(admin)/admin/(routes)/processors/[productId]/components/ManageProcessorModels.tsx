"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Row = { id: string; name: string };

export default function ManageProcessorModels() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Row[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const r = await fetch("/api/processor/ProcessorModel", { cache: "no-store" });
    setItems(r.ok ? await r.json() : []);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const create = async (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!name.trim()) return;
    setCreating(true);
    setMsg(null);
    const r = await fetch("/api/processor/ProcessorModel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (r.ok) {
      setName("");
      await load();
    } else {
      setMsg(await r.text());
    }
    setCreating(false);
  };

  const remove = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setBusyId(id);
    setMsg(null);
    const r = await fetch(`/api/processor/ProcessorModel/${id}`, { method: "DELETE" });
    if (r.status === 204) {
      await load();
    } else if (r.status === 409) {
      setMsg("Cannot delete: this model is used by one or more processors.");
    } else {
      setMsg("Delete failed.");
    }
    setBusyId(null);
  };

  return (
    <>
      {/* OPEN DIALOG – must not submit parent form */}
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Manage
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Processor Models</DialogTitle>
          </DialogHeader>

          {/* Guard against Enter key submitting the parent form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {msg && <div className="text-sm text-red-400">{msg}</div>}

              <div className="flex gap-2">
                <Input
                  placeholder="New model (e.g., AMD, INTEL)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button type="button" onClick={create} disabled={creating}>
                  Add
                </Button>
              </div>

              <ul className="divide-y divide-white/10">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-2">
                    <span>{i.name}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => remove(i.id, e)}
                      disabled={busyId === i.id}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
