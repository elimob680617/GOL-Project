// @mui
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { Descendant } from 'slate';
import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_graphql/post/post-details/queries/getFundRaisingPost.generated';
//icon
import { Icon } from 'src/components/Icon';
import { MentionAndHashtag } from 'src/components/textEditor';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { basicSendPostSelector, resetSendPost, setSendPostText } from 'src/store/slices/post/sendPost';
import { ERROR, SURFACE } from 'src/theme/palette';

import SendCampaignPostCard from './SendCampaignPostCard';
import SendPostMessages from './SendPost.messages';
import SendSocialPostCard from './SendSocialPostCard';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  // height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

function SendPostInChatDialog() {
  const location = useLocation();
  const isPostDetails = location.pathname.includes('post-details');

  const theme = useTheme();
  const push = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const postSent = useSelector(basicSendPostSelector);

  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  let postText = '';
  listOfRichs.forEach((item) => {
    item?.children?.forEach((obj: any) => {
      if (obj.type) {
        // obj.type === 'tag' ? listOfTag.push(obj?.id) : obj.type === 'mention' ? listOfMention.push(obj?.id) : null;
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
        ? (postText += obj.text)
        : obj.type === 'tag'
        ? (postText += `#${obj.title}`)
        : obj.type === 'mention'
        ? (postText += `╣${obj.fullname}╠`)
        : (postText += ' ');
    });
    if (listOfRichs.length > 1) {
      postText += '\\n';
    }
  });

  useEffect(() => {
    if (!postSent?.id) {
      // back(-1);
      push(PATH_APP.home.index, { replace: true });
    }
  }, [postSent?.id, push]);

  useEffect(() => {
    if (postSent?.id) {
      if (postSent?.postType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: postSent?.id },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: postSent?.id } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, postSent?.id, postSent?.postType]);

  return (
    <>
      <Dialog
        fullWidth={true}
        keepMounted
        open={true}
        onClose={() => {
          push(PATH_APP.home.index);
          // dispatch(setSendPostText(initialState?.text));
          dispatch(resetSendPost());
          // back(-1);
        }}
      >
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={SURFACE.onSurface}>
              <FormattedMessage {...SendPostMessages.writeMessage} />
            </Typography>
            <IconButton
              onClick={() => {
                push(PATH_APP.home.index);
                dispatch(resetSendPost());
                // back(-1);
              }}
              sx={{ padding: 0 }}
            >
              <Icon name="Close" type="linear" color="grey.500" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{}}>
          <Stack sx={{ my: 3, p: 2, backgroundColor: theme.palette.background.neutral, borderRadius: 1 }}>
            <Stack direction={'row'} spacing={2} alignItems="center">
              <Box>
                <Avatar src={user?.avatarUrl || ''} sx={{ width: 48, height: 48 }} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <MentionAndHashtag
                  setListOfRichs={setListOfRichs}
                  eventType={'sendPost'}
                  setTextLimitation={setTextLimitation}
                  placeholder={formatMessage(SendPostMessages.writeMessage)}
                  value={postSent.text}
                  onChange={(value: Descendant[]) => dispatch(setSendPostText(value))}
                />
              </Box>
            </Stack>

            <Stack sx={{ mt: 2 }}>
              {postSent?.postType === 'campaign' ? (
                getFundRaisingPostFetching ? (
                  <CircularProgress size={16} />
                ) : (
                  <SendCampaignPostCard sentPost={campaignPost} />
                )
              ) : getSocialPostFetching ? (
                <CircularProgress size={16} />
              ) : (
                <SendSocialPostCard sentPost={socialPost} />
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          {Number(textLimitation) >= 1001 ? (
            <Stack spacing={2} width="100%">
              <Stack alignItems={'center'} direction="row" justifyContent={'start'}>
                <Icon name="Exclamation-Mark" color="error.main" type="solid" />
                <Typography variant="button" color={ERROR.main}>
                  <FormattedMessage {...SendPostMessages.sendTextLimitation} />
                </Typography>
              </Stack>
            </Stack>
          ) : !isPostDetails ? (
            <Link to={PATH_APP.post.sendPost.sendToConnections}>
              <Button variant="contained" sx={{ width: 120 }}>
                <FormattedMessage {...SendPostMessages.next} />
              </Button>
            </Link>
          ) : (
            <Link to={`${PATH_APP.post.postDetails.index}/${postSent?.id}/connections/${postSent?.postType}`}>
              <Button variant="contained" sx={{ width: 120 }} disabled={Number(textLimitation) >= 1001}>
                <FormattedMessage {...SendPostMessages.next} />
              </Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SendPostInChatDialog;
