import styled, { css } from 'styled-components';

interface ButtonProps {
  currentPageEquals: boolean;
}

export const NavContainer = styled.nav`
  background-color: #ededed;
  display: flex;
  justify-content: center;
  ul {
    padding: 2px;
    margin: 0px;
    background-color: #ededed;
    list-style: none;
  }

  ul li {
    display: inline;
  }

  ul li button {
    padding: 10px 25px;
    display: inline-block;
    border-radius: 5px;

    background-color: #ededed;
    color: #333;
    text-decoration: none;
  }

  ul li button:hover {
    background-color: #d6d6d6;
    color: #6d6d6d;
    border-bottom: 3px solid #ff8c00;
  }
`;

export const Button = styled.button<ButtonProps>`
  ${props =>
    props.currentPageEquals &&
    css`
      border: 3px solid #ff8c00;
    `}
`;
