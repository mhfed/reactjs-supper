/*
 * Created on Fri Jan 06 2023
 *
 * Test sample
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
