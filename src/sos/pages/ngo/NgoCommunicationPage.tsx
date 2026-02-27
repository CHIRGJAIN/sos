import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const NgoCommunicationPage = () => {
  const { conversations, sendMessage, markConversationRead } = useSosApp();
  const [activeId, setActiveId] = useState(conversations[0]?.id || "");
  const [value, setValue] = useState("");

  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) || conversations[0],
    [activeId, conversations],
  );

  return (
    <div className="space-y-4">
      <SectionTitle title="Authority Communications / Inbox" subtitle="Coordinate with authority, partner NGOs, and response teams" />

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_240px]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setActiveId(conversation.id);
                  markConversationRead(conversation.id);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-left ${active?.id === conversation.id ? "border-indigo-200 bg-indigo-50" : "border-slate-200"}`}
              >
                <p className="text-sm font-semibold text-slate-800">{conversation.title}</p>
                <p className="text-xs text-slate-500">{conversation.participants.join(", ")}</p>
                {conversation.unreadCount ? <p className="text-xs text-red-600">{conversation.unreadCount} unread</p> : null}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">{active?.title || "No conversation"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-2">
              <div className="space-y-2">
                {active?.messages.map((message) => (
                  <div key={message.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{message.sender}</span>
                      <span>{formatDateTime(message.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{message.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2">
              <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Write a message to authority"
                className="rounded-full"
              />
              <Button
                className="rounded-full"
                onClick={() => {
                  if (!active?.id || !value.trim()) return;
                  const result = sendMessage(active.id, value.trim());
                  if (!result.success) {
                    toast.error(result.message);
                    return;
                  }
                  setValue("");
                  toast.success("Message sent");
                }}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {active?.participants.map((participant) => (
              <div key={participant} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
                {participant}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NgoCommunicationPage;

