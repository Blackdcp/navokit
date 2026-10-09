"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";

type TopicOption = { id: string; name: string; count: number };
type PopupPlacement = { side: "top" | "bottom"; listHeight: number };

function getPlacement(trigger: HTMLButtonElement): PopupPlacement {
  const rect = trigger.getBoundingClientRect();
  const viewportOffset = window.visualViewport?.offsetTop ?? 0;
  const viewportTop = Math.max(viewportOffset, document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0);
  const viewportBottom = viewportOffset + (window.visualViewport?.height ?? window.innerHeight);
  // Reserve the outer gutter and trigger gap before measuring the list space.
  const above = Math.max(0, rect.top - viewportTop - 24);
  const below = Math.max(0, viewportBottom - rect.bottom - 24);
  const side = below < 300 && above > below ? "top" : "bottom";
  const available = side === "top" ? above : below;
  return { side, listHeight: Math.max(48, Math.min(320, available - 54)) };
}

export default function TopicFilter({ lang, value, options, onChange }: {
  lang: "en" | "zh";
  value: string;
  options: TopicOption[];
  onChange: (value: string) => void;
}) {
  const zh = lang === "zh";
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState<PopupPlacement>({ side: "bottom", listHeight: 320 });
  const selectedIndex = Math.max(0, options.findIndex(option => option.id === value));
  const selected = options[selectedIndex];
  const label = zh ? "按专题筛选" : "Filter by topic";

  useEffect(() => {
    if (!open) return;
    const option = optionRefs.current[activeIndex];
    const list = listRef.current;
    option?.focus({ preventScroll: true });
    // Scroll only inside the popup; page scrolling would move its anchor.
    if (option && list) {
      const optionRect = option.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      if (optionRect.top < listRect.top) list.scrollTop += optionRect.top - listRect.top;
      else if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom;
    }
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;

    function closeOutside(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function updatePlacement() {
      if (triggerRef.current) setPlacement(getPlacement(triggerRef.current));
    }

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    window.addEventListener("resize", updatePlacement);
    window.visualViewport?.addEventListener("resize", updatePlacement);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      window.removeEventListener("resize", updatePlacement);
      window.visualViewport?.removeEventListener("resize", updatePlacement);
    };
  }, [open]);

  function openList(index = selectedIndex) {
    if (triggerRef.current) setPlacement(getPlacement(triggerRef.current));
    setActiveIndex(index);
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function choose(option: TopicOption) {
    onChange(option.id);
    closeList();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList(selectedIndex);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeList();
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(options[index]);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        closeList();
        break;
      case "Tab":
        // Return to the trigger before the native Tab action so the popup
        // behaves as one stop in the page's normal keyboard focus order.
        closeList();
        break;
    }
  }

  return (
    <div
      ref={rootRef}
      className="updates-topic-filter"
      data-open={open}
      data-filtered={value !== "all"}
      data-side={placement.side}
      style={{ "--updates-topic-list-height": `${placement.listHeight}px` } as CSSProperties}
    >
      <button
        ref={triggerRef}
        type="button"
        className="updates-topic-trigger"
        aria-label={`${label}: ${selected?.name ?? ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => open ? closeList() : openList()}
        onKeyDown={handleTriggerKeyDown}
      >
        <SlidersHorizontal size={17} aria-hidden="true" />
        <span className="updates-topic-trigger-label">{selected?.name}</span>
        <ChevronDown className="updates-topic-chevron" size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="updates-topic-popover">
          <p className="updates-topic-heading" id={`${id}-label`}>{label}</p>
          <ul ref={listRef} className="updates-topic-listbox" id={`${id}-listbox`} role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((option, index) => (
              <li
                key={option.id}
                ref={element => { optionRefs.current[index] = element; }}
                className="updates-topic-option"
                role="option"
                tabIndex={activeIndex === index ? 0 : -1}
                aria-selected={option.id === value}
                data-active={activeIndex === index}
                onClick={() => choose(option)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={event => handleOptionKeyDown(event, index)}
              >
                <span className="updates-topic-option-label">{option.name}</span>
                <span className="updates-topic-option-count">{option.count}<span className="sr-only">{zh ? " 条内容" : " entries"}</span></span>
                <span className="updates-topic-option-check" aria-hidden="true">{option.id === value && <Check size={16} />}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
