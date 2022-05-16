import { useNavigate } from 'remix'
import { useLocation } from 'react-router-dom';
import styles from './styles.css'

type Props = {
  prevCursor?: string | null;
  nextCursor?: string | null;
}

const Pagination = ({
  prevCursor,
  nextCursor,
}: Props) => {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const handlePrev = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('direction', 'prev');
    url.searchParams.set('page', prevCursor);
    navigate(`${url.pathname}${url.search}`);
  }

  const handleNext = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('direction', 'next')
    url.searchParams.set('page', nextCursor);
    navigate(`${url.pathname}${url.search}`);
  }

  return (
    <div>
      <button
        onClick={() => handlePrev()}
        disabled={!prevCursor}
      >
        Prev
      </button>
      <button
        onClick={() => handleNext()}
        disabled={!nextCursor}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination

Pagination.displayName = "Pagination"
