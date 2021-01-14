import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import { shade } from 'polished';

export const Form = styled(Unform)`
  padding: 48px 40px;
  display: flex;
  flex-direction: column;

  margin: 80px 0;

  h1 {
    margin-bottom: 24px;
  }
  a {
    color: #f4ede8;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }
`;
