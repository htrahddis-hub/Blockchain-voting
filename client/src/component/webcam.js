import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: "user",
};

function WebcamCapture() {
  const dataUrlToFile = async (dataUrl, fileName) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/jpg" });
  };
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
    let token = decodeURIComponent(document.cookie);
    token = { token: token.substring(6) };
    console.log(token);
    fd.append("token", token.token);
    //console.log(fd);
    axios.post("http://localhost:3001/kyc/verify", fd).then((res) => {
      console.log(res);
    });
  });

  return (
    <div>
      <div>
        {image == "" ? (
          <Webcam
            audio={false}
            height={280}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={280}
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
