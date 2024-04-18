// use-code-mirror.ts
import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function useCodeMirror(extensions) {
	const ref = useRef(null);
	console.log(ref);
	const [view, setView] = useState<EditorView>();
	useEffect(() => {
		const view = new EditorView({
			extensions: [
				basicSetup,
				/**
				 * Check each language package to see what they support,
				 * for instance javascript can use typescript and jsx.
				 */
				javascript({
					jsx: false,
					typescript: true,
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

		/**
		 * Make sure to destroy the codemirror instance
		 * when our components are unmounted.
		 */
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
