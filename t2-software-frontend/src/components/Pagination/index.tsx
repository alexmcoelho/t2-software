import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { NavContainer, Button } from './styles';

interface IPageProps {
  linesPerpage: number;
  totalElements: number;
  currentPage: number;
  paginate: (num: number) => void;
  previous: () => void;
  next: () => void;
}

const Pagination: React.FC<IPageProps> = ({
  linesPerpage,
  totalElements,
  currentPage,
  paginate,
  previous,
  next,
}) => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  useEffect(() => {
    const pages = [];
    for (let i = 0; i < Math.ceil(totalElements / linesPerpage); i++) {
      pages.push(i);
    }
    setPageNumbers(pages);
  }, [linesPerpage, totalElements]);

  return (
    <NavContainer>
      <ul>
        <li>
          <button type="button" onClick={previous}>
            <FiChevronLeft size={12} />
          </button>
        </li>
        {pageNumbers.map(num => (
          <li key={num}>
            <Button
              currentPageEquals={currentPage === num}
              onClick={() => paginate(num)}
              type="button"
            >
              {num + 1}
            </Button>
          </li>
        ))}
        <li>
          <button type="button" onClick={next}>
            <FiChevronRight size={12} />
          </button>
        </li>
      </ul>
    </NavContainer>
  );
};

export default Pagination;
