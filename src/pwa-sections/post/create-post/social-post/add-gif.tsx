import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TabContext, TabPanel } from '@mui/lab';
import {
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from '@mui/material';

import { useLazyGetGifQuery } from 'src/_graphql/post/create-post/queries/getGifQuery.generated';
import Image from 'src/components/Image';
import GifGrid from 'src/components/gif/GifGrid';

function GifDialog() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState<string>('Trending');
  const [getGifs, { isLoading: getGifLoading, data: getGif }] = useLazyGetGifQuery();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getGifs({
      filter: { dto: { searchTerm: searchValue || value }, pageIndex: 2, pageSize: 20 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, searchValue]);

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };
  const GifBody = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100%',
  }));

  return (
    <GifBody>
      <DialogTitle sx={{ padding: 0 }}>
        <Typography variant="subtitle1" color="GrayText.primary" justifyContent={'flex-start'}>
          <IconButton onClick={() => navigate(-1)}>
            <Image src="/icons/arrow/left-arrow.svg" width={20} height={20} alt="Back-button" />
          </IconButton>
          Select GIF
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: 'calc(100% - 6rem)', marginTop: 1 }}>
        <TabContext value={value}>
          <Typography variant="button">
            <Tabs onChange={handleChange} aria-label="lab API tabs example" scrollButtons="auto" variant="scrollable">
              <Tab label="Trending" value="Trending" onClick={() => setSearchValue('')} />
              <Tab label="Reaction" value="Reaction" onClick={() => setSearchValue('')} />
              <Tab label="Love" value="Love" onClick={() => setSearchValue('')} />
              <Tab label="Sad" value="Sad" onClick={() => setSearchValue('')} />
              <Tab label="Sport" value="Sport" onClick={() => setSearchValue('')} />
              <Tab label="TV" value="TV" onClick={() => setSearchValue('')} />
            </Tabs>
          </Typography>
          <Typography variant="body1">
            <TextField
              variant="outlined"
              placeholder="Search GIF"
              sx={{ width: '100%', height: '2.5rem', marginTop: 3, marginBottom: 3 }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Typography>
          <TabPanel value="Trending">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
          <TabPanel value="Reaction">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
          <TabPanel value="Love">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
          <TabPanel value="Sad">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
          <TabPanel value="Sport">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
          <TabPanel value="TV">
            {getGifLoading && <CircularProgress />}
            <GifGrid gifs={getGif?.getGifsQuery.listDto?.items} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </GifBody>
  );
}

export default GifDialog;
