import React from 'react';

interface TypingIndicatorProps {
  users: { userId: string; userName: string }[];
  className?: string;
}

export function TypingIndicator({ users, className = '' }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const names = users.map((u) => u.userName).slice(0, 3);
  const text =
    names.length === 1
      ? `${names[0]} is typing...`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing...`
      : `${names[0]}, ${names[1]}, and ${users.length - 2} others are typing...`;

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="italic">{text}</span>
    </div>
  );
}
