import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, actions, children, className }) => {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/70 bg-white/95 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur",
        className,
      )}
    >
      {title || subtitle || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title ? <h3 className="text-base font-semibold tracking-tight text-slate-950">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
};

export default SectionCard;
