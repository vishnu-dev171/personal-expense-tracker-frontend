import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  isBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  description,
  actions,
  isBackButton,
  onBack,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex items-start gap-2">
        {isBackButton && (
          <ArrowLeft onClick={handleBack} className="cursor-pointer" />
        )}
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
