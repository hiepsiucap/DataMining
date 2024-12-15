/** @format */

import React, { useState, useRef } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Upload, FileSpreadsheet, Layers } from "lucide-react";

interface ClusteringResult {
  points: number[][];
  labels: number[];
  centroids: number[][];
}

const KMeansClusteringApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [clusteringResult, setClusteringResult] =
    useState<ClusteringResult | null>(null);
  const [clusters, setClusters] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn một tệp tin");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("n_clusters", clusters.toString());

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/kmeans-clustering/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra");
      }

      const data = await response.json();
      setClusteringResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Xảy ra lỗi không xác định"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const prepareChartData = () => {
    if (!clusteringResult) return [];

    return clusteringResult.points.map((point, index) => ({
      x: point[0],
      y: point[1],
      cluster: clusteringResult.labels[index],
    }));
  };

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
  const CLUSTER_OPTIONS = [
    { value: 2, label: "2 Nhóm", color: "bg-pink-500" },
    { value: 3, label: "3 Nhóm", color: "bg-blue-500" },
    { value: 4, label: "4 Nhóm", color: "bg-green-500" },
    { value: 5, label: "5 Nhóm", color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <Layers className="w-10 h-10 " />
            Phân Tích Phân Cụm K-Means
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* File Input */}
            <div className="col-span-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleFileInputClick}
                className="cursor-pointer border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-all 
                           rounded-lg p-4 flex items-center gap-4 
                           hover:bg-indigo-50 group"
              >
                <FileSpreadsheet className="w-12 h-12 text-indigo-500 group-hover:text-indigo-700" />
                <div>
                  <p className="font-semibold text-gray-700">
                    {file ? file.name : "Chọn tệp Excel"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file ? "Tệp đã chọn" : "Nhấn để tải lên tệp .xlsx"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cluster Selector */}
            <div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Số Nhóm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CLUSTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setClusters(option.value)}
                      className={`
                        flex items-center justify-center gap-2 py-2 px-3 rounded-lg 
                        transition-all transform hover:scale-105
                        ${
                          clusters === option.value
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

          {/* Action Button */}
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
              {isLoading ? "Đang Phân Tích..." : "Bắt Đầu Phân Tích"}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}
        </div>
        {clusteringResult && (
          <div className="p-6 bg-gray-50">
            <div className="w-full h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <ScatterChart>
                  <CartesianGrid stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="X"
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Y"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  {[0, 1, 2, 3, 4].map((clusterIndex) => (
                    <Scatter
                      key={clusterIndex}
                      name={`Nhóm ${clusterIndex + 1}`}
                      data={prepareChartData().filter(
                        (d) => d.cluster === clusterIndex
                      )}
                      fill={COLORS[clusterIndex % COLORS.length]}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KMeansClusteringApp;
