import { Coffee } from 'lucide-react';

export function Logo({ withLink = false }: { withLink?: boolean }) {
  const logoContent = (
    <>
      <Coffee className="h-8 w-8 text-[#4A2C2A]" />
      <span className="text-xl font-semibold text-[#4A2C2A]">
        Coffee Bliss
      </span>
    </>
  );

  if (withLink) {
    return (
      <a href="/" className="flex items-center gap-2">
        {logoContent}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {logoContent}
    </div>
  );
}