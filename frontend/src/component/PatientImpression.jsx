import { Button, IconButton, Modal } from "@mui/material";
import React from "react";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import { useEffect, useRef } from "react";

const PatientImpression = ({
  open,
  setOpen,
  setImageSrc,
  imageSrc,
  setPatientImpression,
  patientImpression,
}) => {
  let canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoSteps, setUndoSteps] = useState({});
  const [redoStep, setRedoStep] = useState({});
  let contextRef = useRef(null);
  const [undo, setUndo] = useState(0);
  const [redo, setRedo] = useState(0);
  const [color, setColor] = useState("#000000");
  const sigCanvasRef = useRef(null);

  useEffect(() => {
    if (open && canvasRef.current) {
      // Load image onto canvas when modal opens
      const canvas = canvasRef.current;
      const rect = canvas.getContext("2d");

      const image = new Image();
      image.setAttribute("crossorigin", "anonymous");

      image.onload = () => {
        rect.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      rect.strokeStyle = color;
      rect.lineWidth = 3;
      contextRef.current = rect;
    }
    // eslint-disable-next-line
  }, [open, imageSrc, canvasRef.current]);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getContext("2d");
      rect.strokeStyle = color;
    }
    // eslint-disable-next-line
  }, [color]);

  // const handleMouseDown = (e) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const rect = canvas.getBoundingClientRect();

  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   setIsDrawing(true);
  //   const temp = {
  //     ...undoSteps,
  //     [undo + 1]: [],
  //   };
  //   temp[undo + 1].push({ x, y, color: color });
  //   setUndoSteps(temp);
  //   setUndo(undo + 1);
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  // };

  // const handleMouseMove = (e) => {
  //   if (!isDrawing) return;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   ctx.lineTo(x, y);
  //   rect.strokeStyle = color;
  //   ctx.stroke();
  //   const temp = {
  //     ...undoSteps,
  //   };
  //   temp[undo].push({ x, y, color: color });
  //   setUndoSteps(temp);
  // };

  // const handleMouseUp = () => {
  //   setIsDrawing(false);
  // };

  // const handleTouchStart = (e) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const rect = canvas.getBoundingClientRect();

  //   const x = e.touches[0].clientX - rect.left;
  //   const y = e.touches[0].clientY - rect.top;

  //   setIsDrawing(true);
  //   const temp = {
  //     ...undoSteps,
  //     [undo + 1]: [],
  //   };
  //   temp[undo + 1].push({ x, y, color: color });
  //   setUndoSteps(temp);
  //   setUndo(undo + 1);
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  // };

  // const handleTouchMove = (e) => {
  //   if (!isDrawing) return;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.touches[0].clientX - rect.left;
  //   const y = e.touches[0].clientY - rect.top;

  //   ctx.lineTo(x, y);
  //   ctx.strokeStyle = color;
  //   ctx.stroke();
  //   const temp = {
  //     ...undoSteps,
  //   };
  //   temp[undo].push({ x, y, color: color });
  //   setUndoSteps(temp);
  // };

  // const handleTouchEnd = () => {
  //   setIsDrawing(false);
  // };

  // const undoLastOperation = () => {
  //   if (undo > 0) {
  //     const data = undoSteps[undo];
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");

  //     // Clear the canvas
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // Redraw the image
  //     const image = new Image();
  //     image.setAttribute("crossorigin", "anonymous");
  //     image.onload = () => {
  //       ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       // Redraw the remaining paths
  //       for (let i = 1; i < undo; i++) {
  //         const path = undoSteps[i];
  //         ctx.beginPath();
  //         ctx.moveTo(path[0].x, path[0].y);
  //         ctx.strokeStyle = path[0].color; // Set color for the path
  //         setColor(path[0].color);
  //         for (let j = 1; j < path.length; j++) {
  //           ctx.lineTo(path[j].x, path[j].y);
  //           // ctx.strokeStyle = color;
  //           ctx.stroke();
  //         }
  //         ctx.closePath();
  //       }
  //     };
  //     image.src = imageSrc;

  //     const temp = {
  //       ...undoSteps,
  //       [undo]: [],
  //     };
  //     const te = {
  //       ...redoStep,
  //       [redo + 1]: [...data],
  //     };
  //     setUndo(undo - 1);
  //     setRedo(redo + 1);
  //     setRedoStep(te);
  //     setUndoSteps(temp);
  //   }
  // };

  // const redoLastOperation = () => {
  //   if (redo > 0) {
  //     const data = redoStep[redo];
  //     contextRef.current.strokeStyle = color;
  //     contextRef.current.beginPath();
  //     contextRef.current.lineWidth = 5;
  //     contextRef.current.moveTo(data[0].x, data[0].y);
  //     data.forEach((item, index) => {
  //       if (index !== 0) {
  //         contextRef.current.strokeStyle = item.color; // Set color for the path
  //         setColor(item.color);
  //         contextRef.current.lineTo(item.x, item.y);
  //         contextRef.current.stroke();
  //       }
  //     });
  //     contextRef.current.closePath();
  //     const temp = {
  //       ...redoStep,
  //       [redo]: [],
  //     };
  //     setUndo(undo + 1);
  //     setRedo(redo - 1);
  //     setRedoStep(temp);
  //     setUndoSteps({
  //       ...undoSteps,
  //       [undo + 1]: [...data],
  //     });
  //   }
  // };

  const handleSubmitImage = () => {
    // Capture the drawn content as a data URI
    const signatureData = sigCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    setPatientImpression(signatureData);

    onCloseImageModal();
  };

  const onCloseImageModal = () => {
    setOpen(false);
    document.getElementById("bodyId");  //.style = "zoom:0.7"
    setImageSrc(``); // Replace 'your-image.jpg' with your image source
    canvasRef = null;
    setIsDrawing(false);
    setUndoSteps({});
    setRedoStep({});
    contextRef = null;
    setUndo(0);
    setRedo(0);
    setColor("#ff0000");
  };

  return (
    <Modal
      open={open}
      style={{
        background: "rgba(0,0,0,0.6)",
        position: "fixed",
        zIndex: "100000000",
      }}
    >
      <div className="modal">
        <div className="btnAndQue">
          {/* <div className="btnAndQue" style={{ justifyContent: "flex-start" }}>
            <IconButton
              title="Undo"
              onClick={undoLastOperation}
              className="btnPopup btnCancel"
              disabled={undo === 0 ? true : false}
            >
              <Undo className="btnUndoRedo" />
            </IconButton>
            <IconButton
              title="Redo"
              onClick={redoLastOperation}
              className="btnPopup btnCancel"
              disabled={redo === 0 ? true : false}
            >
              <Redo className="btnUndoRedo" />
            </IconButton>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
              }}
            />
          </div> */}

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              title="Cancel"
              onClick={onCloseImageModal}
              className="btnPopup btnCancel"
            
            >
              <Close />
            </IconButton>
          </div>
        </div>
        {/* <canvas
          id="canvas"
          ref={canvasRef}
          width={600} // Set the width of the canvas
          height={320} // Set the height of the canvas
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: "crosshair",
            pointerEvents: "auto", // Allow drawing only when drawMode is enabled
          }}
        /> */}
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            width: "600px",
            height: "300px",
            className: "sigCanvas",
          }}
          ref={sigCanvasRef}
        />

        <Button
          onClick={() => {
            sigCanvasRef.current.clear();
            setPatientImpression("");
          }}
          className="addBtn"
          style={{ marginTop: "10px", marginRight: "10px" }}
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmitImage}
          className="addBtn"
          style={{ marginTop: "10px" }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default PatientImpression;
