// use-code-mirror.ts
import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';

export default function useCodeMirror(extensions) {
	const ref = useRef(null);
	const [view, setView] = useState<EditorView>();
	useEffect(() => {
		if (!ref?.current) {
			return;
		}
		const view = new EditorView({
			extensions: [
				basicSetup,
				javascript({
					jsx: false,
					typescript: false,
				}),
				...extensions,
			],
			parent: ref.current,
		});

		setView(view);

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === ref.current) {
					view.requestMeasure({
						read: () => {},
						write: () =>
							(view.dom.style.height = `${entry.contentRect.height}px`),
					});
				}
			}
		});
		if (ref.current) {
			resizeObserver.observe(ref.current);
		}
		return () => {
			if (ref.current) {
				resizeObserver.unobserve(ref.current);
			}
			view.destroy();
			setView(undefined);
		};
	}, []);

	return { ref, view };
}
