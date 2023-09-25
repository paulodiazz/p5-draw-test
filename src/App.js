import React, { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);

  const handleImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div className="App">
      <h1>Image Editor with p5.js</h1>
      <Dropzone onDrop={handleImageDrop} accept="image/*">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag &amp; drop an image here, or click to select one.</p>
          </div>
        )}
      </Dropzone>
      {image && <ImageEditor image={image} />}
    </div>
  );
}

const ImageEditor = ({ image }) => {
  const imgRef = useRef(null);
  const lines = [];
  let currentLine = [];
  let currentColor = [0, 0, 0]; // Initial color: black
  let isDrawing = false;

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.getElementById('editorCanvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [image]);

  const handleTouchMove = (e) => {
    if (isDrawing) {
      const canvas = document.getElementById('editorCanvas');
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentLine[0], currentLine[1]);
      ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
      ctx.closePath();
      ctx.stroke();
      currentLine = [e.touches[0].clientX, e.touches[0].clientY];
    }
  };

  const handleTouchStart = (e) => {
    currentLine = [e.touches[0].clientX, e.touches[0].clientY];
    isDrawing = true;
  };

  const handleTouchEnd = () => {
    isDrawing = false;
  };

  const setColor = (color) => {
    currentColor = color;
  };

  return (
    <div className="image-editor">
      <div className="image-container">
        <canvas
          id="editorCanvas"
          ref={imgRef}
          style={{
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%', // Make the canvas responsive
            height: 'auto',
          }}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      <div className="drawing-tools">
        <button onClick={() => setColor([0, 0, 0])}>Black</button>
        <button onClick={() => setColor([255, 0, 0])}>Red</button>
        <button onClick={() => setColor([0, 255, 0])}>Green</button>
        <button onClick={() => setColor([0, 0, 255])}>Blue</button>
      </div>
    </div>
  );
};

export default App;
