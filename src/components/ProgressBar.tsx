interface ProgressBarProps {
  value: number;
  total: number;
}

export default function ProgressBar({ value, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-neutral-800">
          {value}/{total} films vus
        </span>
        <span className="text-sm font-medium text-neutral-600">
          {percent}%
        </span>
      </div>
      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-3 progress-bar rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
