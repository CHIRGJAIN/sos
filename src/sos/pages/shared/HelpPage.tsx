import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/sos/components/common";

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I escalate a case?",
      answer: "Open incident detail and choose Escalate from the action panel. Confirmation is required for critical escalations.",
    },
    {
      question: "How can NGOs request additional support?",
      answer: "Use the Support Requests page and submit resource type, incident id, and urgency note.",
    },
    {
      question: "How is SLA monitored?",
      answer: "SLA timers appear on incident cards and right-side escalation queue widgets.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <SectionTitle title="Help & Support" subtitle="Guides, FAQs, and escalation contacts" />

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/search">Search docs</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/notifications">View notifications</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/profile">Update profile</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.question} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
