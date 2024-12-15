/** @format */

import React, { useState } from "react";
import axios from "axios";
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

interface ClusteringResult {
  points: number[][];
  labels: number[];
  centroids: number[][];
}

const RawData: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [clusteringResult, setClusteringResult] =
    useState<ClusteringResult | null>(null);
  const [clusters, setClusters] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("n_clusters", clusters.toString());

    try {
      const response = await axios.post(
        "http://your-backend-url/api/kmeans-clustering/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setClusteringResult(response.data);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    }
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          K-Means Clustering Analysis
        </h1>

        <div className="flex items-center space-x-4 mb-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <select
            value={clusters}
            onChange={(e) => setClusters(Number(e.target.value))}
            className="select select-bordered w-full max-w-xs"
          >
            {[2, 3, 4, 5].map((num) => (
              <option
                key={num}
                value={num}
              >
                {num} Clusters
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={!file}
          >
            Analyze
          </button>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {clusteringResult && (
          <div className="w-full h-[500px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <ScatterChart>
                <CartesianGrid />
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
                    name={`Cluster ${clusterIndex + 1}`}
                    data={prepareChartData().filter(
                      (d) => d.cluster === clusterIndex
                    )}
                    fill={COLORS[clusterIndex % COLORS.length]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RawData;
