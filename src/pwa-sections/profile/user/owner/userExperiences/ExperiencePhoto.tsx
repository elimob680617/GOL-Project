import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';

import 'cropperjs/dist/cropper.css';
import { useUploadImageMutation } from 'src/_graphql/cms/mutations/createFile.generated';
import Cropper from 'src/components/Cropper';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useSelector } from 'src/store';
import { userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { EntityType } from 'src/types/serverTypes';

import ExprienceMessages from './ExpriencePwa.messages';

interface PhotoProps {
  onChange: (value: string) => void;
  onClose: () => void;
}
function ExperiencePhoto(props: PhotoProps) {
  const { onChange, onClose } = props;
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [uploadImage] = useUploadImageMutation();
  const experienceData = useSelector(userExperienceSelector);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

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

  const handleClose = () => {
    onClose();
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
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.addExperiencePhoto} />
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ height: 2 }} />
      <Box sx={{ py: 2, textAlign: 'center', minHeight: 500 }}>
        {base64 && (
          <Cropper
            src={base64}
            // Cropper.js options
            // background={false}
            initialAspectRatio={16 / 9}
            guides={true}
            modal={false}
            // crop={onCrop}
            ref={cropperRef}
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
    </>
  );
}

export default ExperiencePhoto;
