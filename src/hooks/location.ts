import { useLocation } from 'react-router-dom';

export const useUrlQueryParams = (option?: { location?: Location }) => {
  const { search } = option?.location ?? useLocation();
  const urlSearchParams = new URLSearchParams(search);
  return Object.fromEntries(urlSearchParams.entries());
};
