/** @format */

import React, { useState } from "react";
import axios from "axios";
import { CloudRain, CheckCircle, AlertTriangle } from "lucide-react";

export default function PlayBallPredictor() {
  const [inputData, setInputData] = useState({
    Outlook: "",
    Temperature: "",
    Humidity: "",
    Wind: "",
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields are selected
    const isAllFieldsFilled = Object.values(inputData).every(
      (value) => value !== ""
    );

    if (!isAllFieldsFilled) {
      setError("Vui lòng chọn giá trị cho tất cả các trường.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_SERVER}/api/naive-bayes/`,
        inputData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra khi dự đoán!");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = (
    name: keyof typeof inputData,
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={inputData[name]}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   transition-all duration-300"
      >
        <option value="">Chọn</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <CloudRain className="w-10 h-10" />
            Dự Đoán Chơi Bóng
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {renderSelect("Outlook", "Tình Trạng Bầu Trời", [
              { value: "Rainy", label: "Mưa" },
              { value: "Sunny", label: "Nắng" },
              { value: "Overcast", label: "U Ám" },
            ])}
            {renderSelect("Temperature", "Nhiệt Độ", [
              { value: "Hot", label: "Nóng" },
              { value: "Mild", label: "Ôn Hòa" },
              { value: "Cool", label: "Mát Mẻ" },
            ])}
            {renderSelect("Humidity", "Độ Ẩm", [
              { value: "High", label: "Cao" },
              { value: "Normal", label: "Bình Thường" },
            ])}
            {renderSelect("Wind", "Tốc Độ Gió", [
              { value: "Weak", label: "Yếu" },
              { value: "Strong", label: "Mạnh" },
            ])}

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
              {isLoading ? "Đang dự đoán..." : "Dự Đoán"}
            </button>
          </form>

          {/* Kết Quả */}
          {prediction && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="font-bold text-green-900">Kết Quả:</h2>
                <p>
                  Dự đoán:{" "}
                  <strong className="text-green-900">
                    {prediction !== "No"
                      ? "Nên chơi bóng"
                      : "Không nên chơi bóng"}
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Thông báo lỗi */}
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
