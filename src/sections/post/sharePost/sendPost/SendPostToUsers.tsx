import { FormattedMessage } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';

import { useCreateMessageByUserNameMutation } from 'src/_graphql/chat/mutations/createMessageByUserName.generated';
//icon
import { Icon } from 'src/components/Icon';
import { dispatch } from 'src/store';
import { resetSendPost } from 'src/store/slices/post/sendPost';

import SendPostMessages from './SendPost.messages';

interface ISendPostType {
  userId: string | undefined;
  text: string;
}

function SendPostToUsers(props: ISendPostType) {
  const { userId, text } = props;
  const [createMessageByUserName, { isLoading, isSuccess }] = useCreateMessageByUserNameMutation();
  const sendPostHandler = async () => {
    const { data }: any = await createMessageByUserName({
      message: { dto: { toUserId: userId, text: text, readMessage: false } },
    });
    // Router.push(`/chat/${data?.createMessageByUserName?.listDto?.items[0]?.roomId}`);
    if (data?.createMessageByUserName?.listDto?.items[0]?.roomId) {
      dispatch(resetSendPost());
    }
  };
  return (
    <>
      {!isSuccess ? (
        <LoadingButton variant="contained" sx={{ width: 100 }} onClick={sendPostHandler} loading={isLoading}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Icon name="Send" color="common.white" type="linear" />
            <FormattedMessage {...SendPostMessages.send} />
          </Box>
        </LoadingButton>
      ) : (
        <Button disabled variant="secondary" sx={{ width: 100 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Icon name="Approve-Tick" color="common.black" type="linear" />
            <Typography sx={{ color: 'primary' }}>
              <FormattedMessage {...SendPostMessages.sent} />
            </Typography>
          </Box>
        </Button>
      )}
    </>
  );
}

export default SendPostToUsers;
