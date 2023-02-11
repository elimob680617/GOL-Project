import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useGetSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getSocialMedias.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { addedSocialMedia, userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { SocialMedia } from 'src/types/serverTypes';

function SocialLinkPlatformDialoge() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);

  useEffect(() => {
    if (!personSocialMedia) router(PATH_APP.profile.ngo.contactInfo.root);
  }, [personSocialMedia, router]);

  const { data, isFetching } = useGetSocialMediasQuery({
    filter: {
      all: true,
    },
  });

  const handleSelectPlatform = (social: SocialMedia) => {
    dispatch(
      addedSocialMedia({
        ...personSocialMedia,
        socialMediaDto: social,
      }),
    );
    router(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.selectPlatform} />
          </Typography>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {isFetching ? (
            <CircularProgress size={20} />
          ) : (
            data?.getSocialMedias?.listDto?.items?.map((item) => (
              <Box
                key={item?.id}
                onClick={() => handleSelectPlatform(item as SocialMedia)}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Typography variant="body2" color="text.primary">
                  <IconButton sx={{ mr: 1 }}>
                    <Icon name="image" />
                  </IconButton>
                  {item?.title}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default SocialLinkPlatformDialoge;
