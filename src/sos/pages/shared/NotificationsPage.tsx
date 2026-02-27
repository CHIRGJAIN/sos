import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge } from "@/sos/components/badges";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const NotificationsPage = () => {
  const { notifications, session, markNotificationRead, markAllNotificationsRead } = useSosApp();
  const role = session?.role || "authority";
  const filtered = notifications
    .filter((notification) => notification.role === role || notification.role === "all")
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Notifications"
        subtitle="All system updates and collaboration events"
        actions={
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => markAllNotificationsRead(role)}>
            Mark all read
          </Button>
        }
      />

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Recent updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((notification) => (
            <Link
              key={notification.id}
              to={notification.linkedPath}
              onClick={() => markNotificationRead(notification.id)}
              className={`block rounded-xl border p-3 ${notification.read ? "border-slate-200 bg-white" : "border-indigo-200 bg-indigo-50"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                <AlertBadge priority={notification.priority} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{notification.description}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDateTime(notification.createdAt)}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
