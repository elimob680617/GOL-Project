import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import companyLogo from 'src/assets/companylogo/Vector.png';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileViewMessages from 'src/sections/profile/UserProfileView.messages';
import { useDispatch } from 'src/store';
import {
  ngoCategoryUpdated,
  ngoEstablishmentDateUpdated,
  ngoPlaceUpdated,
  ngoSizeUpdated,
} from 'src/store/slices/profile/ngoPublicDetails-slice';
import {
  EstablishmentdDatePayloadType,
  GroupCategoryPayloadType,
  NumberRangePayloadType,
  PlacePayloadType,
} from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, FeatureAudienceEnum, NumberRange, OrgUserFieldEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NgoPublicDetailsMessages from './NgoPublicDetails.messages';

export default function NGOPublicDetailsMainDialog() {
  const navigate = useNavigate();
  const { initialize } = useAuth();
  const dispatch = useDispatch();
  const [upsertPublicAudienceNgoUser] = useUpdateOrganizationUserField2Mutation();
  const [getNgo, { data: ngoData, isFetching }] = useLazyGetUserDetailQuery();
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    getNgo({ filter: { all: true } });
  }, [getNgo]);
  const handleEditCategory = (category: GroupCategoryPayloadType, audience: AudienceEnum) => {
    dispatch(ngoCategoryUpdated({ ...category, categoryAudience: audience }));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoCategory.editCategory);
  };
  const handleEditSize = (Size: NumberRange, audience: AudienceEnum) => {
    dispatch(ngoSizeUpdated({ ...Size, sizeAudience: audience, desc: size?.desc as string }));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoSize.editSize);
  };
  const handleEditEstablishedDate = (date: Date, audience: AudienceEnum) => {
    dispatch(ngoEstablishmentDateUpdated({ establishmentDate: new Date(date), establishmentDateAudience: audience }));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.editDate);
  };
  const handleEditLocation = (
    location: PlacePayloadType,
    audience: AudienceEnum,
    address: string | null | undefined,
    lat: number | null | undefined,
    lng: number | null | undefined,
  ) => {
    dispatch(
      ngoPlaceUpdated({
        ...location,
        placeAudience: audience,
        address: address as string,
        lat,
        lng,
        description: location.description as string,
      }),
    );
    navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.editLocation);
  };
  const handleRoutingCategory = (exp: GroupCategoryPayloadType) => {
    dispatch(ngoCategoryUpdated(exp));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoCategory.root);
  };
  const handleRoutingSize = (exp: NumberRangePayloadType) => {
    dispatch(ngoSizeUpdated(exp));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoSize.root);
  };
  const handleRoutingEstablishedDate = (exp: EstablishmentdDatePayloadType) => {
    dispatch(ngoEstablishmentDateUpdated(exp));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.root);
  };
  const handleRoutingLocation = (exp: PlacePayloadType) => {
    dispatch(ngoPlaceUpdated(exp));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.root);
  };
  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        navigate(PATH_APP.home.wizard.wizardList);
      } else {
        navigate(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      navigate(PATH_APP.profile.ngo.root);
    }
  }

  const currentNGO = ngoData?.getUser?.listDto?.items?.[0];
  const category = currentNGO?.organizationUserDto?.groupCategory;
  const size = currentNGO?.organizationUserDto?.numberRange;
  const locatedIn = currentNGO?.organizationUserDto?.place;

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleClose}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.publicDetailsTitle} />
              </Typography>
            </Stack>
            <IconButton sx={{ p: 0 }} onClick={handleClose}>
              <Icon name="Close-1" />
            </IconButton>
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
            </Typography>
            {!!category ? (
              <Box key={category?.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <img src={(category?.iconUrl as string) || companyLogo} alt="categoryIcon" />
                    <Typography component="span" variant="body2">
                      {category?.title}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleEditCategory(
                          currentNGO?.organizationUserDto?.groupCategory as GroupCategoryPayloadType,
                          currentNGO?.organizationUserDto?.groupCategoryAudience as AudienceEnum,
                        )
                      }
                    >
                      <Icon name="Edit-Pen" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleRoutingCategory({ categoryAudience: AudienceEnum.Public })}
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...NgoPublicDetailsMessages.addNgoCategory} />
                    </Typography>
                  </>
                )}
              </Button>
            )}
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeTitle} />
            </Typography>
            {!!size ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <Typography component="span" variant="subtitle2">
                      {size?.desc}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleEditSize(
                          currentNGO?.organizationUserDto?.numberRange as NumberRange,
                          currentNGO?.organizationUserDto?.sizeAudience as AudienceEnum,
                        )
                      }
                    >
                      <Icon name="Edit-Pen" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleRoutingSize({ sizeAudience: AudienceEnum.Public })}
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...NgoPublicDetailsMessages.addNgoSize} />
                    </Typography>
                  </>
                )}
              </Button>
            )}
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
            </Typography>
            {!!currentNGO?.organizationUserDto?.establishmentDate ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.primary" component="span">
                      {getMonthName(new Date(currentNGO?.organizationUserDto.establishmentDate))},{' '}
                      {new Date(currentNGO?.organizationUserDto.establishmentDate).getFullYear()}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleEditEstablishedDate(
                          currentNGO?.organizationUserDto?.establishmentDate as Date,
                          currentNGO?.organizationUserDto?.establishmentDateAudience as AudienceEnum,
                        )
                      }
                    >
                      <Icon name="Edit-Pen" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleRoutingEstablishedDate({ establishmentDateAudience: AudienceEnum.Public })}
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...NgoPublicDetailsMessages.addNgoEstablishmentDate} />
                    </Typography>
                  </>
                )}
              </Button>
            )}
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoplaceTitle} />
            </Typography>
            {!!locatedIn ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 2 }}>
                    <Icon name="Company-Logo-Empty" />
                    <Typography variant="body2" color="text.primary" component="span">
                      <FormattedMessage
                        {...NormalAndNgoProfileViewMessages.ngoplaceInfo}
                        values={{
                          place: `${
                            !!currentNGO?.organizationUserDto?.address && `${currentNGO?.organizationUserDto?.address},`
                          } ${currentNGO?.organizationUserDto?.place?.description}`,
                          Typography: (str) => (
                            <Typography variant="subtitle2" color="text.primary" component="span" ml={1}>
                              {str}
                            </Typography>
                          ),
                        }}
                      />
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleEditLocation(
                          currentNGO?.organizationUserDto?.place as PlacePayloadType,
                          currentNGO?.organizationUserDto?.placeAudience as AudienceEnum,
                          currentNGO?.organizationUserDto?.address,
                          currentNGO?.organizationUserDto?.lat,
                          currentNGO?.organizationUserDto?.lng,
                        )
                      }
                    >
                      <Icon name="Edit-Pen" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleRoutingLocation({ placeAudience: AudienceEnum.Public })}
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...NgoPublicDetailsMessages.addNgoplace} />
                    </Typography>
                  </>
                )}
              </Button>
            )}
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.joinGarden} values={{ brand: 'Garden of Love' }} />
            </Typography>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              {currentNGO?.organizationUserDto?.joinDateTime && (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(currentNGO?.organizationUserDto?.joinDateTime))}{' '}
                  {new Date(currentNGO?.organizationUserDto?.joinDateTime).getFullYear()}
                </Typography>
              )}

              <Box sx={{ position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', top: '50%' }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenAudience(true)}
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(
                          currentNGO?.organizationUserDto?.joinAudience as AudienceEnum,
                        )
                      ]
                    }
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Stack>
          <Divider />
        </Stack>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.JoinDate}
          value={currentNGO?.organizationUserDto?.joinAudience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={async (val: any) => {
            const resAudi: any = await upsertPublicAudienceNgoUser({
              filter: {
                dto: {
                  field: OrgUserFieldEnum.JoinDateAudience,
                  joinAudience: val,
                },
              },
            });
            if (resAudi?.data?.updateOrganizationUserField?.isSuccess) {
              enqueueSnackbar('Join Audience Updated', { variant: 'success' });
              navigate(-1);
            }
          }}
        />
      )}
    </>
  );
}
