import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Grid, Typography } from '@mui/material';

import { PATH_APP } from 'src/routes/paths';
import { setGifs } from 'src/store/slices/post/createSocialPost';

import gifComponentMessages from './gifComponentMessages';

function GifGrid({ gifs }: any) {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  return (
    <Grid container xs={12} justifyContent={'center'} spacing={0.25}>
      {gifs ? (
        gifs.map((gif: any) => (
          <Grid
            item
            xs={6}
            justifyContent={'center'}
            key={gif.id}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              dispatch(setGifs(gif.gifUrl));
              navigation(PATH_APP.post.createPost.socialPost.index);
            }}
          >
            <img src={gif.gifUrl} width={2} height={1} alt={gif.title} />
          </Grid>
        ))
      ) : (
        <Grid
          xs={12}
          sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography variant="subtitle2" color={'primary.light'}>
            <FormattedMessage {...gifComponentMessages.GIFsNotFound} />
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default GifGrid;
