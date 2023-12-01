import { React } from 'react';
import './Button.css';

export default function Button(props) {
	return <i className={`${props.icon} icon`} onClick={props.onClick} />;
}
