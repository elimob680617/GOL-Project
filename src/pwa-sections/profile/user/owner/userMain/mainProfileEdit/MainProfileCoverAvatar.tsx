import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import 'cropperjs/dist/cropper.css';
import { useUploadImageMutation } from 'src/_graphql/cms/mutations/createFile.generated';
import Cropper from 'src/components/Cropper';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
// import { useSelector } from 'src/store';
// import { userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';
import { EntityType } from 'src/types/serverTypes';

interface MainProfileCoverAvatarProps {
  isAvatar?: boolean;
  onChange: (value: string) => void;
}

function MainProfileCoverAvatar(props: MainProfileCoverAvatarProps) {
  const { isAvatar = false, onChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const { formatMessage } = useIntl();
  const [uploadImage] = useUploadImageMutation();
  // const userMainInfo = useSelector(userMainInfoSelector);

  // useEffect(() => {
  //   if (!userMainInfo) router.push('/profile/userEdit');
  // }, [userMainInfo, router]);

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
      onChange(url);
    }
    setIsLoading(false);
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
            {isAvatar
              ? formatMessage(ProfileMainMessage.changeProfilePhoto)
              : formatMessage(ProfileMainMessage.changeCoverPhoto)}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ height: 2 }} />
      <Box
        sx={{
          minHeight: 250,
          py: 2,
          textAlign: 'center',
          // px: 17,
        }}
      >
        {base64 && (
          <Cropper
            dragMode="none"
            src={base64}
            isRounded={isAvatar}
            background={false}
            initialAspectRatio={16 / 9}
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

export default MainProfileCoverAvatar;
