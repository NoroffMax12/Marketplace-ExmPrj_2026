// Label component used for membership tiers,
// user roles and order statuses throughout the admin panel.

export default function Badge({label}) { /*NTS: Exports function as component with label */
  const STYLES = {

    // Membership tiers
    bronze: 'bg-orange-50 text-orange-600 border border-orange-200',
    silver: 'bg-slate-100 text-slate-600 border border-slate-200',
    gold: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
   
    // User roles
    admin: 'bg-primary-dim text-primary border border-green-200',
    user: 'bg-blue-50 text-blue-600 border border-blue-200',
   
    // Order statuses
    'in progress': 'bg-amber-50 text-amber-600 border border-amber-200',
    ordered: 'bg-blue-50 text-blue-600 border border-blue-200',
    completed: 'bg-primary-dim text-primary border border-green-200',
  }


  const key = label?.toLowerCase()
  const style = STYLES[key] || 'bg-gray-100 text-gray-500 border border-gray-200'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}
