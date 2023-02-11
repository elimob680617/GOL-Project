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
import { ngoSizeSelector, ngoSizeUpdated, ngoSizeWasEmpty } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { NumberRangePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, FeatureAudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function SizeUpdateDialog() {
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const ngoSize = useSelector(ngoSizeSelector);
  const dispatch = useDispatch();
  const [upsertSizeNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();
  const isEdit = pathname === '/profile/ngo/public-details-edit-size';
  // const isEdit = navigate.asPath === '/profile/ngo/public-details-edit-size/';

  const onSubmit = async (data: NumberRangePayloadType) => {
    const resData: any = await upsertSizeNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          sizeAudience: data.sizeAudience,
          numberRangeId: data.id,
        },
      },
    });
    if (resData?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NgoPublicDetailsMessages.ngoSizeSuccessEditAlert)
          : formatMessage(NgoPublicDetailsMessages.ngoSizeSuccessAddAlert),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(1500);
      dispatch(ngoSizeWasEmpty());
    }
  };

  const defaultValues = {
    ...ngoSize,
  };
  const methods = useForm<NumberRangePayloadType>({
    defaultValues,
    mode: 'onChange',
  });

  const { getValues, handleSubmit, watch } = methods;

  const handelCloseDialog = async () => {
    if ((ngoSize?.desc && !getValues().id) || (ngoSize?.desc && ngoSize?.isChange)) {
      navigate(PATH_APP.profile.ngo.publicDetails.ngoSize.discardSize);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoSizeWasEmpty());
    }
  };

  useLayoutEffect(() => {
    if (!ngoSize) navigate(PATH_APP.profile.ngo.publicDetails.main);
  }, [ngoSize, navigate]);

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={() => handelCloseDialog()}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit
                    ? formatMessage(NgoPublicDetailsMessages.editNgoSize)
                    : formatMessage(NgoPublicDetailsMessages.addNgoSize)}
                </Typography>
              </Box>
              <IconButton onClick={handelCloseDialog}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeTitle} />
              </Typography>
              <Link to={PATH_APP.profile.ngo.publicDetails.ngoSize.selectSize}>
                <Button
                  color="primary"
                  size="large"
                  variant="contained"
                  sx={{ borderColor: 'text.disabled' }}
                  startIcon={<Icon name="down-arrow" color="common.white" />}
                >
                  <Typography color="common.white" variant="button">
                    {watch('desc') ? watch('desc') : formatMessage(NgoPublicDetailsMessages.ngoSizeTitle)}
                  </Typography>
                </Button>
              </Link>
            </Stack>
            <Divider />

            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ px: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box>
                  {isEdit && (
                    <Link to={PATH_APP.profile.ngo.publicDetails.ngoSize.deleteSize}>
                      <Button color="error">
                        <Typography variant="button">
                          <FormattedMessage {...GeneralMessagess.delete} />
                        </Typography>
                      </Button>
                    </Link>
                  )}
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Icon name="Earth" />}
                    onClick={() => setOpenAudience(true)}
                    endIcon={<Icon name="down-arrow" />}
                  >
                    <Typography color="text.primary">
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(ngoSize?.sizeAudience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Box>
              </Box>

              <Box>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!ngoSize?.desc || !ngoSize?.isChange}
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
          feature={FeatureAudienceEnum.Size}
          value={ngoSize?.sizeAudience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              ngoSizeUpdated({
                ...ngoSize,
                sizeAudience: val,
                isChange: true,
              }),
            );
          }}
        />
      )}
    </>
  );
}
