import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Mock para evitar problemas de importación
jest.mock('@mui/material', () => ({
  AppBar: () => <div data-testid="app-bar">AppBar</div>,
  Toolbar: () => <div>Toolbar</div>,
  Typography: ({ children }) => <div>{children}</div>,
  Button: () => <button>Button</button>,
  Card: () => <div>Card</div>,
  CardContent: () => <div>CardContent</div>,
}));

// Mock de componentes
jest.mock('./components/PostList', () => () => (
  <div data-testid="post-list">PostList Component</div>
));

jest.mock('./components/PostDetail', () => () => (
  <div data-testid="post-detail">PostDetail Component</div>
));

describe('App Component Tests', () => {
  test('renders Reddit App header', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const headerElement = screen.getByText(/Reddit App/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders main content area', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});