import React, { useEffect, useRef } from 'react';

const CustomerGrowthChart = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Mock data - trong thực tế sẽ lấy từ API
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const newCustomers = [45, 60, 75, 85, 95, 110, 120, 140, 125, 150, 165, 180];
    const totalCustomers = [450, 510, 585, 670, 765, 875, 995, 1135, 1260, 1410, 1575, 1755];
    
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
    const maxValue = Math.max(...totalCustomers) * 1.1; // Add 10% padding
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
      const value = Math.round((maxValue / numGridLines) * i);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#f0f0f0';
      ctx.stroke();
      
      ctx.fillText(value.toLocaleString(), padding - 10, y + 5);
    }
    
    // Draw months
    ctx.textAlign = 'center';
    const pointWidth = chartWidth / (months.length - 1);
    
    months.forEach((month, i) => {
      const x = padding + pointWidth * i;
      ctx.fillText(month, x, height - padding + 20);
    });
    
    // Draw total customers line (area under line)
    ctx.beginPath();
    // Start from bottom left of chart
    ctx.moveTo(padding, height - padding);
    
    totalCustomers.forEach((value, i) => {
      const x = padding + pointWidth * i;
      const y = height - padding - (value * scale);
      ctx.lineTo(x, y);
    });
    
    // Connect to bottom right of chart to create enclosed area
    ctx.lineTo(padding + pointWidth * (months.length - 1), height - padding);
    ctx.closePath();
    
    // Fill area with gradient
    const totalGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    totalGradient.addColorStop(0, 'rgba(106, 137, 204, 0.4)');
    totalGradient.addColorStop(1, 'rgba(106, 137, 204, 0.1)');
    ctx.fillStyle = totalGradient;
    ctx.fill();
    
    // Draw total customers line
    ctx.beginPath();
    totalCustomers.forEach((value, i) => {
      const x = padding + pointWidth * i;
      const y = height - padding - (value * scale);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw data point
      ctx.fillStyle = '#4a69bd';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.strokeStyle = '#4a69bd';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw new customers line
    ctx.beginPath();
    newCustomers.forEach((value, i) => {
      const x = padding + pointWidth * i;
      const y = height - padding - (value * scale);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw data point
      ctx.fillStyle = '#e15f41';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.strokeStyle = '#e15f41';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add legend
    const legendX = width - padding - 150;
    const legendY = padding + 20;
    
    // Total customers legend
    ctx.fillStyle = '#4a69bd';
    ctx.fillRect(legendX, legendY, 15, 15);
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('Tổng khách hàng', legendX + 25, legendY + 12);
    
    // New customers legend
    ctx.fillStyle = '#e15f41';
    ctx.fillRect(legendX, legendY + 25, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Khách hàng mới', legendX + 25, legendY + 37);
    
  }, []);

  return (
    <div className="customer-growth-chart-container">
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={400} 
        className="customer-growth-chart"
      ></canvas>
      
      <style jsx>{`
        .customer-growth-chart-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .customer-growth-chart {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default CustomerGrowthChart; 