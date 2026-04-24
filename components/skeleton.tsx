'use client'

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  )
}

export function DashboardSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <SkeletonBox className="h-8 w-32 mb-2" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <SkeletonBox className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <SkeletonBox className="h-4 w-20 mb-3" />
            <SkeletonBox className="h-6 w-16" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <SkeletonBox className="h-4 w-full mb-3" />
        <SkeletonBox className="h-2 w-full" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SkeletonBox className="h-5 w-40 mb-4" />
        {[1,2,3].map(i => (
          <div key={i} className="py-3 flex items-center justify-between border-t border-gray-100">
            <div>
              <SkeletonBox className="h-4 w-36 mb-1" />
              <SkeletonBox className="h-3 w-20" />
            </div>
            <SkeletonBox className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <SkeletonBox className="h-8 w-36" />
        <SkeletonBox className="h-9 w-32" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {[1,2,3,4].map(i => (
          <div key={i} className="px-5 py-4 flex items-center justify-between">
            <div>
              <SkeletonBox className="h-4 w-48 mb-2" />
              <SkeletonBox className="h-3 w-64 mb-1" />
              <SkeletonBox className="h-3 w-24" />
            </div>
            <SkeletonBox className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
