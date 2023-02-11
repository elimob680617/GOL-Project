import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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

import { Icon } from '../Icon';
import GifGrid from './GifGrid';
import gifComponentMessages from './gifComponentMessages';

function GifDialog() {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('Trending');
  const [getGifs, { isLoading: getGifLoading, data: getGif }] = useLazyGetGifQuery();
  const [searchValue, setSearchValue] = useState('');
  const { formatMessage } = useIntl();

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
    <Dialog open={true} maxWidth="sm" fullWidth aria-labelledby="responsive-dialog-title" sx={{ zIndex: 9998 }}>
      <DialogTitle sx={{ padding: 0 }}>
        <Typography variant="subtitle1" color="GrayText.primary" sx={{ margin: 2.25 }} justifyContent={'flex-start'}>
          <IconButton onClick={() => navigate(-1)}>
            <Icon name="left-arrow-1" />
          </IconButton>
          <FormattedMessage {...gifComponentMessages.SelectGIF} />
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: 536, marginTop: 1 }}>
        <TabContext value={value}>
          <Typography variant="button">
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={formatMessage(gifComponentMessages.Trending)}
                value="Trending"
                onClick={() => setSearchValue('')}
              />
              <Tab
                label={formatMessage(gifComponentMessages.Reaction)}
                value="Reaction"
                onClick={() => setSearchValue('')}
              />
              <Tab label={formatMessage(gifComponentMessages.Love)} value="Love" onClick={() => setSearchValue('')} />
              <Tab label={formatMessage(gifComponentMessages.Sad)} value="Sad" onClick={() => setSearchValue('')} />
              <Tab label={formatMessage(gifComponentMessages.Sport)} value="Sport" onClick={() => setSearchValue('')} />
              <Tab label={formatMessage(gifComponentMessages.TV)} value="TV" onClick={() => setSearchValue('')} />
            </TabList>
          </Typography>
          <Typography variant="body1">
            <TextField
              variant="outlined"
              placeholder={formatMessage(gifComponentMessages.SearchGIF)}
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
    </Dialog>
  );
}

export default GifDialog;
