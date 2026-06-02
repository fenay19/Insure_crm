import React, { useRef, useCallback, useEffect } from "react";

import { EDITOR_JS_TOOLS } from "./tools/tools";

// create editor instance
import { createReactEditorJS } from "react-editor-js";

export default function Editor({ description, setDescription }) {
  const editorCore = useRef(null);
  const ReactEditorJS = createReactEditorJS();

  const handleInitialize = useCallback((instance) => {
    console.log("ss");
    instance._editorJS.isReady
      .then(() => {
        editorCore.current = instance;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSave = useCallback(async () => {
    if (editorCore.current !== null) {
      let saveddescription = await editorCore.current.save();
      setDescription(saveddescription);
    }
  }, [setDescription]);
  useEffect(() => {
    const interval = setInterval(handleSave, 1000); // Save content every second

    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, [handleSave]);

  return (
    <div className="editor-container">
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        onChange={handleSave}
        // value={description}
        defaultValue={description}
        autofocus
      />
    </div>
  );
}
