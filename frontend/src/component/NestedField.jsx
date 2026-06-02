import React from "react";
import { Box, TextField, Paper, Grid, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const NestedField = ({
  field,
  level = 0,
  onFieldChange,
  onAddChild,
  onRemoveField,
}) => {
  const handleNameChange = (e) => {
    onFieldChange(field.id, { ...field, name: e.target.value });
  };

  const handleTypeChange = (e) => {
    onFieldChange(field.id, { ...field, type: e.target.value });
  };

  const handleAddChild = () => {
    const newChild = {
      id: Date.now(),
      name: "",
      type: "text",
      children: [],
    };
    onAddChild(field.id, newChild);
  };

  const handleRemoveField = () => {
    onRemoveField(field.id);
  };

  return (
    <Paper
      elevation={Math.max(1, 3 - level)}
      sx={{
        p: 2,
        mb: 2,
        ml: level * 3,
        borderLeft: level > 0 ? "2px solid #e0e0e0" : "none",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            fullWidth
            size="small"
            label="Field Name"
            value={field.name}
            onChange={handleNameChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
                <InputLabel>Field Type</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 } 
                    }
                  }}
                  label="Department"
                  name="department"
                  value={field.type}
                  onChange={handleTypeChange}
                >
                    <MenuItem key="single" value="single">
                    Single
                    </MenuItem>
                      <MenuItem key="multiple" value="multiple">
                        Multiple
                      </MenuItem>
                </Select>
              </FormControl>
        </Grid>
        <Grid item xs={4} style={{ display: "flex", gap: "10px" }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleAddChild}
            disabled={field.type !== "multiple"}
          >
            Add Child
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleRemoveField}
          >
            Remove
          </Button>
        </Grid>
      </Grid>

      {field.children.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {field.children.map((child) => (
            <NestedField
              key={child.id}
              field={child}
              level={level + 1}
              onFieldChange={onFieldChange}
              onAddChild={onAddChild}
              onRemoveField={onRemoveField}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default NestedField;
