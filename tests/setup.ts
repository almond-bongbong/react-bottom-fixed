import '@testing-library/jest-dom';

// Jest DOM 확장을 위한 전역 타입 선언
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveClass(...classNames: string[]): R;
    }
  }
}
