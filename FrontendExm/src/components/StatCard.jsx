/*Dashboard card component. Displays title, value and icon for key metrics.*/


//NTS: Exports reusable react component w 3 props/ properties
export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4 transition-shadow hover:shadow-card-hover">
      {/* Icon container */}
      <div className="w-12 h-12 rounded-xl bg-primary-dim flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>


      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-muted text-xs font-medium uppercase tracking-wide truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">
          {/* Show placeholder while data is loading */}
          {value ?? <span className="text-border text-base font-normal animate-pulse">—</span>}
        </p>
      </div>
    </div>
  )
}
