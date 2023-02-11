import { FC, useEffect, useState } from 'react';

import { Box, CircularProgress, ClickAwayListener, IconButton, Stack, TextField, styled } from '@mui/material';

import { useLazyGetGifQuery } from 'src/_graphql/post/create-post/queries/getGifQuery.generated';
import gifIcon from 'src/assets/icons/comment/24/input/GIF.svg';
import NoGif from 'src/assets/icons/noGif/NOGIF.svg';
import Image from 'src/components/Image';
import useDebounce from 'src/utils/useDebounce';

const GifWrapper = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  width: '100%',
  '& img': {
    width: '100%',
  },
}));

interface ICommentGifProps {
  gifSelected: (url: string) => void;
}

const CommentGif: FC<ICommentGifProps> = (props) => {
  const { gifSelected } = props;
  const [showGifs, setShowGifs] = useState<boolean>(false);
  const [searchedText, setSearchedText] = useState<string>('');
  const searchedTextDebounce = useDebounce<string>(searchedText, 500);
  const [getGifsQuery, { isFetching: gettingGifLoading, data: gifs }] = useLazyGetGifQuery();

  useEffect(() => {
    getGifsQuery({ filter: { dto: { searchTerm: searchedTextDebounce }, pageIndex: 0, pageSize: 20 } });
  }, [searchedTextDebounce]);

  return (
    <Stack sx={{ position: 'relative' }}>
      <IconButton onClick={() => setShowGifs(true)}>
        <Image src={gifIcon} alt="gif" width={29} height={29} />
      </IconButton>
      {showGifs && (
        <ClickAwayListener onClickAway={() => setShowGifs(false)}>
          <Stack
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 45,
              left: 0,
              padding: 2,
              paddingTop: 0,
              width: 250,
              height: 300,
              borderRadius: 1,
              bgcolor: 'background.default',
              zIndex: 2,
              overflow: 'auto',
            }}
            spacing={3}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.default', paddingTop: 2 }}
            >
              <TextField
                value={searchedText}
                onChange={(e) => setSearchedText(e.target.value)}
                id="search-gif"
                placeholder="Search GIF"
                variant="outlined"
              />
            </Stack>

            {gettingGifLoading && <CircularProgress />}
            {!gettingGifLoading && (
              <Stack spacing={0.25}>
                {gifs?.getGifsQuery?.listDto?.items?.length !== 0 ? (
                  gifs?.getGifsQuery?.listDto?.items?.map((gif: any) => (
                    <GifWrapper
                      onClick={() => {
                        gifSelected(gif.gifUrl);
                      }}
                      key={gif.id}
                    >
                      <img src={gif.gifUrl} alt={gif.title} />
                    </GifWrapper>
                  ))
                ) : (
                  <Box>
                    <Image src={NoGif} alt="" />
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </ClickAwayListener>
      )}
    </Stack>
  );
};

export default CommentGif;
