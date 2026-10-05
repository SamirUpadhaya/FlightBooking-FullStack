export default function Alert({ type = 'error', children, onClose }) {
  if (!children) return null;
  return <div className={`alert ${type}`}>{children}{onClose && <button onClick={onClose}>×</button>}</div>;
}
