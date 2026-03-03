import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, subtitle, actions, className }) => {
  return (
    <header
      className={cn(
        "rounded-[28px] border border-white/70 bg-white/90 px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
          ) : null}
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};

export default PageHeader;
