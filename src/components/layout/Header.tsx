"use client";

import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="border-border bg-background sticky top-0 z-30 flex h-20 items-center justify-between border-b px-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-1 text-sm">Welcome back 👋</p>
      </div>

 
    
    </header>
  );
};

export default Header;
