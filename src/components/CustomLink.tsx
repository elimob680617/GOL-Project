/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

const CustomLink: FC<PropsWithChildren<{ path: string }>> = ({ path, children }) => (
  <Link to={path}>
    <a>{children}</a>
  </Link>
);

export default CustomLink;
