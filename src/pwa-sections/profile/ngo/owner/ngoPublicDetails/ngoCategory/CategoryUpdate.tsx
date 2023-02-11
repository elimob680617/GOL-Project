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
import { GroupCategoryType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';
import CategoryClose from './CategoryClose';
import CategoryDelete from './CategoryDelete';
import CategoryType from './CategoryType';
import SelectAudienceGroupCategory from './SelectAudienceGroupCategory';

export default function CategoryUpdate() {
  const [deleteGroupCategory, setDeleteGroupCategory] = useState(false);
  const [groupCategory, setGroupCategory] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // const id = navigate?.query?.id?.[0];
  const { id } = useParams();
  const isEdit = !!id;
  const { formatMessage } = useIntl();

  const [getCategoryType, { data: dataNgoCategory }] = useLazyGetUser2Query();
  const ngoCategory = dataNgoCategory?.getUser?.listDto?.items?.[0];

  const [updateOrganization, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  console.log('audience is:', ngoCategory);
  const onSubmit = async (data: GroupCategoryType) => {
    const result: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum?.GroupCategory,
          groupCategoryId: data?.id,
          groupCategoryAudience: data?.categoryAudience,
        },
      },
    });

    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NgoPublicDetailsMessages.ngoCategorySuccessEditAlert)
          : formatMessage(NgoPublicDetailsMessages.ngoCategorySuccessAddAlert),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  const defaultValues = {
    groupCategory: ngoCategory?.organizationUserDto?.groupCategory,
    audience: AudienceEnum.Public,
    groupCategoryId: ngoCategory?.organizationUserDto?.groupCategoryId,
    id: ngoCategory?.organizationUserDto?.id,
    organizationUserType: ngoCategory?.organizationUserDto?.organizationUserType,
  };

  const methods = useForm<GroupCategoryType>({
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
    if (!!id) getCategoryType({ filter: { dto: {} } });
  }, [getCategoryType, id]);

  useEffect(() => {
    if (isEdit)
      reset({
        categoryAudience: ngoCategory?.organizationUserDto?.groupCategoryAudience as AudienceEnum,
        id: ngoCategory?.organizationUserDto?.groupCategoryId,
        title: ngoCategory?.organizationUserDto?.groupCategory?.title || undefined,
      });
  }, [ngoCategory, isEdit, reset]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit
                ? formatMessage(NgoPublicDetailsMessages.editNgoCategory)
                : formatMessage(NgoPublicDetailsMessages.addNgoCategory)}
            </Typography>
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
            <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
            <img src={'src/assets/icons/relationshipIcon.svg'} alt="icon" width={10} height={10} />
            <Typography
              variant="body2"
              color={ngoCategory?.organizationUserDto?.groupCategory?.title ? 'text.primary' : 'text.secondary'}
              sx={{ cursor: 'pointer' }}
              onClick={() => setGroupCategory(true)}
            >
              {watch('title') ? watch('title') : formatMessage(NgoPublicDetailsMessages.ngoCategoryTitle)}
            </Typography>
          </Box>
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
                    Object.values(AudienceEnum).indexOf(watch('categoryAudience') as AudienceEnum)
                  ]
                }
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteGroupCategory(true)}>
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
                    Object.values(AudienceEnum).indexOf(watch('categoryAudience') as AudienceEnum)
                  ]
                }
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      <BottomSheet open={deleteGroupCategory} onDismiss={() => setDeleteGroupCategory(false)}>
        <CategoryDelete />
      </BottomSheet>
      <BottomSheet
        open={groupCategory}
        onDismiss={() => setGroupCategory(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <CategoryType
          onChange={(value) => {
            setValue('title', value.title, { shouldDirty: true });
            setValue('id', value.id, { shouldDirty: true });
            setGroupCategory(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceGroupCategory
          onChange={(value) => {
            setValue('categoryAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('categoryAudience') as AudienceEnum}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <CategoryClose
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
