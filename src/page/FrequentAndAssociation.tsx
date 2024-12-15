/** @format */

import React, { useState } from "react";
import axios from "axios";
import { Layers, Upload, FileSpreadsheet } from "lucide-react";

interface FrequentItemSet {
  itemsets: string[];
  support: number;
}

interface AssociationRule {
  antecedents: string[];
  consequents: string[];
  confidence: number;
}

interface AnalysisResult {
  frequent_itemsets: FrequentItemSet[];
  maximal_itemsets: string[][];
  rules: AssociationRule[];
}

function AprioriAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [minSupport, setMinSupport] = useState<number>(0.5);
  const [minConfidence, setMinConfidence] = useState<number>(0.5);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const SUPPORT_OPTIONS = [
    { value: 0.3, label: "Thấp (0.3)", color: "bg-pink-500" },
    { value: 0.5, label: "TB (0.5)", color: "bg-blue-500" },
    { value: 0.7, label: "Cao (0.7)", color: "bg-green-500" },
  ];

  const CONFIDENCE_OPTIONS = [
    { value: 0.3, label: "Thấp (0.3)", color: "bg-pink-500" },
    { value: 0.5, label: "TB (0.5)", color: "bg-blue-500" },
    { value: 0.7, label: "Cao (0.7)", color: "bg-green-500" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    if (!file) {
      setError("Vui lòng chọn một file Excel.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("min_support", minSupport.toString());
    formData.append("min_confidence", minConfidence.toString());

    try {
      const response = await axios.post<AnalysisResult>(
        `${import.meta.env.VITE_API_URL_SERVER}/api/apriori/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <Layers className="w-10 h-10" />
            Phân Tích Luật Kết Hợp Apriori
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-all 
                           rounded-lg p-4 flex items-center gap-4 
                           hover:bg-indigo-50 group"
              >
                <FileSpreadsheet className="w-12 h-12 text-indigo-500 group-hover:text-indigo-700" />
                <div>
                  <p className="font-semibold text-gray-700">
                    {file ? file.name : "Chọn File Excel"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file ? "Đã chọn file" : "Nhấp để tải lên file .xlsx"}
                  </p>
                </div>
              </label>
            </div>

            {/* Parameter Selectors */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Support
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMinSupport(option.value)}
                      className={`
                        flex items-center justify-center gap-2 py-2 px-3 rounded-lg 
                        transition-all transform hover:scale-105
                        ${
                          minSupport === option.value
                            ? `${option.color} text-white`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      <Layers className="w-5 h-5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Confidence
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONFIDENCE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMinConfidence(option.value)}
                      className={`
                        flex items-center justify-center gap-2 py-2 px-3 rounded-lg 
                        transition-all transform hover:scale-105
                        ${
                          minConfidence === option.value
                            ? `${option.color} text-white`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      <Layers className="w-5 h-5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className={`
                px-6 py-3 rounded-lg text-white font-bold transition-all 
                flex items-center justify-center mx-auto gap-3
                ${
                  file && !isLoading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              <Upload className="w-5 h-5" />
              {isLoading ? "Đang phân tích..." : "Bắt Đầu Phân Tích"}
            </button>
          </div>

          {/* Error Handling */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="p-6 bg-gray-50 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Kết Quả Phân Tích
              </h2>

              {/* Frequent Itemsets */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Tập Phổ Biến:
                </h3>
                {result.frequent_itemsets.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600">
                    {result.frequent_itemsets.map((itemset, idx) => (
                      <li key={idx}>
                        {itemset.itemsets.join(", ")} - Hỗ trợ:{" "}
                        {itemset.support.toFixed(4)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Không tìm thấy tập phổ biến.</p>
                )}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Tập Phổ Biến Tối Đại:
                </h3>
                {result.maximal_itemsets.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600">
                    {result.maximal_itemsets.map((itemset, idx) => (
                      <li key={idx}>{itemset.join(", ")}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Không tìm thấy tập phổ biến tối đại.
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Luật Kết Hợp:
                </h3>
                {result.rules.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600">
                    {result.rules.map((rule, idx) => (
                      <li key={idx}>
                        Nếu {rule.antecedents.join(", ")} → Thì{" "}
                        {rule.consequents.join(", ")} (Tự tin:{" "}
                        {rule.confidence.toFixed(4)})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Không tìm thấy luật kết hợp.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AprioriAnalysis;
