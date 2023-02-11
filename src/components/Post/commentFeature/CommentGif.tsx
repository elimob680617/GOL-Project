import { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material';

import { useLazyGetGifQuery } from 'src/_graphql/post/create-post/queries/getGifQuery.generated';
import { Icon } from 'src/components/Icon';
import GifGridComment from 'src/components/gif/GifGridComment';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';

import commentsFeatureMessages from './commentsFeatureMessages';

interface ICommentGifProps {
  gifSelected: (url: string) => void;
}
const CommentGif: FC<ICommentGifProps> = (props) => {
  const { gifSelected } = props;
  const [showGifs, setShowGifs] = useState<boolean>(false);
  const [value, setValue] = useState<string>('Trending');
  const [getGifs, { isLoading: getGifLoading, data: getGif }] = useLazyGetGifQuery();
  const [searchValue, setSearchValue] = useState('');
  const { formatMessage } = useIntl();

  const handleGifOpen = () => {
    setShowGifs(true);
    getGifs({
      filter: { dto: { searchTerm: searchValue || value }, pageIndex: 2, pageSize: 20 },
    });
  };
  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      <IconButton onClick={handleGifOpen}>
        <Icon name="GIF" />
      </IconButton>
      <Dialog open={showGifs} maxWidth="sm" fullWidth aria-labelledby="responsive-dialog-title" sx={{ zIndex: 9998 }}>
        <DialogTitle sx={{ padding: 0 }}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ pr: 2 }}>
            <Typography
              variant="subtitle1"
              color="GrayText.primary"
              sx={{ margin: 2.25 }}
              justifyContent={'space-around'}
            >
              <FormattedMessage {...commentsFeatureMessages.SelectGIF} />
            </Typography>
            <IconButton onClick={() => setShowGifs(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ height: 536, marginTop: 1 }}>
          <TabContext value={value}>
            <Typography variant="button">
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab
                  label={formatMessage(commentsFeatureMessages.Trending)}
                  value="Trending"
                  onClick={() => setSearchValue('')}
                />
                <Tab
                  label={formatMessage(commentsFeatureMessages.Reaction)}
                  value="Reaction"
                  onClick={() => setSearchValue('')}
                />
                <Tab
                  label={formatMessage(commentsFeatureMessages.Love)}
                  value="Love"
                  onClick={() => setSearchValue('')}
                />
                <Tab
                  label={formatMessage(commentsFeatureMessages.Sad)}
                  value="Sad"
                  onClick={() => setSearchValue('')}
                />
                <Tab
                  label={formatMessage(commentsFeatureMessages.Sport)}
                  value="Sport"
                  onClick={() => setSearchValue('')}
                />
                <Tab label={formatMessage(commentsFeatureMessages.TV)} value="TV" onClick={() => setSearchValue('')} />
              </TabList>
            </Typography>
            <Typography variant="body1">
              <TextField
                variant="outlined"
                placeholder={formatMessage(commentsFeatureMessages.SearchGIF)}
                sx={{ width: '100%', height: '2.5rem', marginTop: 3, marginBottom: 3 }}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Typography>
            <TabPanel value="Trending">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Reaction">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Love">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Sad">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Sport">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="TV">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
          </TabContext>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default CommentGif;
