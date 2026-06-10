import { useGraphStore, type Tool } from './store/useGraphStore';
import { CanvasViewport } from './ui/CanvasViewport';
import './styles/global.css';

const TOOLS: { id: Tool; label: string }[] = [
  { id: 'select', label: 'Select' },
  { id: 'addNode', label: 'Add Node' },
  { id: 'addEdge', label: 'Add Edge' },
  { id: 'delete', label: 'Delete' },
];

export default function App() {
  const tool = useGraphStore((s) => s.tool);
  const setTool = useGraphStore((s) => s.setTool);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={headerStyle}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            style={tool === t.id ? activeButtonStyle : buttonStyle}
          >
            {t.label}
          </button>
        ))}
      </header>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <CanvasViewport />
      </main>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: '8px 12px',
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
};

const buttonStyle: React.CSSProperties = {
  padding: '4px 12px',
  background: 'transparent',
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  color: 'var(--color-text)',
  cursor: 'pointer',
  fontSize: 13,
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: 'var(--color-accent)',
  borderColor: 'var(--color-accent)',
};
