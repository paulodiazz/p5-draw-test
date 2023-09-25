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
  let currentLine = [];
  let currentColor = [0, 0, 0]; // Initial color: black
  let isDrawing = false;

  const sketch = (p) => {
    let img;

    p.setup = () => {
      p.noFill();
      p.stroke(currentColor);
      p.strokeWeight(2);
      p.createCanvas(p.windowWidth, p.windowHeight); // Create a full-screen canvas
      p.touchMoved = () => {
        if (!isDrawing) {
          currentLine = [p.touchX, p.touchY];
          isDrawing = true;
        }
        // To prevent default touch behavior
        return false;
      };
    };

    p.preload = () => {
      img = p.loadImage(image, () => {
        p.background(255);
        p.image(img, 0, 0, p.width, p.height); // Display the image at the full canvas size
      });
    };

    p.draw = () => {
      for (const line of lines) {
        p.line(line[0], line[1], line[2], line[3]);
      }

      if (isDrawing && currentLine.length === 2) {
        p.line(
          currentLine[0],
          currentLine[1],
          p.mouseX,
          p.mouseY
        );
      }
    };

    p.mousePressed = () => {
      if (!isDrawing) {
        currentLine = [p.mouseX, p.mouseY];
        isDrawing = true;
      }
    };

    p.mouseReleased = () => {
      if (isDrawing && currentLine.length === 2) {
        currentLine.push(p.mouseX, p.mouseY);
        lines.push([...currentLine]);
        currentLine = [];
        isDrawing = false;
      }
    };
  };

  const setColor = (color) => {
    currentColor = color;
  };

  return (
    <div className="image-editor">
      <div
        className="image-container"
        style={{
          textAlign: 'center',
        }}
      >
        <img
          ref={imgRef}
          src={image}
          alt="Uploaded"
          style={{
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%', // Make the image responsive
            height: 'auto',
          }}
        />
      </div>
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
