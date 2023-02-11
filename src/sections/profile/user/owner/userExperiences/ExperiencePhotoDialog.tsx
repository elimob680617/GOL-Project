import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useUploadImageMutation } from 'src/_graphql/cms/mutations/createFile.generated';
import Cropper from 'src/components/Cropper';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { experienceAdded, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { EntityType } from 'src/types/serverTypes';

import ExprienceMessages from './Exprience.messages';

function ExperiencePhotoDialog() {
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadImageMutation();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // setImageCropper(cropper.getCroppedCanvas().toDataURL());
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
      dispatch(
        experienceAdded({
          mediaUrl: url,
          isChange: true,
        }),
      );
      router(PATH_APP.profile.user.experience.add);
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
      <Dialog open fullWidth onClose={() => router(-1)}>
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
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...ExprienceMessages.addExperiencePhoto} />
            </Typography>
          </Stack>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider sx={{ height: 2 }} />
        <Box sx={{ py: 2, textAlign: 'center', px: 17 }}>
          {base64 && (
            <Cropper
              src={base64}
              // Cropper.js options
              // background={false}
              guides={true}
              modal={false}
              // crop={onCrop}
              ref={cropperRef}
              aspectRatio={1 / 1}
              checkOrientation={false}
              // cropend={onCrop}
              zoomTo={0.5}
              viewMode={1}
              cropBoxResizable={false}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              toggleDragModeOnDblclick={false}
            />
          )}
          {base64 && <Box sx={{ mt: 2 }} />}
          <LoadingButton
            loading={isLoading}
            onClick={() => (base64 ? onCrop() : inputRef.current?.click())}
            sx={{ width: '100%' }}
            variant="contained"
          >
            {base64 ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  );
}

export default ExperiencePhotoDialog;
