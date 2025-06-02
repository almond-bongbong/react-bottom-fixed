import './index.css';
import { sum } from './utils/sum';

export interface Props {
  className?: string;
}

export function Component({ className }: Props) {
  return <div className={`compo ${className || ''}`}>hello{sum(1, 2)}</div>;
}
