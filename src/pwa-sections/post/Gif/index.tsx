import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  TextField,
  Typography,
} from '@mui/material';

import { useLazyGetGifQuery } from 'src/_graphql/post/create-post/queries/getGifQuery.generated';

import GifGrid from './GifGrid';

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

  return (
    <Dialog open={true} maxWidth="lg" fullWidth aria-labelledby="responsive-dialog-title" sx={{ zIndex: 9998 }}>
      <DialogTitle sx={{ padding: 0 }}>
        <Typography variant="subtitle1" color="GrayText.primary" sx={{ margin: 2.25 }} justifyContent={'flex-start'}>
          <IconButton onClick={() => navigate(-1)}>
            <img src="/icons/arrow/left-arrow.svg" width={20} height={20} alt="BackButton" loading="lazy" />
          </IconButton>
          Select GIF
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: 536, marginTop: 1 }}>
        <TabContext value={value}>
          <Typography variant="button">
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Trending" value="Trending" onClick={() => setSearchValue('')} />
              <Tab label="Reaction" value="Reaction" onClick={() => setSearchValue('')} />
              <Tab label="Love" value="Love" onClick={() => setSearchValue('')} />
              <Tab label="Sad" value="Sad" onClick={() => setSearchValue('')} />
              <Tab label="Sport" value="Sport" onClick={() => setSearchValue('')} />
              <Tab label="TV" value="TV" onClick={() => setSearchValue('')} />
            </TabList>
          </Typography>
          <Typography variant="body1">
            {/* <Search
              type={'text'}
              placeholder="Search GIF"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            /> */}
            <TextField
              variant="outlined"
              placeholder="Search GIF"
              sx={{ width: '100%', height: '2.5rem', marginTop: 3, marginBottom: 3 }}
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
    </Dialog>
  );
}

export default GifDialog;
