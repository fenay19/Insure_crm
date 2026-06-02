import React, { useRef, useState, useEffect } from 'react';
import { Modal, Box, Grid, IconButton, Button } from '@mui/material';
import { Undo, Close } from '@mui/icons-material';
import { post, put } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';

const SystematicDiagram = ({
  onClose,
  imageSrc,
  patientExamination,
  handlePatientSubmit,
  activeTab,
  getExamination,
  setDiagramSaved,
  systematicData,
  localData
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoSteps, setUndoSteps] = useState({});
  const [undo, setUndo] = useState(0);
  const [color, setColor] = useState('#ff0000');
console.log(imageSrc)
  // Function to load the image onto the canvas
  const loadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    let diagramSrc = '';
  
    if (activeTab === 1) {
      // Find the matching local disorder based on `imageSrc.exam.disorder`
      const matchedLocal = patientExamination?.local?.find((d) => 
        d?.disorder === imageSrc?.exam?.disorder
      );
  
      console.log('Matched Local:', matchedLocal);
  
      diagramSrc = matchedLocal?.diagram || imageSrc?.exam?.diagram; // Use matched diagram or fallback
    } else if (activeTab === 2) {
      const matchedLocal = patientExamination?.systematic?.find((d) => 
        d?.disorder === imageSrc?.exam?.disorder
      );
  
      diagramSrc =matchedLocal?.diagram || imageSrc?.exam?.diagram;
    }
  
  
    if (!diagramSrc) return; // Ensure there's a valid image source
  
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.setAttribute('crossorigin', 'anonymous');
    image.src = diagramSrc;
  
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw image
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      contextRef.current = ctx;
    };
  
    image.onerror = () => {
      console.error('Failed to load image from', diagramSrc);
    };
  };
  
  useEffect(() => {
    if (activeTab === 1 || activeTab === 2) {
      loadImage();
    }
  }, [imageSrc, patientExamination, activeTab]);
  
 
  // Re-run when dependencies change
  console.log(patientExamination);

  // Update stroke color dynamically
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = color;
    }
  }, [color]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    const temp = { ...undoSteps, [undo + 1]: [{ x, y, color }] };
    setUndoSteps(temp);
    setUndo(undo + 1);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.stroke();
    const temp = { ...undoSteps };
    temp[undo].push({ x, y, color });
    setUndoSteps(temp);
  };

  const handleMouseUp = () => setIsDrawing(false);
  const handleTouchStart = handleMouseDown;
  const handleTouchMove = handleMouseMove;
  const handleTouchEnd = handleMouseUp;

  const undoLastOperation = () => {
    if (undo > 0) {
      setUndo(undo - 1);
      loadImage(); // Redraw the original image
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      for (let i = 1; i < undo; i++) {
        const path = undoSteps[i];
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.strokeStyle = path[0].color;
        for (let j = 1; j < path.length; j++) {
          ctx.lineTo(path[j].x, path[j].y);
          ctx.stroke();
        }
        ctx.closePath();
      }
    }
  };

  const handleSubmitImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const dataUrl = canvas.toDataURL(); // Convert canvas to image data
  
    try {
      toast.success('Updated Successfully');
  
      if (activeTab === 1) {
        // Find and update the specific disorder based on `imageSrc.exam.disorder`
        const updatedLocal = patientExamination?.local?.map((d) => 
          d?.disorder === imageSrc?.exam?.disorder ? { ...d, diagram: dataUrl } : d
        );
  
        handlePatientSubmit({
          ...patientExamination,
          local: updatedLocal, // Preserve full `local` array with updated diagram
        });
      } else {
        const updatedLocal = patientExamination?.systematic?.map((d) => 
          d?.disorder === imageSrc?.exam?.disorder ? { ...d, diagram: dataUrl } : d
        );
  
        handlePatientSubmit({
          ...patientExamination,
          systematic: updatedLocal, // Preserve full `local` array with updated diagram
        });
        // handlePatientSubmit({
        //   ...patientExamination,
        //   systematic: {
        //     ...patientExamination?.systematic,
        //     diagram: dataUrl, // Only update `diagram`
        //   },
        // });
      }
  
      onClose();
      setDiagramSaved(true);
      getExamination();
  
    } catch (error) {
      console.error('Error submitting image:', error);
    }
  };
  
  

  const c = { ...patientExamination?.local };
  console.log(c);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          width: '100%',
          height: '100%'
        }}
      >
        <Box
          sx={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '90vw',
            overflow: 'auto',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Header (Undo & Close Buttons) */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ width: '100%', mb: 2 }}>
            <Grid item>
              <IconButton title="Undo" onClick={undoLastOperation} disabled={undo === 0}>
                <Undo />
              </IconButton>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: 10 }} />
            </Grid>
            <Grid item>
              <IconButton title="Close" onClick={onClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          {/* Canvas Area */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              overflowX: 'auto'
            }}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={420}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                cursor: 'crosshair',
                maxWidth: '100%',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </Box>

          {/* Save Button - Placed Below */}
          <Button onClick={handleSubmitImage} variant="contained" color="primary" sx={{ mt: 3, width: '100%' }}>
            Save
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default SystematicDiagram;
