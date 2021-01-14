import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  padding: 32px 0;
  background: #28262e;
`;
export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  > img {
    width: 100px;
    height: 100px;
  }

  button {
    margin-left: auto;
    margin-right: 5px;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;
export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #ff9000;
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 5px auto;
  display: flex;
`;
export const Schedule = styled.section`
  flex: 1;
  h1 {
    font-size: 36px;
    padding-bottom: 20px;
  }

  .button-new-user {
    font-weight: 600;
    border-radius: 8px;
    border: 0;
    background: #ff8c00;
    color: #fff;

    display: flex;
    flex-direction: row;
    align-items: center;

    .text {
      padding: 10px 24px;
    }

    .icon {
      display: flex;
      padding: 16px 16px;
      background: #ffa500;
      border-radius: 0 8px 8px 0;
      margin: 0 auto;
    }
  }

  p {
    margin-top: 8px;
    color: #ff9000;
    display: flex;
    align-items: center;
    font-weight: 500;
    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: #ff9000;
      margin: 0 10px 0 10px;
    }
  }
`;

export const Section = styled.section`
  margin-top: 48px;
  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  > p {
    color: #999591;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 22px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;

  th {
    background: #333;
    color: white;
    font-weight: bold;
  }
  td,
  th {
    padding: 6px;
    border: 1px solid #ccc;
    text-align: left;
  }

  div.icon-container {
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      background: #ff9000;
      padding: 10px;
      border-radius: 8px;
      display: flex;
      border: none;
      transition: 0.1s;

      svg {
        color: #fff;
      }

      & + button {
        margin-left: 6px;
      }
    }
  }

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      border: 1px solid #ccc;
    }

    td {
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
    }

    td:before {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }

    td:nth-of-type(1):before {
      content: 'First Name';
    }
    td:nth-of-type(2):before {
      content: 'Last Name';
    }
    td:nth-of-type(3):before {
      content: 'Job Title';
    }
  }
`;
