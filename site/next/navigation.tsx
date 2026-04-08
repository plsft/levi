import { useLocation } from "react-router-dom";

export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

export function useRouter() {
  return {
    push: (path: string) => {
      window.location.href = path;
    },
    back: () => window.history.back(),
  };
}
