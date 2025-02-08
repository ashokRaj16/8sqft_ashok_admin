import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from './page';

test('renders About Us page', () => {
    render(<AboutUs />);
    const heading = screen.getByText(/About Us/i);
    expect(heading).toBeInTheDocument();
});