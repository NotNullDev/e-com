import { useEffect, useRef } from "react";

type SearchWithNavigationProps = {
  searchListRef: ReturnType<typeof useRef<HTMLElement>>;
} & React.HTMLProps<HTMLInputElement>;

const SearchWithNavigation = ({
  searchListRef,
  ...inputProps
}: SearchWithNavigationProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      inputRef.current?.focus();
      e.preventDefault();
    }
    if (document.activeElement === inputRef.current) {
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
      if (e.key === "ArrowDown") {
        (searchListRef.current?.firstChild as HTMLElement)?.focus();
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowUp") {
        (searchListRef.current?.lastChild as HTMLElement)?.focus();
        e.preventDefault();
        return;
      }
    }

    if (
      searchListRef.current?.children &&
      document.activeElement &&
      [...searchListRef.current.children].includes(document.activeElement)
    ) {
      if (e.key === "ArrowDown") {
        if (document.activeElement?.nextElementSibling as HTMLElement) {
          (document.activeElement?.nextElementSibling as HTMLElement).focus();
        } else {
          inputRef.current?.focus();
        }
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        if (document.activeElement?.previousElementSibling as HTMLElement) {
          (
            document.activeElement?.previousElementSibling as HTMLElement
          ).focus();
        } else {
          inputRef.current?.focus();
        }

        e.preventDefault();
      }
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement).blur();
      }
      if (e.key === "Enter") {
        (document.activeElement as HTMLElement)?.click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", focusInput);
    return () => document.removeEventListener("keydown", focusInput);
  }, []);

  return <input {...inputProps} ref={inputRef} />;
};

export default SearchWithNavigation;
