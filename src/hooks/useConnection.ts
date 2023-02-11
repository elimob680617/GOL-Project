/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetFollowingsQuery } from 'src/_graphql/connection/queries/getFollowings.generated';
import { useLazyGetRequestedsQuery } from 'src/_graphql/connection/queries/getRequesteds.generated';
import { useLazyGetRequestsQuery } from 'src/_graphql/connection/queries/getRequests.generated';
import { useDispatch } from 'src/store';
import { onGetConnections, onLoadConnections, onUpdateConnections } from 'src/store/slices/connection/connections';
import { FilterByEnum, InputMaybe, Scalars } from 'src/types/serverTypes';

const useConnection = (
  connectionType: string,
  searchText: string,
  filterBy: FilterByEnum,
  userId: InputMaybe<Scalars['Guid']>,
  pageIndex: number = 1,
) => {
  const dispatch = useDispatch();
  const [getFollowers, { data: followers, isFetching: FollowersLoading, isSuccess: followerSuccess }] =
    useLazyGetFollowersQuery();
  const [getFollowings, { data: followings, isFetching: FollowingsLoading, isSuccess: followingSuccess }] =
    useLazyGetFollowingsQuery();
  const [getRequests, { data: requests, isFetching: requestsLoading, isSuccess: requestSuccess }] =
    useLazyGetRequestsQuery();
  const [getRequesteds, { data: requesteds, isFetching: requestedLoading, isSuccess: requestedSuccess }] =
    useLazyGetRequestedsQuery();
  const getConnections = useMemo(
    () => ({
      followers: { get: getFollowers, data: followers?.getFollowers?.listDto?.items, isSuccess: followerSuccess },
      followings: { get: getFollowings, data: followings?.getFollowings?.listDto?.items, isSuccess: followingSuccess },
      requests: { get: getRequests, data: requests?.getRequests?.listDto?.items, isSuccess: requestSuccess },
      requested: { get: getRequesteds, data: requesteds?.getRequesteds?.listDto?.items, isSuccess: requestedSuccess },
    }),
    [followerSuccess, followers, followingSuccess, followings, requestSuccess, requestedSuccess, requesteds, requests],
  );

  useEffect(() => {
    getConnections[connectionType as keyof typeof getConnections]?.get({
      filter: {
        pageSize: 10,
        pageIndex,
        dto: {
          searchText,
          filterBy,
          userId,
        },
      },
    });
  }, [connectionType, filterBy, pageIndex, searchText]);

  useEffect(() => {
    if (FollowersLoading || FollowingsLoading || requestsLoading || requestedLoading) {
      dispatch(onLoadConnections(true));
    } else {
      dispatch(onLoadConnections(false));
    }
  }, [FollowersLoading, FollowingsLoading, requestsLoading, requestedLoading, dispatch]);

  useEffect(() => {
    if (getConnections[connectionType as keyof typeof getConnections]?.isSuccess) {
      if (pageIndex === 1) {
        dispatch(onGetConnections(getConnections[connectionType as keyof typeof getConnections]?.data));
      } else {
        dispatch(onUpdateConnections(getConnections[connectionType as keyof typeof getConnections]?.data));
      }
    }
  }, [connectionType, getConnections]);
};

export default useConnection;
