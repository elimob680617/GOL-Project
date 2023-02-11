import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateJoinAudienceMutation } from 'src/_graphql/profile/publicDetails/mutations/updateJoinAudience.generated';
import { useLazyGetLocationQuery } from 'src/_graphql/profile/publicDetails/queries/getLocation.generated';
import { useLazyGetPersonCollegesQuery } from 'src/_graphql/profile/publicDetails/queries/getPersonColleges.generated';
import { useLazyGetPersonSchoolsQuery } from 'src/_graphql/profile/publicDetails/queries/getPersonSchools.generated';
import { useLazyGetRelationshipQuery } from 'src/_graphql/profile/publicDetails/queries/getRelationship.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { userCollegeUpdated } from 'src/store/slices/profile/userColloges-slice';
import { userLocationUpdated } from 'src/store/slices/profile/userLocation-slice';
import { userRelationShipUpdate } from 'src/store/slices/profile/userRelationShip-slice';
import { userSchoolUpdated } from 'src/store/slices/profile/userSchool-slice';
import { userUniversityUpdated } from 'src/store/slices/profile/userUniversity-slice';
import { LocationType } from 'src/types/profile/publicDetails';
import { UserCollegeType } from 'src/types/profile/userColleges';
import { UserSchoolType } from 'src/types/profile/userSchools';
import { AudienceEnum, InstituteTypeEnum, Location, LocationTypeEnum, Relationship } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NormalPublicDetailsMessages from './NormalPublicDetailsPwa.messages';
import SelectAudienceMain from './SelectAudienceMain';

