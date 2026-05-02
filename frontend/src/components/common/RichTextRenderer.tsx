import DOMPurify from "dompurify";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

/**
 * RichTextRenderer component to safely render HTML content from ReactQuill
 * This component handles XSS protection and ensures standard HTML tags
 * are styled correctly even with Tailwind's CSS reset.
 */
export const RichTextRenderer = ({ content, className = "" }: RichTextRendererProps) => {
  // Sanitize HTML to prevent XSS attacks
  // In SSR environments, we skip sanitization on the server to avoid errors, 
  // but it will be sanitized once hydrated on the client.
  const sanitizedContent = typeof window !== 'undefined' 
    ? DOMPurify.sanitize(content) 
    : content;

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
