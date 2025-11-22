import React from 'react';
import { Message, Sender } from '../types';
import { ExperienceCard } from './ExperienceCard';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className="shrink-0">
            {isBot ? (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center border-2 border-brand-orange relative overflow-hidden">
                   <div className="absolute w-3 h-3 bg-brand-orange rounded-full top-1 right-1"></div>
                   <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-xs">C</div>
                </div>
            ) : (
                 /* User Avatar is hidden in the chat flow in the screenshot for right-aligned messages, but we render structure just in case */
                 null
            )}
        </div>

        <div className="flex flex-col">
            {/* Text Bubble */}
            {message.text && (
                <div
                className={`px-5 py-3.5 rounded-[20px] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isBot
                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    : 'bg-brand-accent/30 text-gray-900 rounded-tr-none' // Matching the beige/orange tint
                }`}
                >
                {message.text}
                </div>
            )}

            {/* Experience Card (Only for bot) */}
            {isBot && message.cardData && (
                <ExperienceCard data={message.cardData} />
            )}
        </div>
      </div>
    </div>
  );
};
