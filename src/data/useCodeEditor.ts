// use-code-editor.ts
import { useEffect } from 'react';
import { onUpdate } from './onUpdate.ts';
import useCodeMirror from './useCodeMirror.ts';

export function useCodeEditor({ value, onChange, extensions }) {
	const { ref, view } = useCodeMirror([onUpdate(onChange), ...extensions]);

	useEffect(() => {
		if (view) {
			const editorValue = view.state.doc.toString();

			if (value !== editorValue) {
				view.dispatch({
					changes: {
						from: 0,
						to: editorValue.length,
						insert: value || '',
					},
				});
			}
		}
	}, [value, view]);

	return { ref, view };
}
