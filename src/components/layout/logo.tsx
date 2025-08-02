import { Coffee } from 'lucide-react';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Coffee className="h-8 w-8 text-[#4A2C2A]" />
      <span className="text-xl font-semibold text-[#4A2C2A]">
        Coffee Bliss
      </span>
    </a>
  );
}