import React from 'react';
import { render, screen } from '@testing-library/react';
import { BottomFixed } from '../src';

describe('test', () => {
  it('correct', () => {
    render(<div>hello</div>);
    screen.getByText('hello');
  });

  it('app', () => {
    render(<BottomFixed>hello</BottomFixed>);
    screen.getByText('hello');
  });

  it('wrong', () => {
    render(<div>hello</div>);
    const hello = screen.queryByText('hello2');

    expect(hello).toBeNull();
  });
});
