import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateRelationshipMutation } from 'src/_graphql/profile/publicDetails/mutations/updateRelationship.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { dispatch, useSelector } from 'src/store';
import {
  RelationShipCleared,
  userRelationShipSelector,
  userRelationShipUpdate,
} from 'src/store/slices/profile/userRelationShip-slice';
import { AudienceEnum, FeatureAudienceEnum, Relationship } from 'src/types/serverTypes';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function AddRelationship() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const relationShip = useSelector(userRelationShipSelector);
  const isEdit = !!relationShip?.personId;
  const [updateRelationship, { isLoading }] = useUpdateRelationshipMutation();
  const onSubmit = async (data: Relationship) => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: relationShip?.audience || data.audience,
          relationshipStatusId: data.relationshipStatus?.id,
        },
      },
    });

    if (resData?.data?.updateRelationship?.isSuccess) {
      dispatch(RelationShipCleared());
      enqueueSnackbar(
        isEdit ? 'The relationship has been successfully edited' : 'The relationship has been successfully added',
        { variant: 'success' },
      );

      navigate(PATH_APP.profile.user.publicDetails.root);
    }
  };

  const defaultValues = {
    personId: relationShip?.personId,
    audience: relationShip?.audience,
    relationshipStatus: relationShip?.relationshipStatus,
  };
  const methods = useForm<Relationship>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    // eslint-disable-next-line no-empty-pattern
    formState: {},
  } = methods;

  const handelCloseDialog = () => {
    if (
      (relationShip?.relationshipStatus?.title && !getValues().personId) ||
      (relationShip?.relationshipStatus?.title && relationShip?.isChange)
    ) {
      navigate(PATH_APP.profile.user.publicDetails.relationship.discard);
    } else {
      dispatch(userRelationShipUpdate({ audience: AudienceEnum.Public }));
      navigate(PATH_APP.profile.user.publicDetails.root);
    }
  };

  useEffect(() => {
    if (!relationShip) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [relationShip, navigate]);

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
                    ? formatMessage(NormalPublicDetailsMessages.editRelationshipStatus)
                    : formatMessage(NormalPublicDetailsMessages.addRelationshipStatus)}
                </Typography>
              </Box>
              <IconButton onClick={handelCloseDialog}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.relationshipStatus} />
              </Typography>

              <Link
                to={PATH_APP.profile.user.publicDetails.relationship.relationshipStatus}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  color="inherit"
                  size="large"
                  variant="outlined"
                  sx={{ borderColor: 'text.disabled' }}
                  endIcon={<Icon name="down-arrow" color="text.primary" />}
                >
                  <Typography color="text.primary" variant="button">
                    {relationShip?.relationshipStatus?.title
                      ? relationShip?.relationshipStatus?.title
                      : formatMessage(NormalPublicDetailsMessages.relationship).toLowerCase()}
                  </Typography>
                </Button>
              </Link>
            </Stack>
            <Divider />

            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ px: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box>
                  {isEdit && (
                    <Link
                      to={PATH_APP.profile.user.publicDetails.relationship.delete}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button color="error">
                        <Typography variant="button">
                          <FormattedMessage {...GeneralMessagess.delete} />
                        </Typography>
                      </Button>
                    </Link>
                  )}
                </Box>
                <Box>
                  {/* <Link to={PATH_APP.profile.user.publicDetails.relationship.audience} style={{ textDecoration: 'none' }}> */}
                  <Button
                    variant="outlined"
                    startIcon={<Icon name="Earth" color="text.primary" />}
                    endIcon={<Icon name="down-arrow" color="text.primary" />}
                    onClick={() => {
                      setOpenAudience(true);
                    }}
                  >
                    <Typography color="text.primary">
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(relationShip?.audience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                  {/* </Link> */}
                </Box>
              </Box>

              <Box>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!relationShip?.relationshipStatus?.title || !relationShip?.isChange}
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
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.Relationship}
          value={relationShip?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(userRelationShipUpdate({ ...relationShip, audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}

export default AddRelationship;
