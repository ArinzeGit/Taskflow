import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 border-b border-slate-300 bg-white px-6 py-4">
      <div />
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions ? <div className="justify-self-end">{actions}</div> : <div />}
    </header>
  );
}
