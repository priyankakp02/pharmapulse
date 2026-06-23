export default function Toolbar({ onExport, onPrint }) {
  return (
    <div className="toolbar">
      <button type="button" className="btn-action" onClick={onExport}>Export forecast report (JSON)</button>
      <button type="button" className="btn-action" onClick={onPrint}>Print dashboard</button>
      <span className="kbd-hint"><kbd>/</kbd> focus search · <kbd>Esc</kbd> clear filters</span>
    </div>
  );
}
