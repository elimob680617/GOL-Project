import { FC, useState } from 'react';

import { Box, Stack, TextField, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from 'src/components/Icon';

const ImageStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
}));

const MsgInput: FC<{ sendJsonMessage: (jsonMessage: any, keep?: boolean) => void; room: string }> = ({
  sendJsonMessage,
  room,
}) => {
  const [msg, setMsg] = useState<string>('');
  const theme = useTheme();

  const handleClickSendMessage = () => {
    sendJsonMessage({
      action: 'sendMessage',
      room_id: room,
      type: 'text',
      text_content: msg,
      operation: 'create',
      message_id: '',
    });
    setMsg('');
  };

  return (
    <Stack direction="row" sx={{ width: '100%', padding: theme.spacing(0.62), justifyContent: 'space-around' }}>
      <TextField
        sx={{ width: '92%' }}
        id="msg-input-multiline"
        label="Text Message"
        multiline
        maxRows={5}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <ImageStyle onClick={handleClickSendMessage}>
        <Icon name="Send" />
      </ImageStyle>
    </Stack>
  );
};

export default MsgInput;
