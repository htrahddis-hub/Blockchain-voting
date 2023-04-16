import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};
export async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/jpg" });
}
function WebcamCapture() {
  const [image, setImage] = useState("");
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    //console.log(imageSrc);
    const x = await dataUrlToFile(imageSrc, "webcam.jpg");
    var fd = new FormData();
    console.log(x);
    fd.append("file", x);
    //console.log(fd);
    axios.post("http://localhost:3001/upload", fd).then((res) => {
      console.log(res);
    });
  });

  return (
    <div>
      <div>
        {image == "" ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div>
        {image != "" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setImage("");
            }}
          >
            Retake Image
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
          >
            Capture
          </button>
        )}
      </div>
    </div>
  );
}
export default WebcamCapture;
