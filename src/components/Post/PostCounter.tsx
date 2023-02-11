import { useIntl } from 'react-intl';

import { Avatar, AvatarGroup, Stack, Typography } from '@mui/material';

import PostComponentsMessage from './PostComponentsMessage';

interface IPostCounter {
  counter?: any;
  lastpersonName?: any;
  lastpersonsData?: any;
  Comments?: string;
  type: boolean;
  endorseTitle?: string;
}

const PostCounter = ({ counter, lastpersonsData }: IPostCounter) => {
  const { formatMessage } = useIntl();
  return (
    <Stack alignItems="center" justifyContent="space-between" direction="row">
      <Stack spacing={0.5} direction="row" alignItems="center">
        <AvatarGroup max={4} total={0}>
          {lastpersonsData?.map((item: any) => (
            <Avatar key={item.id} sx={{ width: 16, height: 16 }} alt={item.fullName} src={item.avatarUrl} />
          ))}
        </AvatarGroup>
      </Stack>
      {counter === 1 ? (
        <Typography variant="button">{`${lastpersonsData[0]?.fullName} ${formatMessage(
          PostComponentsMessage.likedThisPost,
        )}`}</Typography>
      ) : (
        <Typography variant="button">
          {`${lastpersonsData[0]?.fullName} ${formatMessage(PostComponentsMessage.and)} ${counter - 1} ${formatMessage(
            PostComponentsMessage.othersLikedThisPost,
          )}`}
        </Typography>
      )}
    </Stack>
  );
};

export default PostCounter;
