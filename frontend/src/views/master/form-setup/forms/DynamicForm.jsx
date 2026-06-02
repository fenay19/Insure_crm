import React, { useRef, useState } from "react";
import { TextField, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DynamicForm = ({ title, state, setState, handleSubmitForm }) => {
  const addFieldRef = useRef();
  const addSubFieldRefs = {};
  const [visiblePaths, setVisiblePaths] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");

  const MAX_DEPTH = 5;

  const addChild = (path, name) => {
    const updatedState = [...state];
    let target = updatedState;
    path.forEach((index) => {
      target = target[index].children;
    });
    target.push({ name, children: [] });
    setState(updatedState);
  };

  const deleteItem = (path) => {
    const updatedState = [...state];
    let target = updatedState;
    const lastIndex = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    
    parentPath.forEach((index) => {
      target = target[index].children;
    });
    target.splice(lastIndex, 1);
    setState(updatedState);

    setVisiblePaths(visiblePaths.filter((vp) => !vp.join("-").startsWith(path.join("-"))));
    setModalOpen(false);
  };

  const editItem = (path) => {
    const updatedState = [...state];
    let target = updatedState;
    const lastIndex = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    
    parentPath.forEach((index) => {
      target = target[index].children;
    });
    target[lastIndex].name = editValue;
    setState(updatedState);
    
    setModalOpen(false);
    setEditMode(false);
    setEditValue("");
  };

  const handleChipDelete = (path) => {
    setSelectedPath(path);
    setModalOpen(true);
  };

  const toggleVisibility = (path) => {
    const pathKey = path.join("-");
    const isVisible = visiblePaths.some((vp) => vp.join("-") === pathKey);

    if (isVisible) {
      setVisiblePaths(visiblePaths.filter((vp) => !vp.join("-").startsWith(pathKey)));
    } else {
      setVisiblePaths([...visiblePaths, path]);
    }
  };

  const getItemName = (path) => {
    let target = state;
    path.forEach((index) => {
      target = target[index];
    });
    return target.name;
  };
  

  const renderFields = (fields, path = []) => {
    return fields.map((field, index) => {
      const fieldPath = [...path, index];
      const refKey = fieldPath.join("-");
      if (!addSubFieldRefs[refKey]) addSubFieldRefs[refKey] = React.createRef();

      return (
        <div
          key={`${field.name}-${index}`}
          style={{
            marginTop: "1rem",
            padding: `${path.length * 10}px`,
            border: path.length > 0 ? "2px solid #eee" : "none",
            borderRadius: "5px"
          }}
        >
          <Chip
            label={field.name}
            onClick={() => toggleVisibility(fieldPath)}
            onDelete={() => handleChipDelete(fieldPath)}
            color="primary"
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          />
          {visiblePaths.some((vp) => vp.join("-") === fieldPath.join("-")) &&
            path.length < MAX_DEPTH - 1 && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <TextField
                  label={`Add Sub Field`}
                  variant="outlined"
                  size="small"
                  inputRef={addSubFieldRefs[refKey]}
                />
                <Button
                  onClick={() => {
                    const refValue = addSubFieldRefs[refKey].current.value;
                    if (refValue.trim()) {
                      addChild(fieldPath, refValue);
                      addSubFieldRefs[refKey].current.value = "";
                    }
                  }}
                  variant="contained"
                  className="button-87"
                >
                  Add
                </Button>
              </div>
            )}
          <div style={{ display: "flex" }}>{field.children.length > 0 && renderFields(field.children, fieldPath)}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <h3>{title}</h3>
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <TextField label="Add Field" variant="outlined" size="small" inputRef={addFieldRef} />
        <Button
          onClick={() => {
            const refValue = addFieldRef.current.value;
            if (refValue.trim()) {
              addChild([], refValue);
              addFieldRef.current.value = "";
            }
          }}
          variant="contained"
          className="button-87"
        >
          Add
        </Button>
      </div>
      <div style={{ marginTop: "1rem" }}>{renderFields(state)}</div>

      <Button className="button-87" onClick={handleSubmitForm} style={{ marginTop: "1rem" }}>
        Submit
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>
          {editMode ? "Edit Field" : "Choose Action"}
        </DialogTitle>
        <DialogContent>
          {editMode ? (
            <TextField
              autoFocus
              margin="dense"
              label="Field Name"
              fullWidth
              variant="outlined"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            <div>What would you like to do with this field?</div>
          )}
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => editItem(selectedPath)} 
                variant="contained" 
                disabled={!editValue.trim()}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setEditMode(true);
                  setEditValue(getItemName(selectedPath));
                }}
                color="primary"
              >
                Edit
              </Button>
              <Button 
                onClick={() => deleteItem(selectedPath)} 
                color="error"
              >
                Delete
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DynamicForm;