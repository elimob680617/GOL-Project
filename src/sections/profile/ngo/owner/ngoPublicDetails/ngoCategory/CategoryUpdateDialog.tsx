import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  ngoCategorySelector,
  ngoCategoryUpdated,
  ngoCategoryWasEmpty,
} from 'src/store/slices/profile/ngoPublicDetails-slice';
import { GroupCategoryType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, FeatureAudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function CategoryUpdateDialog() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ngoCategory = useSelector(ngoCategorySelector);
  const [upsertCategoryNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();
  const isEdit = pathname === '/profile/ngo/public-details-edit-category';
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const onSubmit = async (data: GroupCategoryType) => {
    const result: any = await upsertCategoryNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryAudience: data.categoryAudience,
          groupCategoryId: data.id,
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
      await sleep(1500);
      dispatch(ngoCategoryWasEmpty());
    }
  };
  const defaultValues = {
    ...ngoCategory,
  };
  const methods = useForm<GroupCategoryType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if ((ngoCategory?.title && !getValues().id) || (ngoCategory?.title && ngoCategory.isChange)) {
      navigate(PATH_APP.profile.ngo.publicDetails.ngoCategory.discardCategory);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoCategoryWasEmpty());
    }
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      await sleep(500);
    };
    if (!ngoCategory) {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
    fetchData();
  }, [ngoCategory, navigate]);

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handelCloseDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
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
              <IconButton onClick={handelCloseDialog}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>

            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
              </Typography>
              <Link to={PATH_APP.profile.ngo.publicDetails.ngoCategory.searchCategory}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                  {watch('title') && (
                    <img src={ngoCategory?.iconUrl} width={24} height={24} alt="" style={{ marginRight: 8 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={ngoCategory?.title ? 'text.primary' : 'text.secondary'}
                    sx={{ cursor: 'pointer' }}
                  >
                    {watch('title') || formatMessage(NgoPublicDetailsMessages.ngoCategoryTitle)}
                  </Typography>
                </Box>
              </Link>
            </Stack>

            <Divider />
            <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEdit && (
                  <Link to={PATH_APP.profile.ngo.publicDetails.ngoCategory.deleteCategory}>
                    <Button color="error">
                      <Typography variant="button">
                        <FormattedMessage {...GeneralMessagess.delete} />
                      </Typography>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outlined"
                  onClick={() => setOpenAudience(true)}
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(ngoCategory?.categoryAudience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Box>
              <Box>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!ngoCategory?.title || !(isDirty || ngoCategory.isChange)}
                >
                  {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
                </LoadingButton>
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.GroupCategory}
          value={ngoCategory?.categoryAudience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              ngoCategoryUpdated({
                ...ngoCategory,
                id: ngoCategory?.id,
                title: ngoCategory?.title,
                categoryAudience: val,
                isChange: true,
              }),
            );
          }}
        />
      )}
    </>
  );
}
