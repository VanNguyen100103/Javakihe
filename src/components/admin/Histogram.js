import React, { useState } from 'react';

const Histogram = ({ data, title, width = 400, height = 250 }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-bold text-secondary-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height: height }}>
          <div className="text-center">
            <div className="text-sm text-secondary-500">Không có dữ liệu</div>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = (width - 100) / data.length;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <h3 className="text-lg font-bold text-secondary-800 mb-4">{title}</h3>
      <div className="flex items-end justify-center" style={{ height: height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => {
            const y = height - 40 - ((height - 60) * percent / 100);
            return (
              <g key={index}>
                <line 
                  x1="50" 
                  y1={y} 
                  x2={width - 20} 
                  y2={y} 
                  stroke="#F3F4F6" 
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </g>
            );
          })}
          
          {/* Y-axis */}
          <line x1="50" y1="20" x2="50" y2={height - 40} stroke="#E5E7EB" strokeWidth="2"/>
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((percent, index) => {
            const y = height - 40 - ((height - 60) * percent / 100);
            return (
              <g key={index}>
                <line x1="45" y1={y} x2="50" y2={y} stroke="#E5E7EB" strokeWidth="1"/>
                <text x="40" y={y + 4} textAnchor="end" className="text-xs fill-secondary-500 font-medium">
                  {Math.round((maxValue * percent) / 100)}
                </text>
              </g>
            );
          })}
          
          {/* Bars with hover effects */}
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? ((item.value / maxValue) * (height - 60)) : 0;
            const x = 60 + (index * barWidth);
            const y = height - 40 - barHeight;
            const isHovered = hoveredBar === index;
            
            return (
              <g key={index}>
                {/* Bar shadow for hover effect */}
                {isHovered && (
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={barWidth - 4}
                    height={barHeight}
                    fill="rgba(0,0,0,0.1)"
                    rx="4"
                  />
                )}
                
                {/* Main bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth - 4}
                  height={barHeight}
                  fill={isHovered ? "#1D4ED8" : "#3B82F6"}
                  rx="4"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                
                {/* Bar label */}
                <text
                  x={x + (barWidth - 4) / 2}
                  y={height - 20}
                  textAnchor="middle"
                  className={`text-xs font-medium transition-all duration-300 ${
                    isHovered ? 'fill-blue-700' : 'fill-secondary-600'
                  }`}
                >
                  {item.label}
                </text>
                
                {/* Value label with animation */}
                <text
                  x={x + (barWidth - 4) / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className={`text-xs font-bold transition-all duration-300 ${
                    isHovered ? 'fill-blue-700' : 'fill-secondary-700'
                  }`}
                >
                  {item.value}
                </text>
                
                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 20}
                      y={y - 40}
                      width="60"
                      height="25"
                      fill="#1F2937"
                      rx="4"
                    />
                    <text
                      x={x + (barWidth - 4) / 2}
                      y={y - 25}
                      textAnchor="middle"
                      className="text-xs fill-white font-medium"
                    >
                      {item.value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 flex justify-between items-center text-sm text-secondary-600">
        <span>Tổng: {data.reduce((sum, item) => sum + item.value, 0)}</span>
        <span>Trung bình: {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}</span>
      </div>
    </div>
  );
};

export default Histogram; 