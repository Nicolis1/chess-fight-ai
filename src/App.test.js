import { render, screen } from '@testing-library/react';
import App from './App';

// TODO write some real tests
test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
