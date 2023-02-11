import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';

import CampaginPostMessages from '../campaginPost.messages';

const CreateCampaingBanner = () => (
  <Stack
    sx={{ p: 2, borderRadius: 1, bgcolor: 'common.white' }}
    alignItems="center"
    justifyContent="center"
    spacing={3}
  >
    <img src="/images/post/posting.svg" width={230} height={185} alt="create-campagin" />
    <Typography variant="caption" color="text.secondary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna
      fringilla urna, porttitor
    </Typography>
    <CustomLink path={PATH_APP.post.createPost.campainPost.new}>
      <Button variant="contained">
        <FormattedMessage {...CampaginPostMessages.create} />
      </Button>
    </CustomLink>
  </Stack>
);

export default CreateCampaingBanner;
