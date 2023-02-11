import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Badge, Box, CardActionArea, Stack, styled, useTheme } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// import { styled } from '@mui/material/styles';

// import { useDispatch } from 'src/store';

// import { onSelectUser } from 'src/store/slices/chat/selectedUser';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: '50%',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.grey[0],
  },
}));

const StyledCard = styled(CardActionArea)(({ theme }) => ({
  actionArea: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
}));
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  height: '48px',
  width: '48px',
  border: `2px solid ${theme.palette.primary.main}`,
}));

const OneUser = ({ checkActive, id, user }: any) => {
  // const dispatch = useDispatch();
  const [queryId, setQueryId] = useState('');
  const theme = useTheme();
  const { id: roomId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (roomId) {
      setQueryId(roomId);
    }
    return () => {
      setQueryId('');
    };
  }, [roomId]);

  return (
    <Box>
      <StyledBadge badgeContent={30} max={9} sx={{ width: '95%' }} invisible>
        <StyledCard
          onClick={() => {
            navigate(`/chat/${user.roomId}`);
          }}
        >
          <CardContent sx={{ padding: theme.spacing(1.5, 0) }}>
            <Stack direction="row" spacing={3}>
              <StyledAvatar
                sx={{ ...(checkActive !== 3 && { border: 'none' }) }}
                aria-label="avatar"
                src={user.avatarUrl || ''}
                alt="user"
              />
              <Stack sx={{ ...(queryId === user.roomId && { color: theme.palette.primary.main }) }}>
                <Typography gutterBottom variant="subtitle1" component="div" sx={{ margin: theme.spacing(0) }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color={checkActive === 3 ? theme.palette.primary.main : 'text.secondary'}>
                  {user.lastMessage}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </StyledCard>
      </StyledBadge>
    </Box>
  );
};
export default OneUser;
