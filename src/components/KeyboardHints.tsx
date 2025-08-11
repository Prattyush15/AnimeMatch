export default function KeyboardHints() {
  return (
    <div className="mt-4 text-sm text-gray-600">
      <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <kbd className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">L</kbd>
        <span>Like</span>
        <kbd className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">S</kbd>
        <span>Pass</span>
        <kbd className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">W</kbd>
        <span>Watched</span>
      </div>
    </div>
  );
}