export default function PublicDetailsMain() {
  const navigate = useNavigate();
  const { initialize } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [selectAudience, setSelectAudience] = useState(false);
  const [updateJoinAudience, { isLoading }] = useUpdateJoinAudienceMutation();

  //Query Services
  const [getPersonSchools, { data: personSchools, isFetching: schoolFetching }] = useLazyGetPersonSchoolsQuery();
  const [getPersonCollege, { data: personColleges, isFetching: collegeFetching }] = useLazyGetPersonCollegesQuery();
  const [getPersonUniversity, { data: personUniversities, isFetching: universityFetching }] =
    useLazyGetPersonCollegesQuery();
  const [getUser, { data: userData, isFetching: audienceIsLoading }] = useLazyGetUserDetailQuery();

  const [getRelationShips, { data: relationshipData, isFetching: loadingGetRelationship }] =
    useLazyGetRelationshipQuery();
  const [getCurrentCity, { data: currentCityData, isFetching }] = useLazyGetLocationQuery();

  const [getHomeTown, { data: homeTownData, isFetching: homeTownFetching }] = useLazyGetLocationQuery();

  useEffect(() => {
    getUser({ filter: { all: true } });
    getPersonSchools({ filter: { all: true } });
    getPersonCollege({ filter: { dto: { instituteType: InstituteTypeEnum.College } } });
    getPersonUniversity({ filter: { dto: { instituteType: InstituteTypeEnum.University } } });
    getRelationShips({ filter: { all: true } });
    getCurrentCity({ filter: { dto: { id: null, locationType: LocationTypeEnum.CurrnetCity } } });
    getHomeTown({ filter: { dto: { id: null, locationType: LocationTypeEnum.Hometown } } });
  }, [getCurrentCity, getHomeTown, getPersonCollege, getPersonSchools, getPersonUniversity, getRelationShips, getUser]);

  const handleEditCity = (city: Location) => {
    dispatch(userLocationUpdated(city));
    navigate(PATH_APP.profile.user.publicDetails.currentCity.edit);
  };
  const handleEditHomeTown = (city: Location) => {
    dispatch(userLocationUpdated(city));
    navigate(PATH_APP.profile.user.publicDetails.homeTown.edit);
  };
  const handleEditRelationship = (rel: Relationship) => {
    dispatch(userRelationShipUpdate(rel));
    navigate(PATH_APP.profile.user.publicDetails.relationship.edit);
  };

  //EditHandler
  const handleEditCollege = (currentCollege: UserCollegeType) => {
    dispatch(userCollegeUpdated(currentCollege));
    navigate(PATH_APP.profile.user.publicDetails.college.edit);
  };

  const handleEditSchool = (currentSchool: UserSchoolType) => {
    dispatch(userSchoolUpdated(currentSchool));
    navigate(PATH_APP.profile.user.publicDetails.school.edit);
  };

  const handleEditUniversity = (currentUni: UserCollegeType) => {
    dispatch(userUniversityUpdated(currentUni));
    navigate(PATH_APP.profile.user.publicDetails.university.edit);
  };

  const handleRoutingCurrentCity = (exp: LocationType) => {
    dispatch(userLocationUpdated(exp));
    navigate(PATH_APP.profile.user.publicDetails.currentCity.add);
  };
  const handleRoutingHomeTown = (exp: LocationType) => {
    dispatch(userLocationUpdated(exp));
    navigate(PATH_APP.profile.user.publicDetails.homeTown.add);
  };
  const handleRoutingRelationship = (exp: Relationship) => {
    dispatch(userRelationShipUpdate(exp));
    navigate(PATH_APP.profile.user.publicDetails.relationship.add);
  };
  const handleRoutingSchool = (school: UserSchoolType) => {
    dispatch(userSchoolUpdated(school));
    navigate(PATH_APP.profile.user.publicDetails.school.add);
  };
  const handleRoutingCollege = (college: UserCollegeType) => {
    dispatch(userCollegeUpdated(college));
    navigate(PATH_APP.profile.user.publicDetails.college.add);
  };
  const handleRoutingUni = (Uni: UserCollegeType) => {
    dispatch(userUniversityUpdated(Uni));
    navigate(PATH_APP.profile.user.publicDetails.university.add);
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

  const user = userData?.getUser?.listDto?.items?.[0];
  // handle close main list and go to profile/user or wizard lis
  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizard');
      navigate(PATH_APP.profile.user.wizard.wizardList);
    } else {
      navigate(PATH_APP.profile.user.root);
    }
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.publicDetailsTitle} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...NormalPublicDetailsMessages.education} />
        </Typography>
        <Stack spacing={1}>
          {!!personSchools?.getPersonSchools?.listDto?.items?.length && (
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.highSchool} />
            </Typography>
          )}
          {
            schoolFetching && <CircularProgress size={20} />
            //<LinearProgress/>
          }
          {personSchools?.getPersonSchools?.listDto?.items?.map((school: any) => (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              key={school?.school?.id}
            >
              <Stack direction="row" spacing={1} alignItems="center" key={school?.school?.id}>
                <Icon name="image" size={18} />
                <Typography variant="body2" color="text.primary" key={school?.school?.id}>
                  <FormattedMessage
                    {...NormalPublicDetailsMessages.schoolInfo}
                    values={{
                      school: school?.school?.title,
                      Typography: (str) => (
                        <Typography variant="subtitle2" color="text.primary" component="span">
                          {str}
                        </Typography>
                      ),
                    }}
                  />
                </Typography>
              </Stack>
              <Box>
                <IconButton onClick={() => handleEditSchool(school)}>
                  <Icon name="Edit-Pen" color="text.primary" />
                </IconButton>
              </Box>
            </Stack>
          ))}
        </Stack>
        {/* <Link href="/profile/add-highSchool" passHref> */}
        <Button
          variant="outlined"
          onClick={() => handleRoutingSchool({ audience: AudienceEnum.Public })}
          sx={{
            borderColor: 'text.secondary',
            '&:active': {
              borderColor: 'text.secondary',
            },
          }}
        >
          <Icon name="Plus" color="text.primary" />
          <Typography color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.addSchool} />
          </Typography>
        </Button>
        {/* </Link> */}
        <Stack spacing={1}>
          {!!personColleges?.getPersonColleges?.listDto?.items?.length && (
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.college} />
            </Typography>
          )}
          {collegeFetching && <CircularProgress size={20} />}
          {personColleges?.getPersonColleges?.listDto?.items?.map((college) => (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              key={college?.collegeDto?.id}
            >
              <Stack direction="row" spacing={1} key={college?.collegeDto?.id}>
                <Icon name="image" size={18} />
                <Typography variant="body2" color="text.primary" key={college?.collegeDto?.id}>
                  <FormattedMessage
                    {...NormalPublicDetailsMessages.collegeInfo}
                    values={{
                      college: college?.collegeDto?.name,
                      concentration: college?.concentrationDto?.title,
                      Typography: (str) => (
                        <Typography variant="subtitle2" color="text.primary" component="span">
                          {str}
                        </Typography>
                      ),
                    }}
                  />
                </Typography>
              </Stack>
              <Box onClick={() => handleEditCollege(college as UserCollegeType)}>
                <IconButton>
                  <Icon name="Edit-Pen" color="text.primary" />
                </IconButton>
              </Box>
            </Stack>
          ))}
        </Stack>
        {/* <Link href="/profile/add-collage" passHref> */}
        <Button
          variant="outlined"
          onClick={() => handleRoutingCollege({ audience: AudienceEnum.Public })}
          sx={{
            borderColor: 'text.secondary',
            '&:active': {
              borderColor: 'text.secondary',
            },
          }}
        >
          <Icon name="Plus" color="text.primary" />
          <Typography color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.addCollege} />
          </Typography>
        </Button>
        {/* </Link> */}
        <Stack spacing={1}>
          {!!personUniversities?.getPersonColleges?.listDto?.items?.length && (
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.university} />
            </Typography>
          )}
          {universityFetching && <CircularProgress size={20} />}
          {personUniversities?.getPersonColleges?.listDto?.items?.map((university) => (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              key={university?.collegeDto?.id}
            >
              <Stack direction="row" spacing={1} key={university?.collegeDto?.id}>
                <Icon name="image" size={18} />
                <Typography variant="body2" color="text.primary" key={university?.collegeDto?.id}>
                  <FormattedMessage
                    {...NormalPublicDetailsMessages.collegeInfo}
                    values={{
                      university: university?.collegeDto?.name,
                      concentration: university?.concentrationDto?.title,
                      Typography: (str) => (
                        <Typography variant="subtitle2" color="text.primary" component="span">
                          {str}
                        </Typography>
                      ),
                    }}
                  />
                </Typography>

                {/* <Typography variant="subtitle2" color="text.primary" key={university?.collegeDto?.id} noWrap={true} sx={{overflow:'hidden', width:'200px'}}>
                    at {university?.collegeDto?.name}
                  </Typography> */}
              </Stack>
              <IconButton onClick={() => handleEditUniversity(university as any)}>
                <Icon name="Edit-Pen" color="text.primary" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        {/* <Link href="/profile/add-university" passHref> */}
        <Button
          variant="outlined"
          onClick={() => handleRoutingUni({ audience: AudienceEnum.Public })}
          sx={{
            borderColor: 'text.secondary',
            '&:active': {
              borderColor: 'text.secondary',
            },
          }}
        >
          <Icon name="Plus" color="text.primary" />
          <Typography color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.addUniversity} />
          </Typography>
        </Button>
        {/* </Link> */}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...NormalPublicDetailsMessages.currentCity} />
        </Typography>
        {!!currentCityData?.getLocation?.listDto?.items?.length ? (
          currentCityData?.getLocation?.listDto?.items?.map((city) => (
            <Box key={city?.city?.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                  <Icon name="image" size={18} />
                  <Typography variant="body2" color="text.primary" component="span">
                    <FormattedMessage
                      {...NormalPublicDetailsMessages.currentCityInfo}
                      values={{
                        currentCity: city?.city?.name,
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
                  <IconButton onClick={() => handleEditCity(city as Location)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingCurrentCity({ audience: AudienceEnum.Public })}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {isFetching ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" color="text.primary" />
                <Typography color="text.primary">
                  <FormattedMessage {...NormalPublicDetailsMessages.addCurrentCity} />
                </Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...NormalPublicDetailsMessages.homeTown} />
        </Typography>
        {!!homeTownData?.getLocation?.listDto?.items?.length ? (
          homeTownData?.getLocation?.listDto?.items?.map((city) => (
            <Box key={city?.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                  <Icon name="image" size={18} />
                  <Typography variant="body2" color="text.primary" component="span" sx={{ mr: 1 }}>
                    <FormattedMessage
                      {...NormalPublicDetailsMessages.homeTownInfo}
                      values={{
                        homeTown: city?.city?.name,
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
                  <IconButton onClick={() => handleEditHomeTown(city as Location)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingHomeTown({ audience: AudienceEnum.Public })}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {homeTownFetching ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" color="text.primary" />
                <Typography color="text.primary">
                  <FormattedMessage {...NormalPublicDetailsMessages.addHomeTown} />
                </Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...NormalPublicDetailsMessages.relationship} />
        </Typography>
        {!!relationshipData?.getRelationship?.listDto?.items?.length ? (
          relationshipData?.getRelationship?.listDto?.items?.map((rel) => (
            <Box key={rel?.relationshipStatus?.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                  <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                    {rel?.relationshipStatus?.title}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEditRelationship(rel as Relationship)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingRelationship({ audience: AudienceEnum.Public })}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {loadingGetRelationship ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Icon name="Plus" color="text.primary" />
                <Typography color="text.primary">
                  <FormattedMessage {...NormalPublicDetailsMessages.addRelationship} />
                </Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <>
        <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.joinGarden} values={{ brand: 'Garden of Love' }} />
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {user?.personDto?.joinDateTime && (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(user?.personDto?.joinDateTime))}{' '}
                {new Date(user?.personDto?.joinDateTime).getFullYear()}
              </Typography>
            )}
            <LoadingButton
              loading={audienceIsLoading || isLoading}
              onClick={() => setSelectAudience(true)}
              variant="outlined"
              startIcon={<Icon name="Earth" size="18" color="text.primary" />}
              endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
            >
              <Typography color={theme.palette.text.primary}>
                {
                  Object.keys(AudienceEnum)[
                    Object.values(AudienceEnum).indexOf(user?.personDto?.joinAudience as AudienceEnum)
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
          value={user?.personDto?.joinAudience as AudienceEnum}
          onChange={(value) => handelJoinAudience(value)}
        />
      </BottomSheet>
    </Stack>
  );
}
