import { FormattedMessage } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';

import { useCreateMessageByUserNameMutation } from 'src/_graphql/chat/mutations/createMessageByUserName.generated';
import { dispatch } from 'src/store';
import { resetSendPost } from 'src/store/slices/post/sendPost';

import SendPostMessages from './SendPost.messages';

interface ISendPostTypeProps {
  userId?: string;
  text?: string;
}
function SendPostToUsers(props: ISendPostTypeProps) {
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
        <LoadingButton
          variant="contained"
          sx={{ height: 32 }}
          onClick={sendPostHandler}
          loading={isLoading}
          size="small"
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <FormattedMessage {...SendPostMessages.send} />
          </Box>
        </LoadingButton>
      ) : (
        <Button disabled variant="secondary" sx={{ height: 32 }} size="small">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <FormattedMessage {...SendPostMessages.sent} />
          </Box>
        </Button>
      )}
    </>
  );
}

export default SendPostToUsers;
