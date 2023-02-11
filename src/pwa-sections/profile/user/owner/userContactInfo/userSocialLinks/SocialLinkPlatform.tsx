import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useGetSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getSocialMedias.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { SocialMedia } from 'src/types/serverTypes';

interface SocialLinkPlatformProps {
  onChange: (value: SocialMedia) => void;
}

function SocialLinkPlatform(props: SocialLinkPlatformProps) {
  const { onChange } = props;
  const navigate = useNavigate();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  useEffect(() => {
    if (!personSocialMedia) navigate(PATH_APP.profile.user.contactInfo.root);
  }, [personSocialMedia, navigate]);

  const { data, isFetching } = useGetSocialMediasQuery({
    filter: {
      all: true,
    },
  });

  const handleSelectPlatform = (social: SocialMedia) => {
    onChange(social);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Select Platform
        </Typography>
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
  );
}

export default SocialLinkPlatform;
