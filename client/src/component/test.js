/*import React, { useRef } from "react";
import { CompreFace } from "@exadel/compreface-js-sdk";
// import FileReader from "./FileReader";

export default function Fdetect() {
  const videoTag = useRef(null);
  let canvasElement1 = useRef(null);
  let canvas2 = document.getElementById("canvas2");
  const handleVideoStart = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (videoTag.current.srcObject = res))
      .catch((error) => console.error(error));
    videoTag.current.addEventListener("play", () => {
      let server = `http://localhost`;
      let port = 8000;
    
      let core = new CompreFace(server, port);
      let detection_service = core.initFaceDetectionService(key);
      document.addEventListener("next-frame", () => {
        canvasElement1.current.toBlob(
          (blob) => {
            detection_service
              .detect(blob)
              .then((res) => console.log(res))
              .catch((error) => console.error(error));
          },
          "image/jpeg",
          0.95
        );
      });

      const customEvent = new Event("next_frame", {
        bubbles: true,
        cancelable: false,
      });
      document.dispatchEvent(customEvent);
    });
  };

  return (
    <div>
      <header>
        <video ref={videoTag} width="640" height="480" autoPlay muted></video>
        <canvas
          ref={canvasElement1}
          width="640"
          height="480"
          style={{ display: "none" }}
        ></canvas>
        <canvas
          width="640"
          height="480"
          style={{ display: "absolute" }}
        ></canvas>
        <button onClick={handleVideoStart}>Click me</button>
      </header>
    </div>
  );
}
*/
