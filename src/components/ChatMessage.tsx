import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

export const ChatMessage = ({ content, isBot }: ChatMessageProps) => {
  return (
    <div className={cn("flex", isBot ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 mb-3 shadow-sm",
          isBot
            ? "bg-card text-card-foreground border border-border"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
