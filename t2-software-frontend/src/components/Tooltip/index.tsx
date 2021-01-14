import React from 'react';

import { Container } from './styles';

interface ToottipProps {
  title: string;
  className?: string;
}
const Tooltip: React.FC<ToottipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
