import { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { IconButton, Stack, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import ConfirmDialog from 'src/components/dialogs/ConfirmDialog';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { basicCreateSocialPostSelector, initialState } from 'src/store/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/store/slices/upload';

import SocialPostMessages from '../socialPost.message';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

interface ICreatePostMainHeaderProps {
  cancelAllUploads: () => void;
}

const CreatePostMainHeader: FC<ICreatePostMainHeaderProps> = (props) => {
  const { cancelAllUploads } = props;
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const { formatMessage } = useIntl();

  const needToConformDialog = () => {
    if (
      post.audience !== initialState.audience ||
      post.gifs !== initialState.gifs ||
      post.location !== initialState.location ||
      post.text !== initialState.text ||
      post.mediaUrls !== initialState.mediaUrls ||
      uploadingFiles.length > 0
    ) {
      setShowConfirmDialog(true);
    } else {
      navigate(PATH_APP.home.index, { replace: true });
    }
  };

  return (
    <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        variant="subtitle1"
        sx={{
          color: 'grey.900',
          fontWeight: 500,
        }}
      >
        <FormattedMessage {...SocialPostMessages.socialPost} />
      </Typography>
      <IconButton onClick={() => needToConformDialog()} sx={{ padding: 0 }}>
        <Icon name="Close" />
      </IconButton>

      <ConfirmDialog
        confirmText={formatMessage({ ...SocialPostMessages.unsavedConfirm })}
        actionButtonText="Confirm"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        titleText={formatMessage({ ...SocialPostMessages.exitCreateSocial })}
        confirm={() => {
          cancelAllUploads();
          navigate(PATH_APP.home.index, { replace: true });
        }}
      />
    </HeaderWrapperStyle>
  );
};

export default CreatePostMainHeader;
