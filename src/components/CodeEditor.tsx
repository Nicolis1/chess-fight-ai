// CodeEditor.tsx
import React from 'react';
import { useCodeEditor } from '../data/useCodeEditor.ts';

export default function CodeEditor({ value, onChange, extensions }) {
	const ref = useCodeEditor({ value, onChange, extensions });

	return <div className='editor' ref={ref} />;
}
