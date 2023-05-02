import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: "user",
};

function WebcamCapture({ imageMatched, updateImageMatched }) {
  const dataUrlToFile = async (dataUrl, fileName) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/jpg" });
  };
  const [image, setImage] = useState("");
  const webcamRef = React.useRef(null);
  useEffect(() => {}, [imageMatched]);
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

      if (res.data.isMatch === true) {
        updateImageMatched(2);
      } else {
        updateImageMatched(1);
      }
    });
  });
  console.log(imageMatched);
  return (
    <div className="text-center">
      {imageMatched === 1 ? (
        <div class="alert alert-danger" role="alert">
          Did not match with uploaded image .Please retake image.
        </div>
      ) : null}
      <>
        <div>
          {image == "" ? (
            <Webcam
              audio={false}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={360}
              videoConstraints={videoConstraints}
            />
          ) : (
            <img src={image} />
          )}
        </div>
        <div>
          <br></br>
          {image != "" ? (
            <button
              type="button"
              class="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                setImage("");
              }}
            >
              Retake Image
            </button>
          ) : (
            <button
              type="button"
              class="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
            >
              Capture
            </button>
          )}
        </div>
      </>
    </div>
  );
}
export default WebcamCapture;
