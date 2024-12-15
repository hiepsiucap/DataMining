/** @format */

import React, { useState } from "react";
import axios from "axios";
import { FileSpreadsheet, AlertTriangle, CheckCircle } from "lucide-react";
interface Result {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  unique_values: { [key: string]: string[] };
}

export default function TaiLenMoHinhNaiveBayes() {
  const [file, setFile] = useState<File | null>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn một tệp trước!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/naive-bayes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data || "Có lỗi xảy ra! Vui lòng thử lại.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden ">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-10 h-10" />
            Mô Hình Naive Bayes
          </h1>
        </div>
        <div className="p-6 space-y-6">
          <form
            onSubmit={handleUpload}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="col-span-3">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer border-2 py-12 px-6 border-dashed border-indigo-300 hover:border-indigo-500 transition-all 
                             rounded-lg p-4 flex items-center justify-center gap-4 
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
              {isLoading ? "Đang tải lên..." : "Tải Lên Và Xử Lý"}
            </button>
          </form>
          {result && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="font-bold text-green-900">Kết Quả:</h2>
                <p>Các cột: {result.columns.join(", ")}</p>
                <p className="mt-2">
                  Giá trị duy nhất:
                  {Object.entries(result.unique_values).map(([key, values]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {values.join(", ")}
                    </div>
                  ))}
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
