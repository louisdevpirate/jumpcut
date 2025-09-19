interface LoadingSkeletonProps {
  title: string;
}

export default function LoadingSkeleton({ title }: LoadingSkeletonProps) {
  return (
    <div className="netflix-section">
      <h2 className="netflix-section-title">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}