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
import { useLazyGetUser2Query } from 'src/_graphql/profile/users/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { AudienceEnum, OrgUserFieldEnum, OrganizationUser } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';
import EstablishedDate from './EstablishedDate';
import EstablishmentDelete from './EstablishedDelete';
import EstablishmentDiscard from './EstablishmentDiscard';
import SelectAudienceEstablishedDate from './SelectAudienceEstablishedDate';

export default function EstablishedDateUpdate() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const id = navigate?.query?.id?.[0];
  const { id } = useParams();
  const isEdit = !!id;
  const [deleteEstablishmentDate, setDeleteEstablishmentDate] = useState(false);
  const [establishmentDate, setEstablishmentDate] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const { formatMessage } = useIntl();

  const [getEstablishmentDate, { data: dataNgoEstablishmentDate }] = useLazyGetUser2Query();
  const ngoEstablishmentDate = dataNgoEstablishmentDate?.getUser?.listDto?.items?.[0];

  const [upsertEstablishmentDateNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  const onSubmit = async (data: OrganizationUser) => {
    const EstablishedDateNgo = new Date(data.establishmentDate);
    const result: any = await upsertEstablishmentDateNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum?.EstablishmentDate,
          establishmentDate:
            EstablishedDateNgo.getFullYear() + '-' + ('0' + (EstablishedDateNgo.getMonth() + 1)).slice(-2) + '-01',
          establishmentDateAudience: data?.establishmentDateAudience,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NgoPublicDetailsMessages.ngoDateSuccessEditAlert)
          : formatMessage(NgoPublicDetailsMessages.ngoDateSuccessAddAlert),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  const defaultValues = {
    establishmentDateAudience: AudienceEnum.Public,
    establishmentDate: ngoEstablishmentDate?.organizationUserDto?.establishmentDate,
  };
  const methods = useForm<OrganizationUser>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  useEffect(() => {
    if (!!id) getEstablishmentDate({ filter: { dto: {} } });
  }, [getEstablishmentDate, id]);

  useEffect(() => {
    if (isEdit)
      reset({
        establishmentDate: ngoEstablishmentDate?.organizationUserDto?.establishmentDate,
        establishmentDateAudience: ngoEstablishmentDate?.organizationUserDto?.establishmentDateAudience,
      });
  }, [ngoEstablishmentDate, isEdit, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" />
            </IconButton>
            {isEdit ? (
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.editNgoEstablishmentDate} />
              </Typography>
            ) : (
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.addNgoEstablishmentDate} />
              </Typography>
            )}
          </Box>

          <Box>
            <LoadingButton loading={isLoading} type="submit" color="primary" variant="contained" disabled={!isDirty}>
              {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
            </LoadingButton>
          </Box>
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
          </Typography>
          {watch('establishmentDate') ? (
            <Typography
              variant="body2"
              color={ngoEstablishmentDate?.organizationUserDto?.establishmentDate ? 'text.primary' : 'text.secondary'}
              sx={{ cursor: 'pointer' }}
            >
              {getMonthName(new Date(watch('establishmentDate')))}, {new Date(watch('establishmentDate')).getFullYear()}
              <IconButton
                onClick={() => {
                  setValue('establishmentDate', undefined, { shouldDirty: true });
                }}
                sx={{ ml: 1 }}
              >
                &#215;
              </IconButton>
            </Typography>
          ) : (
            <Box onClick={() => setEstablishmentDate(true)}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
              </Typography>
            </Box>
          )}
        </Stack>
        <Divider />
        {!isEdit ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color="text.primary">
                {
                  Object.keys(AudienceEnum)[
                    Object.values(AudienceEnum).indexOf(watch('establishmentDateAudience') as AudienceEnum)
                  ]
                }
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteEstablishmentDate(true)}>
              <Typography variant="button">
                <FormattedMessage {...GeneralMessagess.delete} />
              </Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color="text.primary">
                {
                  Object.keys(AudienceEnum)[
                    Object.values(AudienceEnum).indexOf(watch('establishmentDateAudience') as AudienceEnum)
                  ]
                }
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      <BottomSheet open={deleteEstablishmentDate} onDismiss={() => setDeleteEstablishmentDate(false)}>
        <EstablishmentDelete />
      </BottomSheet>
      <BottomSheet
        open={establishmentDate}
        onDismiss={() => setEstablishmentDate(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <EstablishedDate
          onChange={(value) => {
            setValue('establishmentDate', value, { shouldDirty: true });
            setEstablishmentDate(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceEstablishedDate
          onChange={(value) => {
            setValue('establishmentDateAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('establishmentDateAudience') as AudienceEnum}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <EstablishmentDiscard
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscard(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
    </FormProvider>
  );
}
