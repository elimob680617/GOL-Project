import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useUpdateJoinAudienceMutation } from 'src/_graphql/profile/publicDetails/mutations/updateJoinAudience.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
// import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import ProfileViewPwaMessages from 'src/pwa-sections/profile/UserProfileViewPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { ngoPlaceUpdated } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { PlacePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NgoPublicDetailsMessages from './NgoPublicDetailsPwa.messages';
import SelectAudienceMain from './SelectAudienceMain';

export default function NGOPublicDetailsMainDialog() {
  const navigate = useNavigate();
  const { initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [selectAudience, setSelectAudience] = useState(false);

  const [getUser, { data: userData, isFetching: audienceIsLoading }] = useLazyGetUserDetailQuery();
  const [updateJoinAudience, { isLoading }] = useUpdateJoinAudienceMutation();
  const [updateOrganization] = useUpdateOrganizationUserField2Mutation();
  const user = userData?.getUser?.listDto?.items?.[0];
  useEffect(() => {
    getUser({ filter: { all: true } });
  }, [getUser]);

  const handleRoutingCategory = async () => {
    await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryAudience: AudienceEnum.Public,
        },
      },
    });
    navigate(PATH_APP.profile.ngo.publicDetails.ngoCategory.root);
  };

  const handleRoutingSize = async () => {
    await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          sizeAudience: AudienceEnum.Public,
        },
      },
    });
    navigate(PATH_APP.profile.ngo.publicDetails.ngoSize.root);
  };
  const handleRoutingEstablishedDate = async () => {
    await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDateAudience: AudienceEnum.Public,
        },
      },
    });
    navigate(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.root);
  };

  const handleRoutingLocation = (exp: PlacePayloadType) => {
    dispatch(ngoPlaceUpdated(exp));
    navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.root);
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
    navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.editLocation + `/${user?.organizationUserDto?.id}`);
  };

  const handelJoinAudience = async (value: AudienceEnum) => {
    setSelectAudience(false);
    const resAudi: any = await updateJoinAudience({
      filter: {
        dto: {
          joinAudience: value as AudienceEnum,
        },
      },
    });
    if (resAudi?.data?.updateJoinAudience?.isSuccess) {
      getUser({ filter: { all: true } });
      enqueueSnackbar('Audience Updated', { variant: 'success' });
    }
  };

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizardNgo') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizardNgo');
      navigate(PATH_APP.home.wizard.wizardList);
    } else {
      navigate(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <Icon name="left-arrow-1" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.publicDetailsTitle} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
        </Typography>
        {!!user?.organizationUserDto?.groupCategory ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <img
                  src={user?.organizationUserDto?.groupCategory?.iconUrl as string}
                  alt="icon"
                  width={10}
                  height={10}
                />
                <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                  {user?.organizationUserDto?.groupCategory?.title}
                </Typography>
              </Box>
              <Box>
                <Link
                  to={PATH_APP.profile.ngo.publicDetails.ngoCategory + `/${user.organizationUserDto.groupCategoryId}`}
                >
                  <IconButton>
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={handleRoutingCategory}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" />
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
        {!!user?.organizationUserDto?.numberRange ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <img src={user?.organizationUserDto?.groupCategory?.iconUrl as string} alt="" width={10} height={10} />
                <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                  {user?.organizationUserDto?.numberRange?.desc}
                </Typography>
              </Box>
              <Box>
                <Link to={PATH_APP.profile.ngo.publicDetails.ngoSize + `/${user.organizationUserDto.numberRange.id}`}>
                  <IconButton>
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={handleRoutingSize}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" />
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
        {!!user?.organizationUserDto?.establishmentDate ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                  {getMonthName(new Date(user?.organizationUserDto?.establishmentDate))},{' '}
                  {new Date(user?.organizationUserDto?.establishmentDate).getFullYear()}
                </Typography>
              </Box>
              <Box>
                <Link to={PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate + `/${user.organizationUserDto.id}`}>
                  <IconButton>
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingEstablishedDate()}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" />
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
        {!!user?.organizationUserDto?.place ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                  {/* {!!user?.organizationUserDto?.address && `${user?.organizationUserDto?.address}, `}
                  {user?.organizationUserDto?.place?.mainText} */}
                  <FormattedMessage
                    {...ProfileViewPwaMessages.ngoplaceInfo}
                    values={{
                      place: `${!!user?.organizationUserDto?.address && `${user?.organizationUserDto?.address},`} ${
                        user?.organizationUserDto?.place?.mainText
                      }`,
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
                      user?.organizationUserDto?.place as PlacePayloadType,
                      user?.organizationUserDto?.placeAudience as AudienceEnum,
                      user?.organizationUserDto?.address,
                      user?.organizationUserDto?.lat,
                      user?.organizationUserDto?.lng,
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
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" />
                <Typography color="text.primary">
                  <FormattedMessage {...NgoPublicDetailsMessages.addNgoplace} />
                </Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <>
        <Stack spacing={2} sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.joinGarden} values={{ brand: 'Garden of Love' }} />
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {user?.organizationUserDto?.joinDateTime && (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(user?.organizationUserDto?.joinDateTime))}{' '}
                {new Date(user?.organizationUserDto?.joinDateTime).getFullYear()}
              </Typography>
            )}
            <LoadingButton
              loading={audienceIsLoading || isLoading}
              onClick={() => setSelectAudience(true)}
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
            >
              <Typography color="text.primary">
                {
                  Object.keys(AudienceEnum)[
                    Object.values(AudienceEnum).indexOf(user?.organizationUserDto?.joinAudience as AudienceEnum)
                  ]
                }
              </Typography>
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider />
      </>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceMain
          value={user?.organizationUserDto?.joinAudience as AudienceEnum}
          onChange={(value) => handelJoinAudience(value)}
        />
      </BottomSheet>
    </Stack>
  );
}
