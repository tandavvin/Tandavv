// src/utils/useHistoryState.js
//
// useState + undo / redo. Rapid changes (like typing a sentence) are grouped into ONE history entry,
// so Undo steps back by "an edit", not by a single keystroke.

import { useCallback, useRef, useState } from "react";

export function useHistoryState(initial, { limit = 100, burstMs = 600 } = {}) {
    const [state, setState] = useState(initial);
    const [counts, setCounts] = useState({ undo: 0, redo: 0 });

    const live = useRef(initial);
    const past = useRef([]);
    const future = useRef([]);
    const burst = useRef(false);
    const timer = useRef(null);

    const sync = useCallback(() => setCounts({ undo: past.current.length, redo: future.current.length }), []);

    const set = useCallback(
        (updater) => {
            const prev = live.current;
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (next === prev) return;

            if (!burst.current) {
                past.current.push(prev);
                if (past.current.length > limit) past.current.shift();
                future.current = [];
                burst.current = true;
            }
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                burst.current = false;
            }, burstMs);

            live.current = next;
            setState(next);
            sync();
        },
        [limit, burstMs, sync]
    );

    const undo = useCallback(() => {
        if (past.current.length === 0) return;
        clearTimeout(timer.current);
        burst.current = false;
        future.current.push(live.current);
        const prev = past.current.pop();
        live.current = prev;
        setState(prev);
        sync();
    }, [sync]);

    const redo = useCallback(() => {
        if (future.current.length === 0) return;
        clearTimeout(timer.current);
        burst.current = false;
        past.current.push(live.current);
        const next = future.current.pop();
        live.current = next;
        setState(next);
        sync();
    }, [sync]);

    // replace the state AND forget the history (used when a store is loaded)
    const reset = useCallback(
        (next) => {
            clearTimeout(timer.current);
            burst.current = false;
            past.current = [];
            future.current = [];
            live.current = next;
            setState(next);
            sync();
        },
        [sync]
    );

    return { state, set, undo, redo, reset, canUndo: counts.undo > 0, canRedo: counts.redo > 0 };
}
