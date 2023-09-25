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
  let currentColor = [0, 0, 0]; // Initial color: black

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
      p.background(255); // Clear the canvas in each frame
      p.image(img, 0, 0); // Redraw the image in each frame

      for (const line of lines) {
        p.line(line[0], line[1], line[2], line[3]);
      }

      if (startPoint) {
        p.line(startPoint[0], startPoint[1], p.mouseX, p.mouseY);
      }
    };


    p.touchStarted = () => {
      if (!startPoint) {
        startPoint = [p.mouseX, p.mouseY];
      } else {
        lines.push([...startPoint, p.mouseX, p.mouseY]);
        startPoint = null;
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
