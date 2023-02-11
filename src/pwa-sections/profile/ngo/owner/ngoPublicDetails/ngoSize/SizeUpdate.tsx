import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { NumberRangePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';
import SizeClose from './SizeClose';
import SizeDelete from './SizeDelete';
import SizeSelectAudience from './SizeSelectAudience';
import SizeStatus from './SizeStatus';

export default function SizeUpdate() {
  const naviagte = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteNgoSize, setDeleteNgoSize] = useState(false);
  const [selectNgoSize, setSelectNgoSize] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  // const id = router?.query?.id?.[0];
  const id = useParams();
  const isEdit = !!id;
  const { formatMessage } = useIntl();

  const [ngoSizeStatus, { isLoading }] = useUpdateOrganizationUserField2Mutation();
  const [getNgoSize, { data: dataNgoSize }] = useLazyGetUserDetailQuery();
  const ngoSize = dataNgoSize?.getUser?.listDto?.items?.[0];

  const onSubmit = async (data: NumberRangePayloadType) => {
    const resData: any = await ngoSizeStatus({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          numberRangeId: data.id,
          sizeAudience: data.sizeAudience,
        },
      },
    });

    if (resData?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The NGO Size has been successfully edited' : 'The NGO Size has been successfully added',
        { variant: 'success' },
      );

      naviagte(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  const defaultValues = {
    id: ngoSize?.organizationUserDto?.numberRange?.id as string,
    desc: ngoSize?.organizationUserDto?.numberRange?.desc as string,
    sizeAudience: AudienceEnum.Public as AudienceEnum,
  };

  const methods = useForm<NumberRangePayloadType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    if (!!id) getNgoSize({ filter: { dto: {} } });
  }, [getNgoSize, id]);

  useEffect(() => {
    if (isEdit)
      reset({
        desc: ngoSize?.organizationUserDto?.numberRange?.desc as string,
        sizeAudience: ngoSize?.organizationUserDto?.sizeAudience as AudienceEnum,
      });
  }, [ngoSize, isEdit, reset]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      naviagte(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" />
            </IconButton>
            {!isEdit
              ? formatMessage(NgoPublicDetailsMessages.addNgoSize)
              : formatMessage(NgoPublicDetailsMessages.editNgoSize)}
          </Typography>
          {!isEdit ? (
            <LoadingButton type="submit" variant="contained" disabled={!isDirty}>
              <FormattedMessage {...GeneralMessagess.add} />
            </LoadingButton>
          ) : (
            <LoadingButton type="submit" variant="contained" disabled={!isDirty}>
              <FormattedMessage {...GeneralMessagess.save} />
            </LoadingButton>
          )}
        </Stack>
        <Divider />
        {!ngoSize?.organizationUserDto?.numberRange?.id ? (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeTitle} />
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<Icon name="down-arrow" />}
              variant="contained"
              onClick={() => setSelectNgoSize(true)}
            >
              <Typography variant="button">{watch('desc') || 'NGO Size'}</Typography>
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeTitle} />
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<Icon name="down-arrow" />}
              variant="contained"
              onClick={() => setSelectNgoSize(true)}
            >
              <Typography variant="button">
                {watch('desc') ? watch('desc') : formatMessage(NgoPublicDetailsMessages.ngoSizeTitle)}
              </Typography>
            </Button>
          </Stack>
        )}
        <Divider />
        {!ngoSize?.organizationUserDto?.numberRange?.id ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              onClick={() => setSelectAudience(true)}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
            >
              <Typography color="text.primary">
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('sizeAudience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button variant="text" color="error" onClick={() => setDeleteNgoSize(true)}>
              <FormattedMessage {...GeneralMessagess.delete} />
            </Button>

            <LoadingButton
              loading={(ngoSize?.organizationUserDto?.numberRange?.id && isLoading) as boolean}
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              onClick={() => setSelectAudience(true)}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
            >
              <Typography color="text.primary">
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('sizeAudience') as AudienceEnum)]}
              </Typography>
            </LoadingButton>
          </Stack>
        )}
      </Stack>
      <BottomSheet
        open={selectNgoSize}
        onDismiss={() => setSelectNgoSize(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SizeStatus
          onChange={(value) => {
            setValue('desc', value?.desc, { shouldDirty: true });
            setValue('id', value?.id, { shouldDirty: true });
            setSelectNgoSize(false);
          }}
          sizeId={watch('id')}
        />
      </BottomSheet>
      <BottomSheet open={deleteNgoSize} onDismiss={() => setDeleteNgoSize(false)}>
        <SizeDelete />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <SizeClose
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscard(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SizeSelectAudience
          onChange={(value) => {
            setValue('sizeAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('sizeAudience') as AudienceEnum}
        />
      </BottomSheet>
    </FormProvider>
  );
}
