import { MessageSquare, User } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-[100]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2d0a6b] to-[#e94e77] rounded-[10px] flex items-center justify-center text-white">
          <MessageSquare size={22} />
        </div>
        <span className="font-['Syne'] text-xl font-bold text-gray-800">
          Response <span className="text-[#5b247a]">Module</span>
        </span>
      </div>
      <button className="flex items-center gap-2 px-5 py-2 bg-transparent border border-gray-300 rounded-full text-gray-700 text-sm cursor-pointer hover:border-gray-400 transition-colors">
        <User size={16} /> Admin
      </button>
    </header>
  );
}