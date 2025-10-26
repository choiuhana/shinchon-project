"use client";

import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/react-editor";
import type { Editor as EditorCore } from "@toast-ui/editor";
import { useEffect, useRef, useState } from "react";

const toolbarItems: [string, string][] = [
	["heading", "bold"],
	["italic", "strike"],
	["hr", "quote"],
	["ul", "ol"],
	["task", "indent"],
	["table", "link"],
	["code", "codeblock"],
];

type RichTextEditorProps = {
	name: string;
	initialValue?: string;
	resetKey?: number;
};

export function RichTextEditor({ name, initialValue = "", resetKey }: RichTextEditorProps) {
	const editorRef = useRef<EditorCore | null>(null);
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
		if (editorRef.current) {
			editorRef.current.setMarkdown(initialValue || "");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetKey]);

	return (
		<div className="grid gap-2">
			<Editor
				ref={(instance) => {
					editorRef.current = instance?.getInstance() ?? null;
				}}
				initialValue={initialValue}
				initialEditType="wysiwyg"
				hideModeSwitch
				height="380px"
				usageStatistics={false}
				onChange={() => {
					const markdown = editorRef.current?.getMarkdown() ?? "";
					setValue(markdown);
				}}
				toolbarItems={toolbarItems}
			/>
			<input type="hidden" name={name} value={value} />
		</div>
	);
}
