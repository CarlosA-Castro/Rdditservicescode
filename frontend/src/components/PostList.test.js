import { render, screen } from '@testing-library/react';
import PostList from './PostList';

// Mock de Material-UI
jest.mock('@mui/material', () => ({
  AppBar: () => <div>AppBar</div>,
  Toolbar: () => <div>Toolbar</div>,
  Typography: ({ children }) => <div>{children}</div>,
  Button: () => <button>Button</button>,
  Card: () => <div>Card</div>,
  CardContent: () => <div>CardContent</div>,
  Grid: ({ children }) => <div>{children}</div>,
  Box: ({ children }) => <div>{children}</div>,
}));

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: { 
      posts: [{ id: 1, title: 'Test Post' }],
      pagination: { page: 1, total: 1, pages: 1 }
    } 
  }))
}));

describe('PostList Component', () => {
  test('renders loading state initially', () => {
    render(<PostList />);
    const loadingElement = screen.getByText(/Loading/i);
    expect(loadingElement).toBeInTheDocument();
  });
});