/** @format */

import React from "react";
import {
  Filter,
  Layers,
  PercentCircle,
  BarChart3,
  List,
  Database,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const CONG_CU_PHAN_TICH = [
  {
    title: "Tiền xử lý",
    description: "Chuẩn bị và làm sạch dữ liệu của bạn",
    icon: Filter,
    to: "/preprocess",
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
  },
  {
    title: "Phân cụm",
    description: "Nhóm các điểm dữ liệu tương tự",
    icon: Layers,
    to: "/cluster",
    color: "from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
  },
  {
    title: "Phân tích Bayes",
    description: "Suy luận xác suất",
    icon: PercentCircle,
    to: "/bayes",
    color: "from-green-500 to-green-600",
    hoverColor: "hover:from-green-600 hover:to-green-700",
  },
  {
    title: "Phân loại",
    description: "Phân loại và dự đoán",
    icon: BarChart3,
    to: "/classification",
    color: "from-red-500 to-red-600",
    hoverColor: "hover:from-red-600 hover:to-red-700",
  },
  {
    title: "Mẫu thường xuyên & Kết hợp",
    description: "Khám phá các mẫu dữ liệu",
    icon: List,
    to: "/frequentandassociate",
    color: "from-yellow-500 to-yellow-600",
    hoverColor: "hover:from-yellow-600 hover:to-yellow-700",
  },
  {
    title: "Dữ liệu gốc",
    description: "Xem các tập dữ liệu gốc",
    icon: Database,
    to: "/rawdata",
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
  },
];

const TrangChu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bộ Công Cụ Phân Tích Dữ Liệu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các công cụ phân tích dữ liệu mạnh mẽ để biến đổi các hiểu
            biết từ dữ liệu
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {CONG_CU_PHAN_TICH.map((congCu) => (
            <Link
              key={congCu.title}
              to={congCu.to}
              className={`
                block transform transition-all duration-300 ease-in-out
                bg-gradient-to-br ${congCu.color} 
                rounded-2xl shadow-xl overflow-hidden
                hover:scale-105 ${congCu.hoverColor}
                hover:shadow-2xl
              `}
            >
              <div className="p-6 text-white relative">
                <div className="flex items-center justify-between mb-4">
                  <congCu.icon className="w-12 h-12 opacity-80" />
                  <ArrowRight className="w-8 h-8 opacity-70 group-hover:translate-x-2 transition-transform" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{congCu.title}</h2>
                <p className="text-white/80">{congCu.description}</p>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Hãy chọn một công cụ để bắt đầu hành trình phân tích dữ liệu của bạn
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;
