/** @format */

import React, { useState, useRef, useCallback } from "react";
import {
  FileSpreadsheet,
  Layers,
  Upload,
  Target,
  Minimize2,
  Maximize2,
  Crosshair,
  ArrowDownNarrowWide,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface RoughSetResult {
  equivalence_classes: Record<string, number[]>;
  lower_approximation: number[];
  upper_approximation: number[];
  boundary_region: number[];
  outside_region: number[];
  dependency_degree: number;
  reduct_attributes: string[];
}

interface ResultCardProps {
  icon: React.ElementType;
  title: string;
  data: unknown[];
  description: string;
  color: string;
}

const RoughSetProcessingApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<RoughSetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Enhanced parameter states with validation
  const [decisionAttribute, setDecisionAttribute] = useState<string>("");
  const [conditionAttributes, setConditionAttributes] = useState<string>("");
  const [targetIndices, setTargetIndices] = useState<string>("0,2,3");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];

        // Validate file type
        if (!selectedFile.name.endsWith(".xlsx")) {
          setError("Vui lòng chọn tệp Excel (.xlsx)");
          return;
        }

        setFile(selectedFile);
        setError(null);
      }
    },
    []
  );

  const validateInputs = () => {
    if (!file) {
      setError("Vui lòng chọn tệp tin");
      return false;
    }

    if (!decisionAttribute.trim()) {
      setError("Vui lòng nhập thuộc tính quyết định");
      return false;
    }

    if (!conditionAttributes.trim()) {
      setError("Vui lòng nhập thuộc tính điều kiện");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Comprehensive input validation
    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("file", file!);
    formData.append("decision_attribute", decisionAttribute.trim());
    formData.append("condition_attributes", conditionAttributes.trim());
    formData.append("X", targetIndices.trim());

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SERVER}/api/process_data/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra");
      }

      const data: RoughSetResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Xảy ra lỗi không xác định"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ResultCard: React.FC<ResultCardProps> = ({
    icon: Icon,
    title,
    data,
    description,
    color,
  }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 border-l-4 ${color}`}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div
            className={`${color.replace(
              "border-l-4",
              "bg-opacity-10"
            )} p-3 rounded-full mr-4`}
          >
            <Icon
              className={`w-7 h-7 ${color.replace("border-l-", "text-")}`}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Số lượng:</span>
            <span
              className={`${color.replace(
                "border-l-4",
                "bg"
              )} text-white px-3 py-1 rounded-full text-xs`}
            >
              {data.length}
            </span>
          </div>
          {data.length > 0 && (
            <div className="max-h-32 overflow-auto bg-white p-3 rounded-md shadow-inner">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                {JSON.stringify(data.slice(0, 10), null, 2)}
                {data.length > 10 && "\n..."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <Layers className="w-10 h-10" />
            Phân Tích Tập Gần Đúng (Rough Set)
          </h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Input */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-all 
                           rounded-2xl p-6 flex items-center gap-5 
                           hover:bg-indigo-50 group"
              >
                <FileSpreadsheet className="w-14 h-14 text-indigo-500 group-hover:text-indigo-700" />
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {file ? file.name : "Chọn tệp Excel"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file ? "Tệp đã chọn" : "Nhấn để tải lên tệp .xlsx"}
                  </p>
                </div>
              </div>
            </div>

            {/* Parameters Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thuộc Tính Quyết Định
                </label>
                <input
                  type="text"
                  value={decisionAttribute}
                  onChange={(e) => setDecisionAttribute(e.target.value)}
                  placeholder="Nhập tên thuộc tính quyết định"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thuộc Tính Điều Kiện
                </label>
                <input
                  type="text"
                  value={conditionAttributes}
                  onChange={(e) => setConditionAttributes(e.target.value)}
                  placeholder="Nhập các thuộc tính điều kiện (cách nhau bằng dấu phẩy)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chỉ Số Lớp Mục Tiêu
                </label>
                <input
                  type="text"
                  value={targetIndices}
                  onChange={(e) => setTargetIndices(e.target.value)}
                  placeholder="Nhập các chỉ số (VD: 0,2,3)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Error Handling */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className={`
                px-8 py-4 rounded-xl text-white font-bold transition-all 
                flex items-center justify-center mx-auto gap-3
                ${
                  file && !isLoading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang Phân Tích...
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Bắt Đầu Phân Tích
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="mt-10">
              <div className="flex items-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Kết Quả Phân Tích Tập Gần Đúng
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard
                  icon={Minimize2}
                  title="Xấp Xỉ Dưới"
                  data={result.lower_approximation}
                  description="Các phần tử chắc chắn thuộc về nhóm mục tiêu"
                  color="border-l-green-500"
                />
                <ResultCard
                  icon={Maximize2}
                  title="Xấp Xỉ Trên"
                  data={result.upper_approximation}
                  description="Các phần tử có thể thuộc về nhóm mục tiêu"
                  color="border-l-blue-500"
                />
                <ResultCard
                  icon={Crosshair}
                  title="Vùng Biên"
                  data={result.boundary_region}
                  description="Các phần tử không chắc chắn thuộc về nhóm mục tiêu"
                  color="border-l-yellow-500"
                />
                <ResultCard
                  icon={ArrowDownNarrowWide}
                  title="Thuộc Tính Rút Gọn"
                  data={result.reduct_attributes}
                  description="Tập thuộc tính tối thiểu để phân biệt các nhóm"
                  color="border-l-purple-500"
                />

                {/* New result cards */}
                <ResultCard
                  icon={Layers}
                  title="Lớp Tương Đương"
                  data={Object.entries(result.equivalence_classes).map(
                    ([key, value]) => `${key}: ${value}`
                  )}
                  description="Các lớp tương đương của dữ liệu"
                  color="border-l-indigo-500"
                />
                <ResultCard
                  icon={Target}
                  title="Độ Phụ Thuộc"
                  data={[result.dependency_degree.toFixed(4)]}
                  description="Mức độ phụ thuộc giữa các thuộc tính"
                  color="border-l-teal-500"
                />
                <ResultCard
                  icon={Maximize2}
                  title="Vùng Ngoài"
                  data={result.outside_region}
                  description="Các phần tử nằm ngoài nhóm mục tiêu"
                  color="border-l-red-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoughSetProcessingApp;
