// @mui
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetUserQuery } from 'src/_graphql/post/create-post/queries/getUserQuery.generated';
import PeopleNotFound from 'src/assets/images/notfound/peopleNotFound.svg';
//icon
import { Icon } from 'src/components/Icon';
import NotFound from 'src/components/notFound/NotFound';
import useAuth from 'src/hooks/useAuth';
import useDebounce from 'src/hooks/useDebounce';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { basicSendPostSelector, resetSendPost } from 'src/store/slices/post/sendPost';
import { SURFACE } from 'src/theme/palette';
import { FilterByEnum, UserTypeEnum } from 'src/types/serverTypes';

import SendPostMessages from './SendPost.messages';
import SendPostToUsers from './SendPostToUsers';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  // height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

// interface IUser {
//   id: string;
//   fullName?: string | null | undefined;
//   avatarUrl?: string | null | undefined;
//   userName?: string | null | undefined;
//   headLine?: string | null | undefined;
//   userType?: UserTypeEnum | null | undefined;
// }

// interface IFollower {
//   connectionId?: any;
//   itemId?: any;
//   firstName?: string | null | undefined;
//   lastName?: string | null | undefined;
//   fullName?: string | null | undefined;
//   headline?: string | null | undefined;
//   avatarUrl?: string | null | undefined;
//   itemType?: any;
// }

function SendToConnectionsDialog() {
  const { user } = useAuth();
  const back = useNavigate();
  const push = useNavigate();
  const [searchedText, setSearchedText] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchedText, 500);
  const dispatch = useDispatch();
  const ID = user?.id;
  const postSent = useSelector(basicSendPostSelector);
  const [getUsers, { isFetching: isFetchingUsers, data: usersData }] = useLazyGetUserQuery();
  const [getFollowers, { data: followersData, isFetching: isFetchingFollower }] = useLazyGetFollowersQuery();
  const followers = followersData?.getFollowers?.listDto?.items;
  const users = usersData?.getUserQuery?.listDto?.items;

  useEffect(() => {
    getFollowers({
      filter: { dto: { filterBy: FilterByEnum.All, searchText: '', userId: ID } },
    });
  }, [ID, getFollowers]);

  useEffect(() => {
    getFollowers({
      filter: { dto: { searchText: debouncedValue } },
    });
  }, [debouncedValue, getFollowers]);

  useEffect(() => {
    getUsers({ filter: { dto: { searchText: debouncedValue } } });
  }, [debouncedValue, getUsers]);

  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  const convertSlateValueToText = () => {
    let text = '';
    postSent?.text?.forEach((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        item.children.forEach((obj: any) => {
          if (obj.type) {
            // obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
            switch (obj.type) {
              case 'tag':
                listOfTag.push(obj.id);
                break;
              case 'mention':
                listOfMention.push(obj.id);
                break;
              default:
                break;
            }
          }
          obj.text
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title} `)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
        });
      if (index + 1 !== postSent?.text?.length) text += ' \\n';
    });
    return text;
  };

  useEffect(() => {
    if (!postSent) back(-1);
  }, [back, postSent]);

  return (
    <>
      <Dialog
        fullWidth={true}
        keepMounted
        open={true}
        onClose={() => {
          push(PATH_APP.home.index);
          dispatch(resetSendPost());
        }}
      >
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={2} direction="row" alignItems="center">
              <IconButton onClick={() => back(-1)} sx={{ padding: 0 }}>
                <Icon name="left-arrow-1" color="grey.500" type="linear" />
              </IconButton>
              <Typography variant="subtitle1" color={SURFACE.onSurface}>
                Send to
                <FormattedMessage {...SendPostMessages.sendTo} />
              </Typography>
            </Stack>

            <IconButton
              onClick={() => {
                back(-1);
                // router.push(PATH_APP.home.index);
                // dispatch(resetSendPost());
              }}
              sx={{ padding: 0 }}
            >
              <Icon name="Close" color="grey.500" type="linear" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ minHeight: 600, alignItems: 'center' }}>
          <Stack spacing={3} sx={{ mt: 3 }} justifyContent="center">
            <Box sx={{ width: '100%' }}>
              <TextField
                value={searchedText}
                onChange={(e) => setSearchedText(e.target.value)}
                fullWidth
                size="small"
                placeholder="Search for People and NGO"
                InputProps={{
                  endAdornment: searchedText && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchedText('')}>
                        <Icon name="Close" color="grey.500" type="linear" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {users?.length === 0 && !isFetchingUsers ? (
              <Box sx={{ marginTop: 8 }}>
                <NotFound img={PeopleNotFound} text={'No connection found'} />
              </Box>
            ) : (
              <>
                <Stack spacing={2}>
                  {isFetchingFollower ? (
                    <Stack alignItems="center" justifyContent="space-between" direction={'row'}>
                      <Typography variant="h6">
                        <FormattedMessage {...SendPostMessages.connections} />
                      </Typography>
                      <CircularProgress size={16} />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6">
                        <FormattedMessage {...SendPostMessages.connections} />
                      </Typography>
                      {followers?.map((follower: any) => (
                        <>
                          <Stack
                            key={follower?.itemId}
                            direction={'row'}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack
                              sx={{ cursor: 'pointer' }}
                              direction={'row'}
                              alignItems="center"
                              spacing={2}
                              onClick={() => {
                                if (follower?.itemType === FilterByEnum.Normal)
                                  push(`/profile/user/view/${follower?.itemId}`);
                                else if (follower?.itemType === FilterByEnum.Ngo)
                                  push(`/profile/ngo/view/${follower?.itemId}`);
                              }}
                            >
                              <Avatar
                                src={follower?.avatarUrl || undefined}
                                variant={follower?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                                sx={{ width: 48, height: 48, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                              />
                              <Typography variant="subtitle2" color={SURFACE.onSurface}>
                                {follower?.firstName || follower?.lastName}
                              </Typography>
                            </Stack>
                            <SendPostToUsers
                              userId={follower?.itemId}
                              text={`${convertSlateValueToText()} https://dev.aws.gardenoflove.co/post/post-details/${
                                postSent?.id
                              }`}
                            />
                          </Stack>
                          <Divider />
                        </>
                      ))}
                    </>
                  )}
                </Stack>

                <Stack spacing={2}>
                  {isFetchingUsers ? (
                    <Stack alignItems="center" justifyContent="space-between" direction={'row'}>
                      <Typography variant="h6">
                        <FormattedMessage {...SendPostMessages.suggestions} />
                      </Typography>
                      <CircularProgress size={16} />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6">
                        <FormattedMessage {...SendPostMessages.suggestions} />
                      </Typography>
                      {users?.map((item: any) => (
                        <>
                          <Stack
                            key={item?.id}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (item?.userName === FilterByEnum.Normal) push(`/profile/user/view/${item?.id}`);
                              else if (item?.userName === FilterByEnum.Ngo) push(`/profile/ngo/view/${item?.id}`);
                            }}
                            direction={'row'}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction={'row'} alignItems="center" spacing={2}>
                              <Avatar
                                src={item?.avatarUrl || undefined}
                                variant={item?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
                                sx={{ width: 48, height: 48, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                              />
                              <Typography variant="subtitle2" color={SURFACE.onSurface}>
                                {item?.fullName}
                              </Typography>
                            </Stack>
                            <SendPostToUsers
                              userId={item?.id}
                              text={`${convertSlateValueToText()} https://dev.aws.gardenoflove.co/post/post-details/${
                                postSent?.id
                              }`}
                            />
                          </Stack>
                          <Divider />
                        </>
                      ))}
                    </>
                  )}
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SendToConnectionsDialog;
