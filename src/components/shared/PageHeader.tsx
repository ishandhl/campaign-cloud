
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  onActionClick,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-8 flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {actionLabel && (actionHref || onActionClick) && (
          <>
            {actionHref ? (
              <Button asChild>
                <Link to={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onActionClick}>{actionLabel}</Button>
            )}
          </>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
