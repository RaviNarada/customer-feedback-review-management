import { MessageSquare, User } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-[rgba(0,0,0,0.3)] backdrop-blur-md border-b border-[#4b0082] sticky top-0 z-[100]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#5b247a] to-[#a52bbf] rounded-[10px] flex items-center justify-center text-white">
          <MessageSquare size={22} />
        </div>
        <span className="font-['Syne'] text-xl font-bold text-white">
          Response <span className="text-[#ff6ec7]">Module</span>
        </span>
      </div>
      <button className="flex items-center gap-2 px-5 py-2 bg-transparent border border-[#6a0dad]/40 rounded-full text-white text-sm cursor-pointer hover:border-[#6a0dad]/60 transition-colors">
        <User size={16} /> Admin
      </button>
    </header>
  );
}