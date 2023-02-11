import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import 'cropperjs/dist/cropper.css';
import { useSnackbar } from 'notistack';
import { useUploadImageMutation } from 'src/_graphql/cms/mutations/createFile.generated';
import { useUpdateProfileFiledMutation } from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
// services
import Cropper from 'src/components/Cropper';
import useAuth from 'src/hooks/useAuth';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { EntityType, ProfileFieldEnum } from 'src/types/serverTypes';

// Types !!
interface MainProfileCoverAvatarProps {
  isAvatar?: boolean;
  onCloseBottomSheet: () => void;
}

function MainProfileCoverAvatarUser(props: MainProfileCoverAvatarProps) {
  const { initialize } = useAuth();
  const { formatMessage } = useIntl();
  // props !
  const { isAvatar = false, onCloseBottomSheet } = props;
  const [isLoading, setIsLoading] = useState(false);
  // tools !
  const { enqueueSnackbar } = useSnackbar();
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);

  const [uploadImage] = useUploadImageMutation();

  // service for update profile
  const [updateProfileField] = useUpdateProfileFiledMutation();
  //------------------- on submit and crop photo  with upload it------------
  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setIsLoading(true);
    const res: any = await uploadImage({
      file: {
        dto: {
          entityType: EntityType.Person,
          type: image?.type?.split('/')[1],
          name: image?.name,
          binary: cropper.getCroppedCanvas().toDataURL().split(',')[1],
        },
      },
    });

    if (res?.data?.createFile?.isSuccess) {
      const url = res?.data!.createFile!.listDto!.items?.[0]!.url as string;
      if (isAvatar) {
        const resAvatarUser: any = await updateProfileField({
          filter: {
            dto: {
              field: ProfileFieldEnum.AvatarUrl,
              avatarUrl: url,
            },
          },
        });
        if (resAvatarUser?.data?.updateProfileFiled?.isSuccess) {
          enqueueSnackbar('The Profile photo has been successfully added', { variant: 'success' });
        } else {
          enqueueSnackbar('It was not successful', { variant: 'error' });
        }
      } else {
        const resCoverUser: any = await updateProfileField({
          filter: {
            dto: {
              field: ProfileFieldEnum.CoverUrl,
              coverUrl: url,
            },
          },
        });
        if (resCoverUser?.data?.updateProfileFiled?.isSuccess) {
          enqueueSnackbar('The Cover photo has been successfully deleted', { variant: 'success' });
        } else {
          enqueueSnackbar('It was not successful', { variant: 'error' });
        }
      }
    }

    setIsLoading(false);
    initialize();
    onCloseBottomSheet();
  };

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setBase64(reader.result as string);
        setImage(e.target.files[0]);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (inputRef) {
        inputRef.current?.click();
      }
    }, 100);
  }, [inputRef]);

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        style={{ display: 'hidden' }}
        id="photo-upload-experience"
        accept="image/*"
        onChange={onSelectFile}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle2" color="text.primary">
            {isAvatar ? formatMessage(ProfileMainMessage.profilePhoto) : formatMessage(ProfileMainMessage.coverPhoto)}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ height: 2 }} />
      <Box
        sx={{
          minHeight: 500,
          py: 2,
          textAlign: 'center',
        }}
      >
        {base64 && (
          <Cropper
            dragMode="none"
            src={base64}
            initialAspectRatio={isAvatar ? 1 / 1 : 16 / 9}
            guides={true}
            modal={true}
            ref={cropperRef}
            checkOrientation={false}
            viewMode={1}
            cropBoxResizable={false}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            responsive={true}
            toggleDragModeOnDblclick={false}
            zoomable={true}
            scalable={false}
            background={false}
          />
        )}
        {base64 && <Box sx={{ mt: 2 }} />}
        <Box sx={{ px: 2 }}>
          <LoadingButton
            loading={isLoading}
            onClick={() => (base64 ? onCrop() : inputRef.current?.click())}
            sx={{ width: '100%' }}
            variant="contained"
          >
            {base64 ? formatMessage(ProfileMainMessage.save) : formatMessage(ProfileMainMessage.add)}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
}

export default MainProfileCoverAvatarUser;
