const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colors = {
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: 'bg-blue-500/20 text-blue-400',   text: 'text-blue-400'   },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'bg-yellow-500/20 text-yellow-400', text: 'text-yellow-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'bg-purple-500/20 text-purple-400', text: 'text-purple-400' },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: 'bg-green-500/20 text-green-400',  text: 'text-green-400'  },
    red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: 'bg-red-500/20 text-red-400',      text: 'text-red-400'    },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold ${c.text} leading-tight`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
export default StatCard;
