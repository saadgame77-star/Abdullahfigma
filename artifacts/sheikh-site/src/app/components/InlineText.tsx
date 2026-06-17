import { type CSSProperties, type ElementType } from "react";

// True when rendered inside the admin live-preview iframe.
function isPreview(): boolean {
  return (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("previewContent") === "1"
  );
}

// Renders a piece of site text. On the live site it's plain text; inside the
// admin preview it becomes click-to-edit and posts changes (by content path)
// back to the editor, which updates the draft.
export function InlineText({
  path,
  value,
  as,
  className,
  style,
}: {
  path: string;
  value: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const As = as ?? "span";

  if (!isPreview()) {
    return (
      <As className={className} style={style}>
        {value}
      </As>
    );
  }

  return (
    <As
      className={className}
      style={style}
      data-edit-path={path}
      contentEditable
      suppressContentEditableWarning
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        // Prevent navigation when the editable text lives inside a link.
        event.preventDefault();
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const text = event.currentTarget.textContent ?? "";
        if (text !== value) {
          window.parent?.postMessage(
            { type: "site-content-inline-edit", path, value: text },
            "*",
          );
        }
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </As>
  );
}
