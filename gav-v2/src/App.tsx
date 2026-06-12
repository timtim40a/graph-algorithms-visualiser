import { useGraphStore, type Tool } from './store/useGraphStore'
import { CanvasViewport } from './ui/CanvasViewport'
import './styles/global.css'
import styles from './styles/App.module.css'

const TOOLS: { id: Tool; label: string }[] = [
    { id: 'select', label: 'Select' },
    { id: 'addNode', label: 'Add Node' },
    { id: 'addEdge', label: 'Add Edge' },
    { id: 'delete', label: 'Delete' },
]

export default function App() {
    const tool = useGraphStore((s) => s.tool)
    const setTool = useGraphStore((s) => s.setTool)

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                {TOOLS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTool(t.id)}
                        className={
                            tool === t.id ?
                                `${styles.button} ${styles.buttonActive}`
                            :   styles.button
                        }
                    >
                        {t.label}
                    </button>
                ))}
            </header>
            <main className={styles.main}>
                <CanvasViewport />
            </main>
        </div>
    )
}
