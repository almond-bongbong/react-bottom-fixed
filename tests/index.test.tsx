import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component } from '../src';

describe('test', () => {
  it('correct', () => {
    render(<div>hello</div>);
    screen.getByText('hello');
  });

  it('app', () => {
    render(<Component />);
    screen.getByText('hello3');
  });

  it('wrong', () => {
    render(<div>hello</div>);
    const hello = screen.queryByText('hello2');

    expect(hello).toBeNull();
  });
});
