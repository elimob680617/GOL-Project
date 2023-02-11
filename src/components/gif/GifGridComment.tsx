import { FormattedMessage } from 'react-intl';

import { Grid, Typography } from '@mui/material';

import gifComponentMessages from './gifComponentMessages';

function GifGridComment({ gifs, gifSelected, setShowGifs }: any) {
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
              gifSelected(gif.gifUrl);
              setShowGifs(false);
            }}
          >
            <img src={gif.gifUrl} width={2} height={1} loading="lazy" alt={gif.title} />
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

export default GifGridComment;
