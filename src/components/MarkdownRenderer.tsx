import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
interface MarkdownRendererProps {
  children: string;
}

const allowedSchemes = ["http", "https", "mailto", "tel"];

export const MarkdownRenderer = ({ children }: MarkdownRendererProps) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[[rehypeSanitize, { protocols: { src: allowedSchemes, href: allowedSchemes } }]]}
    className="prose max-w-none prose-p:my-2 prose-li:my-1 dark:prose-invert"
  >
    {children}
  </ReactMarkdown>
);
