import { clsx } from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

interface ChatBubbleProps {
  from: "user" | "assistant";
  media?: ReactNode;
}

export const ChatBubble = ({ from, media, children }: PropsWithChildren<ChatBubbleProps>) => (
  <div className={clsx("flex flex-col gap-2", from === "user" ? "items-end" : "items-start")}
    role="listitem">
    <div
      className={clsx(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md",
        from === "user"
          ? "rounded-br-sm bg-skin-primary text-white"
          : "rounded-bl-sm bg-skin-base/60 text-skin-text",
      )}
    >
      {children}
    </div>
    {media ? <div className="max-w-[80%] overflow-hidden rounded-2xl shadow-md">{media}</div> : null}
  </div>
);
