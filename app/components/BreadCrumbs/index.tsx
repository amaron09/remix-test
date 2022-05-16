import { NavLink } from "@remix-run/react";
import { useLocation } from 'react-router-dom';
import styles from './styles.css'

const BreadCrumbs = ({
  
}) => {
  const { pathname } = useLocation()
  const splittedPath = pathname.split('/')
  return (
    <div>
      {splittedPath.map((path, index) => {
        if (index === 0) {
          return (
            <NavLink
              key={index}
              to={`/${path}`}
            >
              home
            </NavLink>
          )
        }
        return (
          <NavLink
            key={index}
            to={`${splittedPath.slice(0, index + 1).join('/')}`}
          >
            /{path}
          </NavLink>
        )
      })}
    </div>
  )
}

export default BreadCrumbs