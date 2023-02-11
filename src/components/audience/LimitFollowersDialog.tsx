import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useSetAudienceMutation } from 'src/_graphql/profile/audience/mutations/setAudience.generated';
import { useLazyGetAudienceQuery } from 'src/_graphql/profile/audience/queries/getAudience.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { AudienceEnum, FeatureAudienceEnum, UserTypeEnum } from 'src/types/serverTypes';

import AudienceProfileMessages from './Audience.messages';
import DiscardDialog from './DiscardDialog';

interface LimitFollowerProp {
  open: boolean;
  discardShow: boolean;
  handleShow: React.Dispatch<
    React.SetStateAction<{
      parent: boolean;
      child: boolean;
      warning: boolean;
    }>
  >;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  feature: FeatureAudienceEnum;
  audienceType: AudienceEnum;
  onChange: (value: AudienceEnum) => void;
}
export type GetAudienceList = {
  avatarUrl?: string;
  coverUrl?: string;
  featureAudience?: FeatureAudienceEnum;
  fullName?: string;
  headline?: string;
  id?: string;
  isExceptFollowes?: boolean;
  isSpecificFollower?: boolean;
  userType?: UserTypeEnum;
};

const LimitFollowersDialog = (props: LimitFollowerProp) => {
  const { open, handleShow, feature, onClose, audienceType, onChange, discardShow } = props;
  const { formatMessage } = useIntl();
  const [followers, setFollowers] = React.useState<GetAudienceList[]>([]);
  const [followersId, setFollowersId] = React.useState<string[]>([]);
  const [searchText, setSearchText] = React.useState<string>('');
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [getAudience, { data, isFetching, currentData }] = useLazyGetAudienceQuery();
  const [setAudience, { isLoading }] = useSetAudienceMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleOnClose = () => {
    if (disabled) {
      handleShow((prev) => ({ ...prev, child: false, parent: true }));
    } else {
      handleShow((prev) => ({ ...prev, child: false, warning: true }));
    }
  };

  useEffect(() => {
    getAudience({
      filter: {
        dto: {
          featureAudience: feature,
          searchText,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature, searchText]);

  useEffect(() => {
    setFollowers(data?.getAudience?.listDto?.items as GetAudienceList[]);
  }, [data]);

  useEffect(() => {
    if (!!followers && audienceType === AudienceEnum.ExceptFollowes) {
      setFollowersId(followers?.filter((item) => !!item?.isExceptFollowes).map((item) => item?.id) as string[]);
    }
    if (!!followers && audienceType === AudienceEnum.SpecificFollowes) {
      setFollowersId(followers?.filter((item) => !!item?.isSpecificFollower).map((item) => item?.id) as string[]);
    }
  }, [audienceType, followers]);

  const handleSave = async () => {
    const res: any = await setAudience({
      filter: { dto: { audienceType, featureAudience: feature, userIds: followersId } },
    });
    if (res?.data?.setAudience?.isSuccess) {
      handleShow((prev) => ({ ...prev, child: false, parent: false }));
      onChange!(audienceType);
      onClose(false);
    } else {
      enqueueSnackbar(
        formatMessage(AudienceProfileMessages.serverErrorMessage, {
          messageKey: res?.data?.setAudience?.messagingKey,
        }),
        { variant: 'error' },
      );
    }
  };

  return (
    <>
      <Dialog fullWidth={true} open={open} keepMounted onClose={handleOnClose} sx={{ maxHeight: 730 }}>
        <DialogTitle sx={{ p: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={handleOnClose}>
                <Icon name="left-arrow-1" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...AudienceProfileMessages.selectFollowers} />
              </Typography>
            </Stack>
            <LoadingButton
              variant="primary"
              sx={{ width: 120 }}
              disabled={disabled}
              loading={isLoading}
              onClick={handleSave}
            >
              <Typography>
                <FormattedMessage {...GeneralMessagess.save} />
              </Typography>
            </LoadingButton>
          </Stack>
          <Divider />
          <Stack>
            <TextField
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ m: 2 }}
              size="small"
              name="search"
              type="text"
              placeholder={formatMessage(AudienceProfileMessages.searchFollowerPlaceholder)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon name="Research" type="solid" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 0, pb: 3 }}>
          <Stack spacing={3} pt={1}>
            {isFetching ? (
              <>
                {[...Array(currentData?.getAudience?.listDto?.count || 6)].map((item) => (
                  <Stack direction="row" spacing={2} key={item} sx={{ px: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} animation="wave" />
                    <Skeleton width={150} />
                  </Stack>
                ))}
              </>
            ) : (
              <>
                {(data?.getAudience?.listDto?.items?.length as number) > 0 ? (
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position" sx={{ gap: 3 }}>
                      {followers?.map((_user, index) => (
                        <FormControlLabel
                          key={index}
                          sx={{ pl: 2, m: 0, pr: 1, display: 'flex', justifyContent: 'space-between' }}
                          control={
                            <Checkbox
                              checked={
                                audienceType === AudienceEnum.ExceptFollowes
                                  ? !!_user.isExceptFollowes
                                  : audienceType === AudienceEnum.SpecificFollowes && !!_user.isSpecificFollower
                              }
                              onClick={() => {
                                setDisabled(false);
                                if (audienceType === AudienceEnum.ExceptFollowes) {
                                  setFollowers((prev) => {
                                    const temp = [...prev];
                                    temp.splice(index, 1, { ..._user, isExceptFollowes: !_user.isExceptFollowes });
                                    return temp;
                                  });
                                }
                                if (audienceType === AudienceEnum.SpecificFollowes) {
                                  setFollowers((prev) => {
                                    const temp = [...prev];
                                    temp.splice(index, 1, { ..._user, isSpecificFollower: !_user.isSpecificFollower });
                                    return [...temp];
                                  });
                                }
                              }}
                              sx={{ position: 'relative', left: 0 }}
                            />
                          }
                          label={
                            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                              <Avatar
                                variant={_user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
                                src={_user?.avatarUrl as string}
                              />
                              <Typography>{_user?.fullName}</Typography>
                            </Stack>
                          }
                          labelPlacement="start"
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                ) : (
                  <Stack margin="0 auto">
                    <Box
                      sx={{
                        height: 164,
                        width: 164,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        textAlign: 'center',
                        mb: 3,
                      }}
                    >
                      <Typography color="text.secondary" variant="body1">
                        <FormattedMessage {...GeneralMessagess.noResult} />
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
      {discardShow && (
        <DiscardDialog
          open={discardShow}
          isLoading={isLoading}
          handleShow={handleShow}
          handleSave={handleSave}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default LimitFollowersDialog;
