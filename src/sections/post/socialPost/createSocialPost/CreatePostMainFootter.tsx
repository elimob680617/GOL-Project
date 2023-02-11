import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Stack, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { IMediaProps, LimitationType } from 'src/components/upload/GolUploader';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { basicCreateSocialPostSelector } from 'src/store/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/store/slices/upload';
import { ERROR } from 'src/theme/palette';

import SocialPostMessages from '../socialPost.message';

const PostButtonStyle = styled(LoadingButton)(() => ({
  width: 120,
}));

const WrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  width: '100%',
}));

const OkStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  border: `1px solid #C8D3D9`,
  width: 120,
}));

interface ICreatePostMainFotterProps {
  addImage: () => void;
  startPosting: () => void;
  loading: boolean;
  limitationError: LimitationType;
  okLimitationClicked: () => void;
  media: IMediaProps[];
  textLimitation: any;
  disableButtons: boolean;
}

const CreatePostMainFotter: FC<ICreatePostMainFotterProps> = (props) => {
  const {
    addImage,
    startPosting,
    loading,
    limitationError,
    okLimitationClicked,
    media,
    textLimitation,
    disableButtons,
  } = props;
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const [hasGIF, setHasGIF] = useState<number>(0);
  const [hasText, setHasText] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (media?.length === 0) {
      setHasGIF(0);
    } else if (media[0]?.type === 'gif') {
      setHasGIF(1);
    } else {
      setHasGIF(2);
    }
  }, [media]);
  useEffect(() => {
    if (
      post.text.length === 1 &&
      (post.text[0] as any).children.length === 1 &&
      (post.text[0] as any).children[0].text === ''
    ) {
      setHasText(false);
    } else {
      setHasText(true);
    }
  }, [post.text]);

  return (
    <WrapperStyle
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={[(theme) => ({})]}
    >
      {textLimitation >= 3001 ? (
        <Box sx={{ width: '100%', height: 'rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Icon name="Exclamation-Mark" />
          <Typography variant="button" color={ERROR.main}>
            <FormattedMessage {...SocialPostMessages.characterLimit} />
          </Typography>
        </Box>
      ) : null}
      {!limitationError && (
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton
            style={{ display: hasGIF === 1 ? 'none' : '' }}
            onClick={() => {
              if (!disableButtons) addImage();
            }}
            aria-label="upload picture"
            component="span"
          >
            <Icon size={24} name="image" />
          </IconButton>
          {!disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <Link to={PATH_APP.post.createPost.socialPost.addGif}>
                <IconButton style={{ display: hasGIF === 2 ? 'none' : '' }}>
                  <Icon size={24} name="GIF" />
                </IconButton>
              </Link>
              <Link to={PATH_APP.post.createPost.socialPost.addLocation}>
                <IconButton>
                  <Icon size={24} name="location" />
                </IconButton>
              </Link>
            </Stack>
          )}
          {disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <IconButton style={{ display: hasGIF === 2 ? 'none' : '' }}>
                <Icon size={24} name="GIF" />
              </IconButton>

              <IconButton>
                <Icon size={24} name="location" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}

      {!limitationError && (
        <PostButtonStyle
          loading={loading}
          disabled={
            (!post.editMode &&
              !hasText &&
              hasGIF !== 1 &&
              post.mediaUrls.length === 0 &&
              !post.location &&
              uploadingFiles.length === 0) ||
            (post.editMode &&
              !hasText &&
              hasGIF !== 1 &&
              post.mediaUrls.length === 0 &&
              !post?.location?.id &&
              uploadingFiles.length === 0 &&
              media.length === 0)
          }
          onClick={() => {
            startPosting();
          }}
          variant="primary"
        >
          {post.editMode
            ? formatMessage({ ...SocialPostMessages.edit })
            : formatMessage({ ...SocialPostMessages.post })}
        </PostButtonStyle>
      )}

      {limitationError && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Stack spacing={1} direction="row" alignItems="center">
            <img src="/icons/warning/Outline.svg" width={24} height={24} alt="limitation-warning" />
            <Typography
              variant="body2"
              sx={{ color: 'error.main', fontWeight: '300', fontSize: '14px', lineHeight: '17.5px' }}
            >
              {limitationError === 'videoSize'
                ? formatMessage({ ...SocialPostMessages.videoLimitMaximumError })
                : limitationError === 'imageSize'
                ? formatMessage({ ...SocialPostMessages.imageLimitMaximumError })
                : limitationError === 'imageCount' || limitationError === 'videoCount'
                ? formatMessage({ ...SocialPostMessages.mediaCountLimit })
                : ''}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <OkStyle
              onClick={() => okLimitationClicked()}
              variant="primary"
              sx={{ color: 'grey.800', border: '1px solid' }}
            >
              <FormattedMessage {...SocialPostMessages.ok} />
            </OkStyle>
          </Stack>
        </Stack>
      )}
    </WrapperStyle>
  );
};

export default CreatePostMainFotter;
