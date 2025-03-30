import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'webcam-easy';

const Camera = () => {
  const webcamElement = useRef(null);
  const canvasElement = useRef(null);
  const [webcam, setWebcam] = useState(null);
  const [filter, setFilter] = useState('');

  // Filters list
  const filters = [
    { name: 'Màu gốc', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Invert', value: 'invert(100%)' },
    { name: 'Blur', value: 'blur(5px)' },
    { name: 'Brighten', value: 'brightness(130%) contrast(100%)' }  // Adjust brightness and contrast for a whitening effect
];

  useEffect(() => {
    const cam = new Webcam(webcamElement.current, 'user', canvasElement.current);
    setWebcam(cam);
    cam.start()
      .then(result => console.log("Webcam started"))
      .catch(err => console.error(err));
    
    return () => cam.stop();
  }, []);

  const captureImage = () => {
    canvasElement.current.style.filter = filter; // Apply the filter to the canvas
    const imageSrc = webcam.snap();
    downloadImage(imageSrc, 'captured-image.png');
  };

  const downloadImage = (dataUri, filename) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = dataUri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  }}>
      <video ref={webcamElement} autoPlay playsInline width="640" height="480" style={{ filter: filter }}></video>
      <canvas ref={canvasElement} style={{ display: 'none' }}></canvas>
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        {filters.map((f, index) => (
          <option key={index} value={f.value}>{f.name}</option>
        ))}
      </select>
      <button onClick={captureImage}>Chụp và lưu</button>
      
    </div>
  );
};

export default Camera;
