import React, { useEffect, useRef } from 'react';

const SalesChart = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Mock data - trong thực tế sẽ lấy từ API
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const salesData = [12000000, 15000000, 10000000, 18000000, 14000000, 16000000, 19000000, 22000000, 20000000, 25000000, 23000000, 28000000];
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...salesData);
    const scale = chartHeight / maxValue;
    
    // Draw axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
    
    // Draw horizontal grid lines
    const numGridLines = 5;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= numGridLines; i++) {
      const y = padding + (chartHeight / numGridLines) * (numGridLines - i);
      const value = (maxValue / numGridLines) * i;
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#f0f0f0';
      ctx.stroke();
      
      // Format currency value
      const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value);
      
      ctx.fillText(formattedValue, padding - 10, y + 5);
    }
    
    // Draw months
    ctx.textAlign = 'center';
    const barWidth = chartWidth / months.length * 0.6;
    const barSpacing = chartWidth / months.length * 0.4;
    const barOffset = (chartWidth / months.length - barWidth) / 2;
    
    months.forEach((month, i) => {
      const x = padding + (chartWidth / months.length) * i + barOffset + barWidth / 2;
      ctx.fillText(month, x, height - padding + 20);
    });
    
    // Draw bars with gradient
    salesData.forEach((value, i) => {
      const barHeight = value * scale;
      const x = padding + (chartWidth / months.length) * i + barOffset;
      const y = height - padding - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#4a69bd');
      gradient.addColorStop(1, '#60a3bc');
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Add value on top of bar
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      const shortValue = (value / 1000000).toFixed(1) + 'M';
      ctx.fillText(shortValue, x + barWidth / 2, y - 10);
    });
    
  }, []);

  return (
    <div className="sales-chart-container">
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={400} 
        className="sales-chart"
      ></canvas>
      
      <style jsx>{`
        .sales-chart-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .sales-chart {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default SalesChart; 