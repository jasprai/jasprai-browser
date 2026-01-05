import type { Message } from '@extension/storage';
import { ACTOR_PROFILES } from '../types/message';
import { memo } from 'react';

interface MessageListProps {
  messages: Message[];
  isDarkMode?: boolean;
}

export default memo(function MessageList({ messages, isDarkMode = false }: MessageListProps) {
  return (
    <div className="max-w-full space-y-4">
      {messages.map((message, index) => (
        <MessageBlock
          key={`${message.actor}-${message.timestamp}-${index}`}
          message={message}
          isSameActor={index > 0 ? messages[index - 1].actor === message.actor : false}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
});

interface MessageBlockProps {
  message: Message;
  isSameActor: boolean;
  isDarkMode?: boolean;
}

function MessageBlock({ message, isSameActor, isDarkMode = false }: MessageBlockProps) {
  if (!message.actor) {
    console.error('No actor found');
    return <div />;
  }
  const actor = ACTOR_PROFILES[message.actor as keyof typeof ACTOR_PROFILES];
  const isProgress = message.content === 'Showing progress...';

  const isUser = message.actor === 'USER';

  return (
    <div
      className={`flex max-w-full gap-3 fade-in-up ${
        !isSameActor
          ? `mt-6 first:mt-0`
          : 'mt-1'
      }`}>
      {!isSameActor && !isUser && (
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full glass"
          style={{ backgroundColor: actor.iconBackground }}>
          <img src={actor.icon} alt={actor.name} className="size-5" />
        </div>
      )}
      {(isSameActor || isUser) && <div className="w-8 shrink-0" />}

      <div className={`min-w-0 flex-1 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!isSameActor && (
          <div className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {actor.name}
          </div>
        )}

        <div className="max-w-[95%] space-y-1">
          <div className={`px-4 py-3 text-sm transition-all duration-300 ${
            isUser 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-purple-500/10' 
              : 'glass text-slate-300 rounded-2xl rounded-tl-sm hover:text-white'
          }`}>
            {isProgress ? (
              <div className="flex items-center gap-3">
                <div className="flex h-2 w-2 relative">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></div>
                </div>
                <span className="text-xs font-medium text-purple-300 uppercase tracking-widest animate-pulse">Processing...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </div>
            )}
          </div>
          {!isProgress && (
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} px-1`}>
              {formatTimestamp(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Formats a timestamp (in milliseconds) to a readable time string
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted time string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the message is from today
  const isToday = date.toDateString() === now.toDateString();

  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Check if the message is from this year
  const isThisYear = date.getFullYear() === now.getFullYear();

  // Format the time (HH:MM)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return timeStr; // Just show the time for today's messages
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  if (isThisYear) {
    // Show month and day for this year
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  // Show full date for older messages
  return `${date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}, ${timeStr}`;
}
