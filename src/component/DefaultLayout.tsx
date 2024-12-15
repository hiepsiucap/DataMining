/** @format */

import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Filter,
  BarChart3,
  Layers,
  List,
  PercentCircle,
} from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/",
    icon: Home,
    label: "Trang Chủ",
  },
  {
    to: "/preprocess",
    icon: Filter,
    label: "Tiền Xử Lý",
  },
  {
    to: "/cluster",
    icon: Layers,
    label: "Phân Cụm",
  },
  {
    to: "/bayes",
    icon: PercentCircle,
    label: "Bayes",
  },
  {
    to: "/classification",
    icon: BarChart3,
    label: "Phân Loại",
  },
  {
    to: "/frequentandassociate",
    icon: List,
    label: "Kết Hợp Apriori",
  },
];

const DefaultLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5 flex items-center justify-center space-x-3">
          <Layers className="w-10 h-10 text-white" />
          <h1 className="text-2xl font-bold">Data Mining</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <item.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="bg-white/10 p-4 text-center">
          <p className="text-sm text-white/50">
            © 2024 Công Cụ Phân Tích Dữ Liệu
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-full ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
