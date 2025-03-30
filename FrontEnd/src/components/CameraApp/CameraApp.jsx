import React, { useRef, useState, useEffect } from 'react';

const filters = [
  { name: 'Màu Gốc', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Invert', value: 'invert(100%)' },
  { name: 'Blur', value: 'blur(5px)' },
  { name: 'Whiten', value: 'brightness(120%) contrast(120%)' },
  { name: 'Remove Blemishes', value: 'contrast(120%) brightness(110%) blur(1px)' }
];

const CameraApp = () => {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [filter, setFilter] = useState('none');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isMirrored, setIsMirrored] = useState(false);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing the camera: ', err);
      }
    }

    initCamera();
  }, []);

  useEffect(() => {
    if (timerInterval) {
      const intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timerInterval]);

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    setRecordedBlobs([]);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
    setElapsedTime(0);
    setTimerInterval(true);
  };

  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      setRecordedBlobs((prev) => [...prev, event.data]);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setMediaRecorder(null);
    setTimerInterval(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded_video.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="camera-app">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          filter: filter,
          transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)'
        }}
      ></video>
      <div className="controls">
        <button onClick={startRecording}>Bắt đầu video</button>
        <button onClick={stopRecording}>Dừng lại</button>
        <button onClick={downloadRecording}>Tải video xuống</button>
        <button onClick={toggleMirror}>{isMirrored ? 'Lật mặt' : 'Không lật mặt'}</button>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          {filters.map((filterOption) => (
            <option key={filterOption.value} value={filterOption.value}>
              {filterOption.name}
            </option>
          ))}
        </select>
      </div>
      <div className="timer">
        <p>Thời gian đã quay: {formatTime(elapsedTime)}</p>
      </div>
    </div>
  );
};

export default CameraApp;
