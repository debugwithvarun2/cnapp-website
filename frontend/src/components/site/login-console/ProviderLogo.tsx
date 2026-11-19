import React from "react";
import { cn } from "@/lib/utils";

export type TechBrand =
  | "AWS"
  | "AZURE"
  | "GCP"
  | "KUBERNETES"
  | "DOCKER"
  | "GITHUB"
  | "GITLAB"
  | "TERRAFORM"
  | "ALIBABA"
  | "ORACLE"
  | "CLOUDFLARE"
  | "PINECONE"
  | "WEAVIATE"
  | "MILVUS"
  | "CHROMA"
  | "OPENAI"
  | "ANTHROPIC"
  | "COHERE"
  | "HUGGINGFACE";

interface ProviderLogoProps extends React.SVGProps<SVGSVGElement> {
  name: TechBrand | string;
  size?: number;
  variant?: "color" | "monochrome";
  className?: string;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({
  name,
  size = 16,
  variant = "color",
  className,
  ...props
}) => {
  const norm = (name || "").toUpperCase().trim() as TechBrand;
  const isMono = variant === "monochrome";

  switch (norm) {
    case "AWS":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Amazon Web Services"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M6.28 14.36c.64-.18 1.48-.3 2.5-.35 1.02-.05 1.83.05 2.42.3.6.25 1.01.66 1.25 1.23.24.57.24 1.35 0 2.34-.23.95-.67 1.77-1.33 2.46-.66.69-1.57 1.21-2.73 1.56-1.16.35-2.58.5-4.26.45-1.5-.05-2.8-.26-3.9-.63-.35-.12-.49-.38-.42-.78.07-.4.29-.62.66-.66 1.05.3 2.22.48 3.51.54 1.29.06 2.48-.05 3.57-.33.85-.22 1.5-.58 1.95-1.08.45-.5.68-1.08.69-1.74-.01-.54-.18-.94-.51-1.2-.33-.26-.89-.41-1.68-.45-.6-.03-1.28.02-2.04.15-.76.13-1.4.34-1.92.63-.35.2-.68.14-.99-.18-.31-.32-.38-.67-.21-1.05.24-.46.72-.75 1.44-.87.72-.12 1.4-.19 2.06-.21"
            fill={isMono ? "currentColor" : "#FF9900"}
          />
          <path
            d="M17.48 10.64c.3-.35.71-.52 1.23-.51.52.01.93.2 1.23.57.3.37.45.89.45 1.56 0 .67-.15 1.38-.45 2.13l-3.3 8.37c-.18.46-.46.77-.84.93-.38.16-.79.16-1.23 0-.44-.16-.72-.47-.84-.93l-3.3-8.37c-.3-.75-.45-1.46-.45-2.13 0-.67.15-1.19.45-1.56.3-.37.71-.56 1.23-.57.52-.01.93.16 1.23.51.3.35.48.87.54 1.56l2.13 5.94 2.13-5.94c.06-.69.24-1.21.54-1.56z"
            fill={isMono ? "currentColor" : "#232F3E"}
          />
          <path
            d="M3.75 18.25c4.5 3 11 3 16.5-1.5.3-.25.6-.05.45.3-2 3.5-9 6-17.5 1.8-.3-.15-.15-.45.55-.6z"
            fill={isMono ? "currentColor" : "#FF9900"}
          />
        </svg>
      );

    case "AZURE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Microsoft Azure"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M13.05 2.25L5.7 15.6h5.7l-3.6 6.15h10.5z"
            fill={isMono ? "currentColor" : "#0089D6"}
          />
          <path
            d="M13.05 2.25l-2.4 8.7 5.25 4.65h-4.5l-3.6 6.15h10.5L13.05 2.25z"
            fill={isMono ? "currentColor" : "#0072C6"}
          />
        </svg>
      );

