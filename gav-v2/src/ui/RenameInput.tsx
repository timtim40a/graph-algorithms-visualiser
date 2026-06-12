import { useRef, useState } from "react";
import { useGraphStore } from "../store/useGraphStore";
import styles from "../styles/App.module.css";

interface Props {
    nodeId: string;
    x: number;
    y: number;
    initialLabel: string;
    onDone: () => void;
}

export function RenameInput({ nodeId, x, y, initialLabel, onDone }: Props) {
    const [label, setLabel] = useState(initialLabel);
    // Guard against blur firing after Enter unmounts the input
    const committed = useRef(false);

    const commit = () => {
        if (committed.current) return;
        committed.current = true;
        const { graph, setGraph } = useGraphStore.getState();
        setGraph({
            ...graph,
            nodes: graph.nodes.map((n) =>
                n.id === nodeId ? { ...n, label } : n
            ),
        });
        onDone();
    };

    return (
        <input
            className={styles.renameInput}
            autoFocus
            style={{ left: x, top: y }}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") onDone();
            }}
            onBlur={commit}
        />
    );
}