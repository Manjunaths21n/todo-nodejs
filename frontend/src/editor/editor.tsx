import { Editor } from "@monaco-editor/react"
import React, { memo } from "react"

export const EditorRenderer = memo(() => {
    return (
        <div className="editor-container">
            <Editor language="javascript" height={'300px'} width={'100%'} theme="vs-dark" />
        </div>
    );
}) 