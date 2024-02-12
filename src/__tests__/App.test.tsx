import React from "react"
import { render, screen } from "@testing-library/react"
import {ChakraProvider} from "@chakra-ui/react"
import App from "../App"
import LoadingBar from '../components/loadingBar'
import '@testing-library/jest-dom'
import Graph from '../components/graph'

test('demo', () => {
    expect(true).toBe(true)
})


test('App renders correctly', () => {
    const { asFragment } = render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
  
    // Generate a snapshot of the rendered App component
    expect(asFragment()).toMatchSnapshot();
  });

  jest.mock('@chakra-ui/react', () => ({
    Box: jest.fn(({ children }) => <div data-testid="box">{children}</div>),
    Progress: jest.fn(() => <div data-testid="progress"></div>)
  }));
  
  describe('LoadingBar', () => {
    it('renders LoadingBar component correctly', () => {
      // Render the LoadingBar component
      const { getByTestId } = render(<LoadingBar />);
      
      // Verify that the Box component from Chakra UI is rendered with the correct props
      const box = getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(box).toHaveStyle('width: 60%');
      expect(box).toHaveStyle('color: red');
  
      // Verify that the Progress component from Chakra UI is rendered
      const progress = getByTestId('progress');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('size', 'sm');
      expect(progress).toHaveAttribute('isIndeterminate');
    });
  });
  
  jest.mock('react-redux', () => ({
    useSelector: jest.fn()
  }));
  
  describe('Graph', () => {
    it('renders Graph component correctly', () => {
      const graphData = {
        TimeData: [10, 20, 30],
        CostData: [5, 10, 15],
        MemoryData: [100, 200, 300]
      };
  
      const useSelectorMock = jest.spyOn(React, 'useSelector');
      useSelectorMock.mockReturnValue(graphData);
  
      const { getByText } = render(<Graph />);
  
      expect(getByText('Invocation Time')).toBeInTheDocument();
      expect(getByText('Runtime Cost')).toBeInTheDocument();
      expect(getByText('100')).toBeInTheDocument();
      expect(getByText('200')).toBeInTheDocument();
      expect(getByText('300')).toBeInTheDocument();
    });
  });
  

