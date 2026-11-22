
import { Link } from "react-router-dom";
import {
  Store,
  UserRound,
  Shield,
  ChevronRight,
} from "lucide-react";

// Settings navigation links
const links = [
  {
    title: "General settings",
    description: "Business details and store information",
    path: "/dashboard/settings/general",
    icon: Store,
  },
  {
    title: "Profile settings",
    description: "Your personal account information",
    path: "/dashboard/settings/profile",
    icon: UserRound,
  },
  {
    title: "Security settings",
    description: "Password and account security",
    path: "/dashboard/settings/security",
    icon: Shield,
  },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure your store and account preferences.
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="
                flex
                items-center
                gap-4
                border-b
                border-gray-100
                p-5
                last:border-0
                hover:bg-orange-50/50
                transition-colors
              "
            >
              {/* Setting Icon */}
              <div className="
                grid
                h-11
                w-11
                shrink-0
                place-items-center
                rounded-xl
                bg-orange-50
                text-[#FF7200]
              ">
                <Icon size={21} />
              </div>

              {/* Setting Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>

              {/* Navigation Arrow */}
              <ChevronRight
                size={19}
                className="shrink-0 text-gray-400"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
