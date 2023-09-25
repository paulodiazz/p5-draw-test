import React, { useState, useRef } from 'react';
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
  let startPoint = null;
  let endPoint = null;
  let currentColor = [0, 0, 0]; // Initial color: black
  let isDrawing = false;

  const sketch = (p) => {
    let img;

    p.preload = () => {
      img = p.loadImage(image, () => {
        p.createCanvas(img.width, img.height);
        p.background(255);
        p.image(img, 0, 0);
      });
    };

    p.setup = () => {
      p.noFill();
      p.stroke(currentColor);
      p.strokeWeight(2);
      p.createCanvas(img.width, img.height); // Set canvas size to match image
      p.background(255);
      p.image(img, 0, 0);
    };

    p.draw = () => {
      for (const line of lines) {
        p.line(line[0], line[1], line[2], line[3]);
      }

      if (isDrawing) {
        p.line(startPoint[0], startPoint[1], p.mouseX, p.mouseY);
      }
    };

    p.mousePressed = () => {
      if (!startPoint) {
        startPoint = [p.mouseX, p.mouseY];
        isDrawing = true;
      } else if (!endPoint) {
        endPoint = [p.mouseX, p.mouseY];
        lines.push([...startPoint, ...endPoint]);
        startPoint = null;
        endPoint = null;
        isDrawing = false;
      }
    };

    p.mouseReleased = () => {
      if (isDrawing) {
        endPoint = [p.mouseX, p.mouseY];
        lines.push([...startPoint, ...endPoint]);
        startPoint = null;
        endPoint = null;
        isDrawing = false;
      }
    };
  };

  const setColor = (color) => {
    currentColor = color;
  };

  return (
    <div className="image-editor">
      <img
        ref={imgRef}
        src={image}
        alt="Uploaded"
        style={{ display: 'none' }}
      />
      <div className="drawing-tools">
        <button onClick={() => setColor([0, 0, 0])}>Black</button>
        <button onClick={() => setColor([255, 0, 0])}>Red</button>
        <button onClick={() => setColor([0, 255, 0])}>Green</button>
        <button onClick={() => setColor([0, 0, 255])}>Blue</button>
      </div>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};

export default App;