    case "GCP":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Google Cloud Platform"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill={isMono ? "currentColor" : "#4285F4"}
          />
          <path
            d="M19 19H6c-2.76 0-5-2.24-5-5 0-2.5 1.84-4.57 4.26-4.91l.8-.11.4-.7C7.39 6.7 9.54 5.5 12 5.5c3.04 0 5.6 2.05 6.27 4.99l.23 1 .98.11c2.11.23 3.52 2.04 3.52 3.4 0 2.21-1.79 4-4 4z"
            fill={isMono ? "currentColor" : "#34A853"}
            opacity={isMono ? 1 : 0.4}
          />
        </svg>
      );

    case "KUBERNETES":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Kubernetes"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M12 2L3 7.2v10.4L12 22.8l9-5.2V7.2L12 2zm0 2.3l7 4v8l-7 4-7-4v-8l7-4zm0 3.7a4 4 0 100 8 4 4 0 000-8zm-1.5 2h3v1.5h-3V10zm0 2.5h3V14h-3v-1.5z"
            fill={isMono ? "currentColor" : "#326CE5"}
          />
        </svg>
      );

    case "DOCKER":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Docker"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M3 13.5c.5-2.5 3-4.5 6.5-4.5 4.5 0 6.5 2 9.5 2 1.5 0 3-.5 3.5-1.5-1 3.5-4 5.5-8.5 5.5-4.5 0-8-1.5-11-1.5zm6-6h2v2H9V7.5zm3 0h2v2h-2V7.5zm3 0h2v2h-2V7.5zm-6-3h2v2H9V4.5zm3 0h2v2h-2V4.5zm3 0h2v2h-2V4.5z"
            fill={isMono ? "currentColor" : "#2496ED"}
          />
        </svg>
      );

    case "GITHUB":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="GitHub"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            fill="currentColor"
          />
        </svg>
      );

    case "GITLAB":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="GitLab"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M23.6 9.87L21.7 4.02a.86.86 0 00-1.63 0l-1.9 5.85H5.83l-1.9-5.85a.86.86 0 00-1.63 0L.4 9.87a1.72 1.72 0 00.62 1.93L12 20.25l10.98-8.45a1.72 1.72 0 00.62-1.93z"
            fill={isMono ? "currentColor" : "#FC6D26"}
          />
        </svg>
      );

    case "TERRAFORM":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Terraform"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M14.7 8.16L21.3 4.3v7.71l-6.6 3.86V8.16z"
            fill={isMono ? "currentColor" : "#844FBA"}
          />
          <path d="M7.7 4.3l6.6 3.86v7.71L7.7 12V4.3z" fill={isMono ? "currentColor" : "#5C4EE5"} />
          <path
            d="M14.7 16.3l6.6-3.86v7.71l-6.6 3.85V16.3z"
            fill={isMono ? "currentColor" : "#00BC7F"}
          />
          <path
            d="M0.7 4.3l6.6 3.86v7.71L0.7 12V4.3z"
            fill={isMono ? "currentColor" : "#5C4EE5"}
            opacity={0.8}
          />
        </svg>
      );

    case "ALIBABA":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Alibaba Cloud"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M3 8.5C3 5.46 5.46 3 8.5 3h7C18.54 3 21 5.46 21 8.5v7c0 3.04-2.46 5.5-5.5 5.5h-7C5.46 21 3 18.54 3 15.5v-7zm3 3.5h3.5v-3.5H6V12zm8.5 0H18v-3.5h-3.5V12zM6 15.5h12v-2H6v2z"
            fill={isMono ? "currentColor" : "#FF6A00"}
          />
        </svg>
      );

    case "ORACLE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Oracle Cloud"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M16.5 4H7.5C3.36 4 0 7.36 0 11.5S3.36 19 7.5 19h9c4.14 0 7.5-3.36 7.5-7.5S20.64 4 16.5 4zm-.4 11.8H7.9c-2.38 0-4.3-1.92-4.3-4.3 0-2.38 1.92-4.3 4.3-4.3h8.2c2.38 0 4.3 1.92 4.3 4.3 0 2.38-1.92 4.3-4.3 4.3z"
            fill={isMono ? "currentColor" : "#F80000"}
          />
        </svg>
      );

    case "CLOUDFLARE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Cloudflare"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M18.25 9.15A5.85 5.85 0 0012.7 5.5a5.9 5.9 0 00-5.75 4.5 4.5 4.5 0 00-.7 8.95h12.5a4.15 4.15 0 00-.5-9.8z"
            fill={isMono ? "currentColor" : "#F38020"}
          />
        </svg>
      );

    case "OPENAI":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="OpenAI"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M20.5 10.5a5.5 5.5 0 00-.5-3.5 5.5 5.5 0 00-5.5-2.8 5.4 5.4 0 00-4.3-2 5.5 5.5 0 00-5.3 4 5.5 5.5 0 00-3.5 2.5 5.5 5.5 0 00.3 6 5.5 5.5 0 00.5 3.5 5.5 5.5 0 005.5 2.8 5.4 5.4 0 004.3 2 5.5 5.5 0 005.3-4 5.5 5.5 0 003.5-2.5 5.5 5.5 0 00-.3-6zm-7.5 10v-3.5l3-1.7a3.5 3.5 0 011.8 3.8 3.5 3.5 0 01-4.8 1.4zm-6.5-2.2a3.5 3.5 0 01-.4-4.2l3 1.7v3.5a3.5 3.5 0 01-2.6-1zm-3-5.3a3.5 3.5 0 012.2-2.7l3 1.7-3 1.7a3.5 3.5 0 01-2.2-.7zm6.5-6.2v3.5l-3 1.7a3.5 3.5 0 01-1.8-3.8 3.5 3.5 0 014.8-1.4zm6.5 2.2a3.5 3.5 0 01.4 4.2l-3-1.7V5.5a3.5 3.5 0 012.6 1zm3 5.3a3.5 3.5 0 01-2.2 2.7l-3-1.7 3-1.7a3.5 3.5 0 012.2.7z"
            fill={isMono ? "currentColor" : "#10A37F"}
          />
        </svg>
      );

    case "PINECONE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Pinecone"
          className={cn("shrink-0", className)}
          {...props}
        >
          <path
            d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 3.3L17.5 8 12 11.5 6.5 8 12 5.3zM6 9.8l5 3.1v6.3l-5-3.1V9.8zm12 6.3l-5 3.1v-6.3l5-3.1v6.3z"
            fill={isMono ? "currentColor" : "#000000"}
          />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label={name}
          className={cn("shrink-0", className)}
          {...props}
        >
          <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
        </svg>
      );
  }
};
