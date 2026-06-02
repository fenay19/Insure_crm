
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../editor/tools/tools";

const ReactEditorJS = createReactEditorJS();

export default function EditorTextParser({ description }) {

  return <ReactEditorJS
  tools={EDITOR_JS_TOOLS}
  defaultValue={description}
  readOnly
/>;
}