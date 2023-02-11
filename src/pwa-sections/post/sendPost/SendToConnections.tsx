import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetUserQuery } from 'src/_graphql/post/create-post/queries/getUserQuery.generated';
//icon
import { Icon } from 'src/components/Icon';
import NotFound from 'src/components/notFound/NotFound';
import useAuth from 'src/hooks/useAuth';
import useDebounce from 'src/hooks/useDebounce';
import { useSelector } from 'src/store';
import { basicSendPostSelector } from 'src/store/slices/post/sendPost';
import { FilterByEnum, UserTypeEnum } from 'src/types/serverTypes';

import SendPostMessages from './SendPost.messages';
import SendPostToUsers from './SentPostToUsers';

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

function SendToConnections() {
  const { user } = useAuth();
  const back = useNavigate();
  const push = useNavigate();
  const theme = useTheme();
  const [searchedText, setSearchedText] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchedText, 500);
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

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{ py: 2.25, px: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
      >
        <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
          <IconButton
            onClick={() => {
              back(-1);
              //   dispatch(resetSendPost());
            }}
            sx={{ padding: 0 }}
          >
            <Icon name="left-arrow-1" color="grey.500" />
          </IconButton>
          <Typography variant="subtitle1">Send to</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Stack spacing={3} sx={{ p: 2 }} justifyContent="center">
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
                      <Icon name="Close" type="linear" color="grey.500" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {users?.length === 0 && !isFetchingUsers ? (
            <Box sx={{ marginTop: 8 }}>
              <NotFound img={'src/assets/images/notfound/peopleNotFound.svg'} text={'No connection found'} />
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
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
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
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
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
      </Stack>
    </>
  );
}

export default SendToConnections;
