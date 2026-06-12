import { useEffect, useRef, useState } from 'react'
import { useGraphStore } from '../store/useGraphStore'
import styles from '../styles/App.module.css'

export function SettingsMenu() {
    const [open, setOpen] = useState(false)
    const settings = useGraphStore((s) => s.settings)
    const setSettings = useGraphStore((s) => s.setSettings)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className={styles.settingsAnchor}>
            <button
                className={styles.button}
                onClick={() => setOpen((v) => !v)}
            >
                More Settings
            </button>
            {open && (
                <div className={styles.dropdown}>
                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={settings.variableNodeSizes}
                            onChange={(e) =>
                                setSettings({ variableNodeSizes: e.target.checked })
                            }
                        />
                        Variable node sizes
                    </label>
                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={settings.draggableNodes}
                            onChange={(e) =>
                                setSettings({ draggableNodes: e.target.checked })
                            }
                        />
                        Draggable nodes
                    </label>
                </div>
            )}
        </div>
    )
}
