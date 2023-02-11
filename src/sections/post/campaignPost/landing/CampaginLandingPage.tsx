import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import Body from './Body';
import SideBar from './SideBar';

const CampaginLandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<number>(0);
  const canSendRequest = useRef<boolean>(false);

  useEffect(() => {
    if (searchParams.get('search')) {
      const search = JSON.parse(searchParams.get('search') as string);
      const searchedCategory = search.category;
      setCategory(searchedCategory);
      canSendRequest.current = true;
    } else {
      canSendRequest.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (canSendRequest.current && category) {
      setSearchParams({ search: JSON.stringify({ category }) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <Stack direction="row" spacing={3} sx={{ height: 'calc(100vh - 88px)', overflow: 'hidden', pb: 3 }}>
      <SideBar category={category} setCategory={setCategory} />
      <Body />
    </Stack>
  );
};

export default CampaginLandingPage;
