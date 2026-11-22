
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend = "up",
}) => {
  const isPositive = trend === "up";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
          {Icon && <Icon size={21} />}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-5">
        <h2 className="text-2xl font-bold text-gray-900">
          {value}
        </h2>
      </div>

      {/* Growth Indicator */}
      <div className="flex items-center gap-2 mt-3">

        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={15} />
          ) : (
            <TrendingDown size={15} />
          )}

          {change}
        </span>

        <span className="text-xs text-gray-400">
          {description}
        </span>

      </div>
    </div>
  );
};

export default StatCard;
