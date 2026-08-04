import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Heading2, Link2, Undo } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
};

const actions = [
  { cmd: "bold", icon: Bold, title: "Bold" },
  { cmd: "italic", icon: Italic, title: "Italic" },
  { cmd: "formatBlock", arg: "h3", icon: Heading2, title: "Heading" },
  { cmd: "insertUnorderedList", icon: List, title: "Bulleted list" },
  { cmd: "insertOrderedList", icon: ListOrdered, title: "Numbered list" },
  { cmd: "undo", icon: Undo, title: "Undo" },
] as const;

export function RichTextEditor({ value, onChange, label = "Content" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  function run(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <div className="rounded-md border border-border">
        <div className="flex flex-wrap gap-1 border-b border-border bg-surface p-1.5">
          {actions.map((a) => (
            <button
              key={a.cmd + ("arg" in a ? a.arg : "")}
              type="button"
              title={a.title}
              aria-label={a.title}
              onClick={() => run(a.cmd, "arg" in a ? a.arg : undefined)}
              className="rounded p-1.5 hover:bg-card"
            >
              <a.icon className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            title="Add link"
            aria-label="Add link"
            onClick={() => {
              const url = window.prompt("Link URL");
              if (url) run("createLink", url);
            }}
            className="rounded p-1.5 hover:bg-card"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          suppressContentEditableWarning
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          className="prose-admin min-h-[160px] px-3 py-2 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}
