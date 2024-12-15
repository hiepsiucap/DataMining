/** @format */

import React, { useState } from "react";
import axios from "axios";
import { LineChart, AlertTriangle, CheckCircle } from "lucide-react";

interface CorrelationResponse {
  correlation: number;
}

export default function CorrelationCalculator() {
  const [inputArray, setInputArray] = useState<string>("");
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input validation
    const inputNumbers = inputArray
      .split(",")
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (inputNumbers.length < 2) {
      setError("Vui lòng nhập ít nhất hai số");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CorrelationResponse>(
        `${import.meta.env.VITE_API_URL_SERVER}/api/correlation/`,
        {
          input: inputNumbers,
        }
      );

      setCorrelation(response.data.correlation);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data || "Có lỗi xảy ra!");
      setCorrelation(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <LineChart className="w-10 h-10" />
            Tính Hệ Số Tương Quan
          </h1>
        </div>
        <div className="p-6 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="inputArray"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nhập dãy số (ngăn cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                id="inputArray"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="175, 133, 185, ..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 
                           transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-2">
                Nhập ít nhất hai số để tính tương quan.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center gap-3 py-3 rounded-lg 
                text-white font-bold transition-all transform hover:scale-105
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                }
              `}
            >
              {isLoading ? "Đang tính toán..." : "Tính Tương Quan"}
            </button>
          </form>
          {correlation !== null && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="font-bold text-green-900">Kết Quả:</h2>
                <p>
                  Hệ số tương quan:{" "}
                  <strong className="text-green-900">
                    {correlation.toFixed(4)}
                  </strong>
                </p>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h2 className="font-bold text-red-900">Lỗi:</h2>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
