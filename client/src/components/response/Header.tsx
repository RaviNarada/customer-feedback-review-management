import { MessageSquare, User } from 'lucide-react';

export function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon"><MessageSquare size={22} /></div>
        <span className="logo-text">Response <span className="logo-accent">Module</span></span>
      </div>
      <button className="admin-btn"><User size={16} /> Admin</button>
    </header>
  );
}