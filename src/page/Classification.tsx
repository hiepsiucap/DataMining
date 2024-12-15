/** @format */

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

import { FileSpreadsheet, AlertTriangle } from "lucide-react";

type Results = {
  gini_tree: string;
  entropy_tree: string;
};

export default function DecisionTreeClassification() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn một tệp trước!");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/decision_tree/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResults(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Có lỗi xảy ra! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-10 h-10" />
            Cây quyết định
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <form
            onSubmit={handleUpload}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* File Input */}
              <div className="col-span-3 ">
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
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-3 py-3 rounded-lg 
                text-white font-bold transition-all transform hover:scale-105
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                }
              `}
            >
              {loading ? "Đang tải lên..." : "Tạo Cây Quyết Định"}
            </button>
          </form>

          {/* Success Message */}
          {results && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Kết Quả:</h2>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Decision Tree (Gini):
                </h3>
                <img
                  src={results.gini_tree}
                  alt="Gini Decision Tree"
                  className="w-full border border-gray-300 rounded-lg shadow-md"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Decision Tree (Entropy):
                </h3>
                <img
                  src={results.entropy_tree}
                  alt="Entropy Decision Tree"
                  className="w-full border border-gray-300 rounded-lg shadow-md"
                />
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
