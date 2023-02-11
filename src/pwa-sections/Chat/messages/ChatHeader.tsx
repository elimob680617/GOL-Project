import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Avatar, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSelector } from 'src/store';

import DeleteModal from './DeleteModal';

const MoreIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'inherit !important',
}));

const ChatHeader = () => {
  const { onChatUser } = useSelector((state) => state.selectedUser);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('username@gmail.com');
  const navigate = useNavigate();

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', padding: theme.spacing(2) }}>
        <Stack direction="row" spacing={3}>
          <MoreIcon onClick={() => navigate('/chat')}>
            <ArrowBackIcon />
          </MoreIcon>
          <Avatar sx={{ height: 48, width: 48 }} aria-label="avatar" src={onChatUser.avatarUrl ?? ''} alt="user" />
          <Stack>
            <Typography gutterBottom variant="subtitle2" component="div" sx={{ margin: theme.spacing(0) }}>
              {onChatUser.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`${onChatUser.lastMessageDateTime.slice(0, 10)}  |  ${onChatUser.lastMessageDateTime.slice(11, 16)}`}
            </Typography>
          </Stack>
        </Stack>
        <MoreIcon onClick={() => navigate(`/chat/profile/${onChatUser?.id}`)}>
          <MoreVertOutlinedIcon />
        </MoreIcon>
        {/* {isSelect ? (
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Typography color="text.primary" variant="subtitle1">
              Selected
            </Typography>
            <Button variant="outlined" startIcon={<DeleteForeverRoundedIcon />} onClick={handleClickOpen}>
              <Typography variant="overline">Delete</Typography>
            </Button>
            <MoreIcon onClick={() => dispatch(onDisable())}>
              <ClearRoundedIcon />
            </MoreIcon>
          </Stack>
        ) : (
          <MoreIcon onClick={() => dispatch(onEnable())}>
            <MoreVertOutlinedIcon />
          </MoreIcon>
        )} */}
      </Stack>
      <DeleteModal selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
};

export default ChatHeader;
