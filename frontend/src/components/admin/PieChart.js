import React, { useState } from 'react';

const PieChart = ({ data, title, width = 250, height = 180 }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Handle empty data
  if (total === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-bold text-secondary-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height: height }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-800">0</div>
            <div className="text-sm text-secondary-600">Tổng</div>
            <div className="mt-4 text-sm text-secondary-500">Không có dữ liệu</div>
          </div>
        </div>
      </div>
    );
  }
  
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      angle,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <h3 className="text-lg font-bold text-secondary-800 mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: width, height: height }}>
          {/* Pie Chart */}
          <svg width={width} height={height} viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="60" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
            {segments.map((segment, index) => {
              if (segment.value === 0) return null; // Skip zero values
              
              const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
              const endAngleRad = (segment.startAngle + segment.angle - 90) * (Math.PI / 180);
              
              const largeArcFlag = segment.angle > 180 ? 1 : 0;
              const isHovered = hoveredSegment === index;
              
              // Calculate offset for hover effect
              const offset = isHovered ? 3 : 0;
              const hoverX1 = 80 + (60 + offset) * Math.cos(startAngleRad);
              const hoverY1 = 80 + (60 + offset) * Math.sin(startAngleRad);
              const hoverX2 = 80 + (60 + offset) * Math.cos(endAngleRad);
              const hoverY2 = 80 + (60 + offset) * Math.sin(endAngleRad);
              
              return (
                <g key={index}>
                  <path
                    d={`M 80 80 L ${hoverX1} ${hoverY1} A ${60 + offset} ${60 + offset} 0 ${largeArcFlag} 1 ${hoverX2} ${hoverY2} Z`}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="2"
                    opacity={isHovered ? 1 : 0.9}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  {/* Add shadow effect for hovered segment */}
                  {isHovered && (
                    <path
                      d={`M 80 80 L ${hoverX1} ${hoverY1} A ${60 + offset} ${60 + offset} 0 ${largeArcFlag} 1 ${hoverX2} ${hoverY2} Z`}
                      fill="rgba(0,0,0,0.1)"
                      transform="translate(1,1)"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Center text with animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-secondary-800">{total}</div>
              <div className="text-xs text-secondary-600">Tổng</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend with hover effects */}
      <div className="mt-3 space-y-1">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              hoveredSegment === index ? 'bg-secondary-50 shadow-sm' : 'hover:bg-secondary-50'
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full mr-2 transition-all duration-200 ${
                  hoveredSegment === index ? 'scale-125' : ''
                }`}
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-xs text-secondary-700 font-medium">{segment.label}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-secondary-800">
                {segment.value}
              </span>
              <span className="text-xs text-secondary-600">
                ({segment.value > 0 ? segment.percentage.toFixed(1) : '0.0'}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart; 
