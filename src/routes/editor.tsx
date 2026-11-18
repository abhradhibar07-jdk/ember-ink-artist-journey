import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Command,
  Copy,
  Download,
  Eye,
  EyeOff,
  Grid,
  Layers3,
  LockKeyhole,
  Minus,
  MousePointer2,
  Plus,
  Redo2,
  RotateCcw,
  Scan,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  UnlockKeyhole,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import {
  type DesignElement,
  type TextElement,
  type ShapeElement,
  DEFAULT_ELEMENTS,
  LOCAL_STORAGE_KEY,
} from "@/lib/poster-data";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Studio Editor — BriefLock Studio" },
      {
        name: "description",
        content:
          "Interactive vector poster editor with constraint locking, fluid manipulation, and local persistence.",
      },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const [elements, setElements] = useState<DesignElement[]>(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState<string>("headline");
  const [saveStatus, setSaveStatus] = useState<string>("Auto-saved to LocalStorage");
  const [isClient, setIsClient] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [lockedAlertId, setLockedAlertId] = useState<string | null>(null);

  // Undo / Redo history stack
  const [history, setHistory] = useState<DesignElement[][]>([DEFAULT_ELEMENTS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Canvas Dragging State
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    origX: number;
    origY: number;
    elementId: string;
  } | null>(null);

  // Push new state to history
  const pushHistory = useCallback(
    (newElements: DesignElement[]) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newElements];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  // Restore saved poster from localStorage after client mounts
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setElements(parsed);
          setHistory([parsed]);
          setHistoryIndex(0);
        }
      }
    } catch (e) {
      console.warn("Failed to restore poster from localStorage:", e);
    }
  }, []);

  // Save to localStorage whenever elements change
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(elements));
      setSaveStatus("Auto-saved to LocalStorage");
    } catch (e) {
      console.warn("Failed to persist poster to localStorage:", e);
    }
  }, [elements, isClient]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevElements = history[prevIndex];
      if (prevElements) {
        setElements(prevElements);
        setHistoryIndex(prevIndex);
        setSaveStatus("Undo applied");
      }
    }
  }, [historyIndex, history]);

  // Redo action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextElements = history[nextIndex];
      if (nextElements) {
        setElements(nextElements);
        setHistoryIndex(nextIndex);
        setSaveStatus("Redo applied");
      }
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts (Undo/Redo, Nudge, Deselect)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInputActive =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (isInputActive) return;

      // Arrow Keys to nudge selected element
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const selected = elements.find((el) => el.id === selectedId);
        if (selected && !selected.locked) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
          const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;

          setElements((prev) => {
            const next = prev.map((el) => {
              if (el.id === selectedId) {
                return { ...el, x: el.x + dx, y: el.y + dy } as DesignElement;
              }
              return el;
            });
            return next;
          });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, handleUndo, handleRedo]);

  function toggleLock(id: string) {
    setElements((prev) => {
      const next = prev.map((el) => {
        if (el.id === id) {
          return { ...el, locked: !el.locked };
        }
        return el;
      });
      pushHistory(next);
      return next;
    });
  }

  function toggleVisibility(id: string) {
    setElements((prev) => {
      const next = prev.map((el) => {
        if (el.id === id) {
          return { ...el, visible: el.visible !== false ? false : true };
        }
        return el;
      });
      pushHistory(next);
      return next;
    });
  }

  function updateSelectedElement(patch: Partial<DesignElement>, recordHistory = true) {
    setElements((prev) => {
      const next = prev.map((el) => {
        if (el.id === selectedId) {
          if (el.locked) return el;
          return { ...el, ...patch } as DesignElement;
        }
        return el;
      });
      if (recordHistory) {
        pushHistory(next);
      }
      return next;
    });
  }

  function moveLayer(id: string, direction: "up" | "down") {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newArr = [...prev];
      const [item] = newArr.splice(index, 1);
      if (item) {
        newArr.splice(targetIndex, 0, item);
      }
      pushHistory(newArr);
      return newArr;
    });
  }

  function duplicateSelected() {
    const selected = elements.find((el) => el.id === selectedId);
    if (!selected) return;

    const newId = `${selected.id}-copy-${Date.now().toString().slice(-4)}`;
    const newEl: DesignElement = {
      ...selected,
      id: newId,
      name: `${selected.name} (Copy)`,
      x: selected.x + 20,
      y: selected.y + 20,
      locked: false,
    };

    setElements((prev) => {
      const next = [...prev, newEl];
      pushHistory(next);
      return next;
    });
    setSelectedId(newId);
  }

  function deleteSelected() {
    const selected = elements.find((el) => el.id === selectedId);
    if (!selected || selected.locked) return;

    setElements((prev) => {
      const next = prev.filter((el) => el.id !== selectedId);
      pushHistory(next);
      return next;
    });
    const remaining = elements.filter((el) => el.id !== selectedId);
    if (remaining.length > 0 && remaining[0]) {
      setSelectedId(remaining[0].id);
    }
  }

  function addTextLayer() {
    const newId = `text-${Date.now().toString().slice(-4)}`;
    const newEl: TextElement = {
      id: newId,
      name: "Custom Headline",
      type: "text",
      text: "CREATIVE VOICE",
      x: 60,
      y: 380,
      fontSize: 26,
      fill: "#1A1918",
      fontWeight: "700",
      letterSpacing: 0,
      locked: false,
      visible: true,
      opacity: 1,
      rotation: 0,
    };
    setElements((prev) => {
      const next = [...prev, newEl];
      pushHistory(next);
      return next;
    });
    setSelectedId(newId);
  }

  function addShapeLayer(shapeType: "circle" | "rect") {
    const newId = `shape-${Date.now().toString().slice(-4)}`;
    const newEl: ShapeElement =
      shapeType === "circle"
        ? {
            id: newId,
            name: "Geometric Accent",
            type: "circle",
            x: 200,
            y: 350,
            radius: 65,
            fill: "#EA580C",
            opacity: 0.9,
            locked: false,
            visible: true,
            rotation: 0,
          }
        : {
            id: newId,
            name: "Arch Block",
            type: "rect",
            x: 180,
            y: 320,
            width: 110,
            height: 110,
            rx: 24,
            fill: "#0D9488",
            opacity: 0.85,
            locked: false,
            visible: true,
            rotation: 0,
          };

    setElements((prev) => {
      const next = [...prev, newEl];
      pushHistory(next);
      return next;
    });
    setSelectedId(newId);
  }

  function resetToDefault() {
    setElements(DEFAULT_ELEMENTS);
    setSelectedId("headline");
    setHistory([DEFAULT_ELEMENTS]);
    setHistoryIndex(0);
    setSaveStatus("Reset to initial sample poster");
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }

  // Pointer drag interactions on SVG artboard
  function handlePointerDown(e: React.PointerEvent, el: DesignElement) {
    e.stopPropagation();
    setSelectedId(el.id);

    if (el.locked) {
      setLockedAlertId(el.id);
      setTimeout(() => setLockedAlertId(null), 1600);
      return;
    }

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 800 / rect.height;
    const pointerX = (e.clientX - rect.left) * scaleX;
    const pointerY = (e.clientY - rect.top) * scaleY;

    dragStartRef.current = {
      pointerX,
      pointerY,
      origX: el.x,
      origY: el.y,
      elementId: el.id,
    };
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || !dragStartRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 800 / rect.height;
    const pointerX = (e.clientX - rect.left) * scaleX;
    const pointerY = (e.clientY - rect.top) * scaleY;

    const dx = pointerX - dragStartRef.current.pointerX;
    const dy = pointerY - dragStartRef.current.pointerY;

    const newX = Math.round(dragStartRef.current.origX + dx);
    const newY = Math.round(dragStartRef.current.origY + dy);

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === dragStartRef.current?.elementId) {
          return { ...el, x: newX, y: newY } as DesignElement;
        }
        return el;
      }),
    );
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (isDragging) {
      setIsDragging(false);
      pushHistory(elements);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      dragStartRef.current = null;
    }
  }

  // Export full SVG file
  function exportSVG() {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nova_summit_poster_2026.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveStatus("Exported poster as SVG");
  }

  // Copy SVG markup to clipboard
  function copySVG() {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    navigator.clipboard.writeText(svgString).then(() => {
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
      setSaveStatus("SVG markup copied to clipboard");
    });
  }

  const selectedElement =
    elements.find((el) => el.id === selectedId) ??
    (elements[0] as DesignElement) ??
    (DEFAULT_ELEMENTS[0] as DesignElement);
  const lockedCount = elements.filter((el) => el.locked).length;

  return (
    <div className="editor-page-container">
      {/* 1. Sleek Compact Navigation with Unified Studio Controls (Height: 44px) */}
      <SiteNav
        compact
        centerSlot={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-burnt-orange/30 bg-burnt-orange/10 px-2.5 py-0.5 font-mono text-[8px] font-semibold text-burnt-orange">
            <LockKeyhole size={10} />
            {lockedCount} OF {elements.length} PROTECTED BY CONTRACT
          </span>
        }
        rightSlot={
          <div className="flex items-center gap-1.5">
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 border-r border-stone-300/60 pr-1.5">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-1 rounded transition-colors ${
                  historyIndex > 0
                    ? "text-stone-700 hover:bg-stone-200/80 hover:text-burnt-orange"
                    : "text-stone-400 cursor-not-allowed opacity-40"
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={12} />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`p-1 rounded transition-colors ${
                  historyIndex < history.length - 1
                    ? "text-stone-700 hover:bg-stone-200/80 hover:text-burnt-orange"
                    : "text-stone-400 cursor-not-allowed opacity-40"
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={12} />
              </button>
            </div>

            <button
              type="button"
              onClick={resetToDefault}
              className="flex items-center gap-1 rounded bg-stone-200/80 px-2 py-0.5 font-mono text-[7.5px] text-stone-700 hover:bg-stone-300 transition-colors"
              title="Reset to sample poster"
            >
              <RotateCcw size={9} /> Reset
            </button>

            <button
              type="button"
              onClick={copySVG}
              className="flex items-center gap-1 rounded border border-stone-300/80 bg-stone-100 px-2 py-0.5 font-mono text-[7.5px] text-stone-700 hover:border-burnt-orange hover:text-burnt-orange transition-colors"
              title="Copy SVG markup to clipboard"
            >
              {copiedNotice ? <Check size={9} className="text-burnt-orange" /> : <Copy size={9} />}
              <span>{copiedNotice ? "Copied!" : "Copy SVG"}</span>
            </button>

            <button
              type="button"
              onClick={exportSVG}
              className="flex items-center gap-1 rounded bg-burnt-orange px-2.5 py-0.5 font-mono text-[7.5px] font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              title="Download poster as SVG"
            >
              <Download size={9} /> Export
            </button>
          </div>
        }
      />

      {/* 2. The Studio Workspace Window (Fills 100% of remaining viewport) */}
      <main className="editor-workspace-wrap">
        <div className="editor-window">
          {/* Editor Top Bar (Height: 32px) */}
          <div className="editor-topbar">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>

            <div className="flex items-center gap-2 text-zinc-300 font-mono text-[8.5px]">
              <LockKeyhole size={11} className="text-burnt-orange" />
              <span>nova_creative_summit_2026.bl</span>
              <span className="text-zinc-500">• 600×800 Vector Artboard</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[8px]">
                <span className="h-1.5 w-1.5 rounded-full bg-burnt-orange shadow-[0_0_6px_var(--burnt-orange)] animate-pulse" />
                <span>{saveStatus}</span>
              </div>
              <span className="hidden md:inline-block rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[7px] text-zinc-400 border border-zinc-700">
                Selection: {selectedElement.name}{" "}
                {selectedElement.locked ? "• [PROTECTED]" : "• [EDITABLE]"}
              </span>
            </div>
          </div>

          {/* Left Panel: Layers Panel (Width: 220px) */}
          <aside className="editor-panel layer-panel">
            <div className="panel-title">
              <span className="flex items-center gap-1.5 font-bold">
                <Layers3 size={12} /> LAYERS ({elements.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={addTextLayer}
                  className="rounded bg-zinc-800 px-1 py-0.5 text-[7px] text-zinc-300 hover:bg-burnt-orange hover:text-white transition-colors"
                  title="Add new text layer"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => addShapeLayer("circle")}
                  className="rounded bg-zinc-800 px-1 py-0.5 text-[7px] text-zinc-300 hover:bg-burnt-orange hover:text-white transition-colors"
                  title="Add new shape layer"
                >
                  + Shape
                </button>
              </div>
            </div>

            {/* Scrollable Layer Row Items */}
            <div className="layer-list-scroll">
              {elements.map((el, idx) => {
                const isSelected = el.id === selectedId;
                const isHidden = el.visible === false;
                const Icon = el.type === "text" ? Type : Scan;

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className={`layer-row-item ${isSelected ? "layer-row-selected" : ""} ${
                      el.locked ? "layer-row-locked" : ""
                    } ${isHidden ? "opacity-40" : ""}`}
                  >
                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(el.id);
                      }}
                      className={`layer-btn-icon ${isHidden ? "text-zinc-600" : "text-zinc-400"}`}
                      title={isHidden ? "Show layer" : "Hide layer"}
                    >
                      {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>

                    {/* Type Icon */}
                    <Icon
                      size={11}
                      className={
                        el.locked ? "text-burnt-orange shrink-0" : "text-zinc-400 shrink-0"
                      }
                    />

                    {/* Layer Name */}
                    <span className="truncate">{el.name}</span>

                    {/* Up / Down Reorder */}
                    <div className="flex items-center opacity-60 hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayer(el.id, "up");
                        }}
                        disabled={idx === 0}
                        className="p-0.5 text-zinc-500 hover:text-white disabled:opacity-20"
                        title="Move layer up"
                      >
                        <ChevronUp size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayer(el.id, "down");
                        }}
                        disabled={idx === elements.length - 1}
                        className="p-0.5 text-zinc-500 hover:text-white disabled:opacity-20"
                        title="Move layer down"
                      >
                        <ChevronDown size={10} />
                      </button>
                    </div>

                    {/* Contract Lock Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(el.id);
                      }}
                      className={`layer-btn-icon ${el.locked ? "is-active" : ""}`}
                      aria-label={el.locked ? `Unlock ${el.name}` : `Lock ${el.name}`}
                      title={
                        el.locked
                          ? "Protected by contract (Click to unlock)"
                          : "Editable layer (Click to lock under contract)"
                      }
                    >
                      {el.locked ? <LockKeyhole size={11} /> : <UnlockKeyhole size={11} />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Left Panel Bottom Summary */}
            <div className="panel-bottom-card">
              <span className="flex items-center gap-1.5 font-bold">
                <Check size={10} /> {lockedCount} OF {elements.length} LAYERS PROTECTED
              </span>
              <div className="mt-1 text-[7px] text-zinc-500">
                Design contract guards brand typography, dates, and logo marks.
              </div>
            </div>
          </aside>

          {/* Center Column: Deep Dark Canvas Artboard Viewport */}
          <div
            className="editor-canvas"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Canvas Ruler & Controls Topbar */}
            <div className="canvas-topbar">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-burnt-orange font-bold">
                  <MousePointer2 size={11} /> SELECT &amp; MOVE TOOL
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">Click &amp; drag unlocked elements</span>
              </div>

              {/* View & Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrid((prev) => !prev)}
                  className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[7.5px] transition-colors ${
                    showGrid
                      ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Toggle alignment grid"
                >
                  <Grid size={10} /> Grid
                </button>

                <div className="flex items-center gap-1 text-zinc-400">
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.max(0.6, prev - 0.1))}
                    className="p-0.5 hover:text-white"
                    title="Zoom Out"
                  >
                    <Minus size={9} />
                  </button>
                  <span className="min-w-[32px] text-center font-mono">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.min(1.4, prev + 0.1))}
                    className="p-0.5 hover:text-white"
                    title="Zoom In"
                  >
                    <Plus size={9} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1)}
                    className="rounded bg-zinc-800 px-1 py-0.5 text-[7px] text-zinc-300 hover:text-white"
                    title="Reset Zoom to Fit"
                  >
                    Fit
                  </button>
                </div>
              </div>
            </div>

            {/* The SVG Poster Artboard (Responsive Containment: Never overflows viewport) */}
            <div className="canvas-artboard-wrap">
              <div
                className="canvas-artboard"
                style={{
                  transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
                  transformOrigin: "center center",
                }}
              >
                <svg
                  ref={svgRef}
                  viewBox="0 0 600 800"
                  className="h-full w-full select-none"
                  style={{ cursor: isDragging ? "grabbing" : "default" }}
                >
                  {/* Poster Paper Background */}
                  <rect width="600" height="800" fill="#FAF7F2" />

                  {/* Optional Alignment Grid */}
                  {showGrid && (
                    <g opacity="0.3" stroke="#D1C7BA" strokeWidth="0.5">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line key={`gx-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="800" />
                      ))}
                      {Array.from({ length: 16 }).map((_, i) => (
                        <line key={`gy-${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
                      ))}
                    </g>
                  )}

                  {/* Decorative Architectural Grid Lines */}
                  <circle
                    cx="540"
                    cy="60"
                    r="160"
                    fill="none"
                    stroke="#E2DDD5"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line x1="60" y1="165" x2="540" y2="165" stroke="#E5DFD7" strokeWidth="1.5" />
                  <line x1="60" y1="710" x2="540" y2="710" stroke="#E5DFD7" strokeWidth="1.5" />

                  {/* Render Elements in Layer Order */}
                  {elements.map((el) => {
                    if (el.visible === false) return null;
                    const isSelected = el.id === selectedId;
                    const isLockedWarning = lockedAlertId === el.id;

                    // Circle Element
                    if (el.type === "circle") {
                      const shape = el as ShapeElement;
                      const rad = shape.radius ?? 80;
                      return (
                        <g
                          key={el.id}
                          onPointerDown={(e) => handlePointerDown(e, el)}
                          style={{ cursor: el.locked ? "not-allowed" : "grab" }}
                          opacity={shape.opacity ?? 1}
                        >
                          <circle cx={shape.x} cy={shape.y} r={rad} fill={shape.fill} />

                          {/* Selection Bounding Box */}
                          {isSelected && (
                            <g>
                              <rect
                                x={shape.x - rad - 4}
                                y={shape.y - rad - 4}
                                width={rad * 2 + 8}
                                height={rad * 2 + 8}
                                fill="none"
                                stroke={el.locked ? "#EA580C" : "#0D9488"}
                                strokeWidth="1.8"
                                strokeDasharray={el.locked ? "5 3" : undefined}
                              />
                              {/* Corner Handles */}
                              <rect
                                x={shape.x - rad - 7}
                                y={shape.y - rad - 7}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x + rad + 1}
                                y={shape.y - rad - 7}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x - rad - 7}
                                y={shape.y + rad + 1}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x + rad + 1}
                                y={shape.y + rad + 1}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                            </g>
                          )}

                          {/* Floating Contract Lock Badge (Matches user's uploaded mockup) */}
                          {(isSelected || isLockedWarning) && el.locked && (
                            <g
                              transform={`translate(${shape.x - 90}, ${Math.max(shape.y - rad - 38, 12)})`}
                              className="contract-guard-badge"
                            >
                              <rect
                                width="180"
                                height="28"
                                rx="7"
                                fill="#FAF7F2"
                                stroke="#EA580C"
                                strokeWidth="1.2"
                              />
                              <circle cx="14" cy="14" r="8" fill="rgba(234, 88, 12, 0.14)" />
                              <text
                                x="28"
                                y="11"
                                fill="#1A1918"
                                fontSize="7"
                                fontWeight="700"
                                fontFamily="Space Grotesk, sans-serif"
                                letterSpacing="0.8"
                              >
                                IMMUTABLE CONTRACT GUARD
                              </text>
                              <text
                                x="28"
                                y="21"
                                fill="#66615B"
                                fontSize="6"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {el.name} • Locked
                              </text>
                              <circle cx="168" cy="14" r="3" fill="#EA580C" />
                            </g>
                          )}
                        </g>
                      );
                    }

                    // Rectangle Element
                    if (el.type === "rect") {
                      const shape = el as ShapeElement;
                      const w = shape.width ?? 120;
                      const h = shape.height ?? 180;
                      const rx = shape.rx ?? 0;
                      return (
                        <g
                          key={el.id}
                          onPointerDown={(e) => handlePointerDown(e, el)}
                          style={{ cursor: el.locked ? "not-allowed" : "grab" }}
                          opacity={shape.opacity ?? 1}
                        >
                          <rect
                            x={shape.x}
                            y={shape.y}
                            width={w}
                            height={h}
                            rx={rx}
                            fill={shape.fill}
                          />

                          {/* Selection Bounding Box */}
                          {isSelected && (
                            <g>
                              <rect
                                x={shape.x - 4}
                                y={shape.y - 4}
                                width={w + 8}
                                height={h + 8}
                                fill="none"
                                stroke={el.locked ? "#EA580C" : "#0D9488"}
                                strokeWidth="1.8"
                                strokeDasharray={el.locked ? "5 3" : undefined}
                              />
                              {/* Corner Handles */}
                              <rect
                                x={shape.x - 7}
                                y={shape.y - 7}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x + w + 1}
                                y={shape.y - 7}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x - 7}
                                y={shape.y + h + 1}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                              <rect
                                x={shape.x + w + 1}
                                y={shape.y + h + 1}
                                width="6"
                                height="6"
                                fill="#fff"
                                stroke="#1A1918"
                                strokeWidth="1.2"
                              />
                            </g>
                          )}

                          {/* Floating Contract Lock Badge */}
                          {(isSelected || isLockedWarning) && el.locked && (
                            <g
                              transform={`translate(${shape.x}, ${Math.max(shape.y - 36, 12)})`}
                              className="contract-guard-badge"
                            >
                              <rect
                                width="180"
                                height="28"
                                rx="7"
                                fill="#FAF7F2"
                                stroke="#EA580C"
                                strokeWidth="1.2"
                              />
                              <circle cx="14" cy="14" r="8" fill="rgba(234, 88, 12, 0.14)" />
                              <text
                                x="28"
                                y="11"
                                fill="#1A1918"
                                fontSize="7"
                                fontWeight="700"
                                fontFamily="Space Grotesk, sans-serif"
                                letterSpacing="0.8"
                              >
                                IMMUTABLE CONTRACT GUARD
                              </text>
                              <text
                                x="28"
                                y="21"
                                fill="#66615B"
                                fontSize="6"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {el.name} • Locked
                              </text>
                              <circle cx="168" cy="14" r="3" fill="#EA580C" />
                            </g>
                          )}
                        </g>
                      );
                    }

                    // Text Element
                    const textEl = el as TextElement;
                    const textWidth = Math.max(textEl.text.length * (textEl.fontSize * 0.58), 40);
                    const boxX = textEl.x - 6;
                    const boxY = textEl.y - textEl.fontSize + 4;
                    const boxHeight = textEl.fontSize + 8;

                    return (
                      <g
                        key={textEl.id}
                        onPointerDown={(e) => handlePointerDown(e, el)}
                        style={{ cursor: el.locked ? "not-allowed" : "grab" }}
                        opacity={textEl.opacity ?? 1}
                      >
                        <text
                          x={textEl.x}
                          y={textEl.y}
                          fill={textEl.fill}
                          fontSize={textEl.fontSize}
                          fontWeight={textEl.fontWeight ?? "normal"}
                          fontFamily={textEl.fontFamily ?? "Space Grotesk, sans-serif"}
                          letterSpacing={
                            textEl.letterSpacing ? `${textEl.letterSpacing}px` : undefined
                          }
                        >
                          {textEl.text}
                        </text>

                        {/* Selection Bounding Box */}
                        {isSelected && (
                          <g>
                            <rect
                              x={boxX}
                              y={boxY}
                              width={textWidth + 12}
                              height={boxHeight}
                              fill="none"
                              stroke={el.locked ? "#EA580C" : "#0D9488"}
                              strokeWidth="1.8"
                              strokeDasharray={el.locked ? "5 3" : undefined}
                            />
                            {/* Corner Handles */}
                            <rect
                              x={boxX - 3}
                              y={boxY - 3}
                              width="6"
                              height="6"
                              fill="#fff"
                              stroke="#1A1918"
                              strokeWidth="1.2"
                            />
                            <rect
                              x={boxX + textWidth + 9}
                              y={boxY - 3}
                              width="6"
                              height="6"
                              fill="#fff"
                              stroke="#1A1918"
                              strokeWidth="1.2"
                            />
                            <rect
                              x={boxX - 3}
                              y={boxY + boxHeight - 3}
                              width="6"
                              height="6"
                              fill="#fff"
                              stroke="#1A1918"
                              strokeWidth="1.2"
                            />
                            <rect
                              x={boxX + textWidth + 9}
                              y={boxY + boxHeight - 3}
                              width="6"
                              height="6"
                              fill="#fff"
                              stroke="#1A1918"
                              strokeWidth="1.2"
                            />
                          </g>
                        )}

                        {/* Floating Contract Lock Badge (Matches user's uploaded mockup) */}
                        {(isSelected || isLockedWarning) && el.locked && (
                          <g
                            transform={`translate(${boxX}, ${Math.max(boxY - 34, 12)})`}
                            className="contract-guard-badge"
                          >
                            <rect
                              width="180"
                              height="28"
                              rx="7"
                              fill="#FAF7F2"
                              stroke="#EA580C"
                              strokeWidth="1.2"
                            />
                            <circle cx="14" cy="14" r="8" fill="rgba(234, 88, 12, 0.14)" />
                            <text
                              x="28"
                              y="11"
                              fill="#1A1918"
                              fontSize="7"
                              fontWeight="700"
                              fontFamily="Space Grotesk, sans-serif"
                              letterSpacing="0.8"
                            >
                              IMMUTABLE LOGO CONTRACT
                            </text>
                            <text
                              x="28"
                              y="21"
                              fill="#66615B"
                              fontSize="6"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {el.name} • Locked
                            </text>
                            <circle cx="168" cy="14" r="3" fill="#EA580C" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Canvas Footer Status */}
            <div className="canvas-footer">
              <span className="flex items-center gap-1.5">
                <MousePointer2 size={10} className="text-burnt-orange" /> SELECT TOOL
              </span>
              <span>
                X: {selectedElement.x} &nbsp; Y: {selectedElement.y}
              </span>
              <span>600 × 800 VECTOR ARTBOARD</span>
              <span className="hidden sm:inline-block">LOCAL ENGINE • 50% FOUNDATION</span>
            </div>
          </div>

          {/* Right Panel: Properties Inspector (Width: 260px) */}
          <aside className="editor-panel properties-panel">
            <div className="panel-title">
              <span className="font-bold">PROPERTIES</span>
              <CircleHelp size={11} className="text-zinc-500" />
            </div>

            {/* Selected Element Header */}
            <span className="property-label">SELECTION</span>
            <div className="selection-box">
              <span className="selection-icon">
                {selectedElement.type === "text" ? <Type size={12} /> : <Scan size={12} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white text-[9px]">
                  {selectedElement.name}
                </div>
                <small className="uppercase text-[7px] text-zinc-400">
                  {selectedElement.type} • ID: {selectedElement.id}
                </small>
              </div>
            </div>

            {/* Primary Contract Guard Toggle Switch */}
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => toggleLock(selectedElement.id)}
                className={`flex w-full items-center justify-between rounded-lg p-2 font-mono text-[8px] transition-all ${
                  selectedElement.locked
                    ? "border border-burnt-orange/60 bg-burnt-orange/15 text-burnt-orange shadow-[0_0_10px_rgba(224,86,36,0.2)]"
                    : "border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {selectedElement.locked ? <LockKeyhole size={11} /> : <UnlockKeyhole size={11} />}
                  <span className="font-semibold">
                    {selectedElement.locked ? "IMMUTABLE CONTRACT" : "UNLOCKED (EDITABLE)"}
                  </span>
                </span>
                <span className="rounded bg-zinc-900/80 px-1 py-0.5 text-[7px]">
                  {selectedElement.locked ? "Guarded" : "Tap to Lock"}
                </span>
              </button>
            </div>

            {/* If Locked: Contract Guard Information Card */}
            {selectedElement.locked ? (
              <div className="property-lock-card">
                <LockKeyhole size={13} className="shrink-0 text-burnt-orange" />
                <div>
                  <span className="font-semibold text-white text-[8px] block">
                    Protected by Contract
                  </span>
                  <small className="text-[7px] text-zinc-400 leading-snug">
                    Direct manual manipulation is disabled to protect brand identity. Unlock above
                    if you need to make changes.
                  </small>
                </div>
              </div>
            ) : (
              /* If Unlocked: Live Editable Parameter Controls */
              <div className="mt-2.5 space-y-2.5">
                {/* Text Content Input */}
                {selectedElement.type === "text" && (
                  <div>
                    <span className="property-label">TEXT CONTENT</span>
                    <input
                      type="text"
                      value={(selectedElement as TextElement).text}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="inspector-input"
                      placeholder="Element text..."
                    />
                  </div>
                )}

                {/* Typography Controls */}
                {selectedElement.type === "text" && (
                  <>
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="property-label">FONT SIZE</span>
                        <span className="font-mono text-[8px] text-zinc-400">
                          {(selectedElement as TextElement).fontSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="84"
                        value={(selectedElement as TextElement).fontSize}
                        onChange={(e) =>
                          updateSelectedElement({ fontSize: Number(e.target.value) })
                        }
                        className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                      />
                    </div>

                    {/* Font Family Selector */}
                    <div>
                      <span className="property-label">FONT FAMILY</span>
                      <select
                        value={
                          (selectedElement as TextElement).fontFamily ?? "Space Grotesk, sans-serif"
                        }
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="inspector-input"
                      >
                        <option value="Space Grotesk, sans-serif">Space Grotesk (Modern)</option>
                        <option value="Playfair Display, serif">Playfair Display (Serif)</option>
                        <option value="JetBrains Mono, monospace">
                          JetBrains Mono (Technical)
                        </option>
                        <option value="Inter, sans-serif">Inter (Clean Sans)</option>
                      </select>
                    </div>

                    {/* Font Weight */}
                    <div>
                      <span className="property-label">FONT WEIGHT</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: "400", val: "400" },
                          { label: "500", val: "500" },
                          { label: "700", val: "700" },
                          { label: "800", val: "800" },
                        ].map((w) => (
                          <button
                            key={w.val}
                            type="button"
                            onClick={() => updateSelectedElement({ fontWeight: w.val })}
                            className={`rounded py-1 font-mono text-[7px] border transition-colors ${
                              (selectedElement as TextElement).fontWeight === w.val
                                ? "bg-burnt-orange/20 border-burnt-orange text-burnt-orange font-bold"
                                : "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Circle Radius */}
                {selectedElement.type === "circle" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="property-label">RADIUS</span>
                      <span className="font-mono text-[8px] text-zinc-400">
                        {(selectedElement as ShapeElement).radius ?? 80}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="160"
                      value={(selectedElement as ShapeElement).radius ?? 80}
                      onChange={(e) => updateSelectedElement({ radius: Number(e.target.value) })}
                      className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                    />
                  </div>
                )}

                {/* Rect Width / Height / Corner Radius */}
                {selectedElement.type === "rect" && (
                  <>
                    <div className="field-pair">
                      <span>
                        W:
                        <input
                          type="number"
                          value={(selectedElement as ShapeElement).width ?? 120}
                          onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                        />
                      </span>
                      <span>
                        H:
                        <input
                          type="number"
                          value={(selectedElement as ShapeElement).height ?? 180}
                          onChange={(e) =>
                            updateSelectedElement({ height: Number(e.target.value) })
                          }
                        />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="property-label">CORNER RADIUS (RX)</span>
                        <span className="font-mono text-[8px] text-zinc-400">
                          {(selectedElement as ShapeElement).rx ?? 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={(selectedElement as ShapeElement).rx ?? 0}
                        onChange={(e) => updateSelectedElement({ rx: Number(e.target.value) })}
                        className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                      />
                    </div>
                  </>
                )}

                {/* Position Coordinates */}
                <div>
                  <span className="property-label">POSITION (X / Y)</span>
                  <div className="field-pair">
                    <span>
                      X:
                      <input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                      />
                    </span>
                    <span>
                      Y:
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                      />
                    </span>
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="property-label">OPACITY</span>
                    <span className="font-mono text-[8px] text-zinc-400">
                      {Math.round((selectedElement.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round((selectedElement.opacity ?? 1) * 100)}
                    onChange={(e) =>
                      updateSelectedElement({ opacity: Number(e.target.value) / 100 })
                    }
                    className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                  />
                </div>

                {/* Curated Color Swatches & Native Color Picker */}
                <div>
                  <span className="property-label">COLOR FILL</span>
                  <div className="color-options">
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#1A1918" })}
                      className={`swatch swatch-black ${
                        selectedElement.fill === "#1A1918" ? "swatch-selected" : ""
                      }`}
                      title="Ink Black"
                    />
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#EA580C" })}
                      className={`swatch swatch-orange ${
                        selectedElement.fill === "#EA580C" ? "swatch-selected" : ""
                      }`}
                      title="Burnt Orange"
                    />
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#0D9488" })}
                      className={`swatch swatch-teal ${
                        selectedElement.fill === "#0D9488" ? "swatch-selected" : ""
                      }`}
                      title="Accent Teal"
                    />
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#D97706" })}
                      className={`swatch swatch-ochre ${
                        selectedElement.fill === "#D97706" ? "swatch-selected" : ""
                      }`}
                      title="Warm Ochre"
                    />
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#FAF7F2" })}
                      className={`swatch swatch-cream ${
                        selectedElement.fill === "#FAF7F2" ? "swatch-selected" : ""
                      }`}
                      title="Cream Paper"
                    />
                    <button
                      type="button"
                      onClick={() => updateSelectedElement({ fill: "#66615B" })}
                      className={`swatch swatch-stone ${
                        selectedElement.fill === "#66615B" ? "swatch-selected" : ""
                      }`}
                      title="Muted Stone"
                    />

                    {/* Native Color Picker */}
                    <label
                      className="relative flex items-center justify-center cursor-pointer"
                      title="Custom Hex Color"
                    >
                      <input
                        type="color"
                        value={
                          selectedElement.fill.startsWith("#") ? selectedElement.fill : "#1A1918"
                        }
                        onChange={(e) => updateSelectedElement({ fill: e.target.value })}
                        className="sr-only"
                      />
                      <span className="h-5 w-5 rounded-full border border-dashed border-zinc-500 flex items-center justify-center text-[8px] text-zinc-400 hover:border-burnt-orange hover:text-burnt-orange">
                        +
                      </span>
                    </label>
                  </div>
                </div>

                {/* Layer Actions (Duplicate, Delete) */}
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={duplicateSelected}
                    className="flex-1 flex items-center justify-center gap-1 rounded bg-zinc-800 py-1 font-mono text-[7.5px] text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <Copy size={9} /> Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="flex items-center justify-center gap-1 rounded bg-zinc-800/80 px-2 py-1 font-mono text-[7.5px] text-red-400 hover:bg-red-950/60 hover:text-red-300 transition-colors"
                    title="Delete layer"
                  >
                    <Trash2 size={9} /> Delete
                  </button>
                </div>
              </div>
            )}

            {/* GeNarrative Live Sprint Notice */}
            <div className="mt-auto pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 font-mono text-[7.5px] text-zinc-400">
                <Sparkles size={11} className="text-burnt-orange shrink-0" />
                <span>
                  AI generative engine &amp; constraint validator arrives in Nov 21 sprint.
                </span>
              </div>
            </div>
          </aside>

          {/* Editor Footer Status Bar (Height: 28px) */}
          <div className="editor-footer">
            <span>
              <Command size={10} /> READY FOR MANUAL EDITS
            </span>
            <span className="hidden sm:inline-block">
              ✦ 50% FOUNDATION • LOCAL VECTOR ENGINE • NO BACKEND
            </span>
            <span>
              <Eye size={10} /> {elements.length} ACTIVE LAYERS
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
