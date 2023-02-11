import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch } from 'src/store';
import { bioUpdated } from 'src/store/slices/profile/ngoProfileBio-slice';

const NoBioStyle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: theme.palette.background.neutral,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(),
}));
const BioBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginRight: theme.spacing(1),
  lineHeight: 1,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  height: 38,
}));
const BioMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 0,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function Bio(props: { text: string; isReadOnly?: boolean | undefined }) {
  const { text, isReadOnly = false } = props;
  const router = useNavigate();
  const dispatch = useDispatch();
  const [isLoadMore, setIsLoadMore] = useState<boolean>();

  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };
  const handelEditBio = () => {
    dispatch(bioUpdated(text));
    router(PATH_APP.profile.ngo.bioDialog);
  };
  return (
    <>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...ProfileMainMessage.bio} />
        </Typography>
        {text?.length === 0 ? (
          <Link to={PATH_APP.profile.ngo.bioDialog}>
            <Button
              size="small"
              variant="outlined"
              sx={{ color: 'text.primary', width: 163 }}
              startIcon={<Icon name="Plus" color="text.primary" />}
            >
              <Typography variant="button" color="text.primary">
                <FormattedMessage {...ProfileMainMessage.addBio} />
              </Typography>
            </Button>
          </Link>
        ) : (
          !isReadOnly && (
            <Button size="small" variant="text" sx={{ color: 'text.primary' }} onClick={handelEditBio}>
              <Typography variant="subtitle1" color="primary.main">
                <FormattedMessage {...ProfileMainMessage.edit} />
              </Typography>
            </Button>
          )
        )}
      </Stack>
      {text?.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <NoBioStyle>
            <Typography variant="overline" color="surface.onSurfaceVariantD" sx={{ textTransform: 'none' }}>
              <FormattedMessage {...ProfileMainMessage.noBio} />
            </Typography>
          </NoBioStyle>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage {...ProfileMainMessage.haveNoBio} />
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          {!isLoadMore && (text?.length > 180 || text?.trim().split('\n').length > 3) ? (
            <>
              <BioBriefDescriptionStyle>
                {text?.split('\n').map((str, i) => (
                  <Typography variant="body2" component="p" key={i}>
                    {str}
                  </Typography>
                ))}
              </BioBriefDescriptionStyle>
              <Typography
                variant="body2"
                color="info.main"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSeeMoreClick()}
              >
                <FormattedMessage {...ProfileMainMessage.seeMore} />
              </Typography>
            </>
          ) : (
            <BioMoreDescriptionStyle>
              {text?.split('\n').map((str, i) => (
                <Typography variant="body2" component="div" sx={{ minHeight: 18 }} key={i}>
                  {str}
                </Typography>
              ))}
            </BioMoreDescriptionStyle>
          )}
        </Box>
      )}
    </>
  );
}

export default Bio;
