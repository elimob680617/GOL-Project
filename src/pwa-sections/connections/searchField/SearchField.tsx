import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import { Stack, TextField, styled } from '@mui/material';

const ConnectionSidebarStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
}));

const SearchField: FC<{
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setDebounced: Dispatch<SetStateAction<string>>;
}> = ({ pageIndex, setPageIndex, setDebounced }) => {
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const searchDelay = setTimeout(() => {
      setDebounced(searchText);
      setPageIndex(1);
    }, 500);

    return () => clearTimeout(searchDelay);
  }, [searchText, setDebounced, setPageIndex]);
  return (
    <>
      <ConnectionSidebarStyled p={2} spacing={3}>
        <Stack spacing={2}>
          <TextField
            id="searchBox"
            name="searchBox"
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <img
                  src="/icons/Research/Outline.svg"
                  width={20}
                  height={20}
                  alt="research"
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />
        </Stack>
      </ConnectionSidebarStyled>
    </>
  );
};

export default SearchField;
