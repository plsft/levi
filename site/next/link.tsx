import { Link as RouterLink } from "react-router-dom";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof RouterLink> & {
  href?: string;
};

export default function Link({ href, to, children, ...props }: LinkProps) {
  const target = href ?? to ?? "/";
  const isExternal =
    typeof target === "string" &&
    (target.startsWith("http") || target.startsWith("//"));

  if (isExternal) {
    return (
      <a href={target as string} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={target} {...props}>
      {children}
    </RouterLink>
  );
}
