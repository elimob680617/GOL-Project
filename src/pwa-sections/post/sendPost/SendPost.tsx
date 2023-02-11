import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Button, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Descendant } from 'slate';
import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_graphql/post/post-details/queries/getFundRaisingPost.generated';
//icon
import { Icon } from 'src/components/Icon';
import MentionExample from 'src/components/textEditor/MentionAndHashtag';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { basicSendPostSelector, resetSendPost, setSendPostText } from 'src/store/slices/post/sendPost';
import { ERROR } from 'src/theme/palette';

import SendCampaignPostCard from './SendCampaignPostCard';
import SendPostMessages from './SendPost.messages';
import SendSocialPostCard from './SendSocialPostCard';

function SendPost() {
  const dispatch = useDispatch();
  const back = useNavigate();
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const postSent = useSelector(basicSendPostSelector);
  const idSendPost = localStorage.getItem('idSendPost');
  const typeSendPostType = localStorage.getItem('typeSendPostType');

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
    } else {
      if (typeSendPostType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: idSendPost },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: idSendPost } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, idSendPost, postSent?.id, postSent?.postType, typeSendPostType]);

  return (
    <>
      <Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ py: 1.5, px: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
        >
          <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
            <IconButton
              onClick={() => {
                back(-1);
                dispatch(resetSendPost());
              }}
              sx={{ padding: 0 }}
            >
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1">
              <FormattedMessage {...SendPostMessages.writeMessage} />
            </Typography>
          </Stack>
          <Link to={`${PATH_APP.post.sendPost.sendToConnections}`}>
            <Button variant="contained" size="small" sx={{ height: 32 }} disabled={Number(textLimitation) >= 1000}>
              <FormattedMessage {...SendPostMessages.next} />
            </Button>
          </Link>
        </Stack>
        <Stack sx={{ mt: 2, px: 2 }}>
          {typeSendPostType === 'campaign' || postSent?.postType === 'campaign' ? (
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
        <Stack sx={{ px: 2 }}>
          <MentionExample
            setListOfRichs={setListOfRichs}
            setTextLimitation={setTextLimitation}
            eventType={'sendPost'}
            placeholder={formatMessage(SendPostMessages.writeMessage)}
            value={postSent.text}
            onChange={(value: Descendant[]) => dispatch(setSendPostText(value))}
          />
        </Stack>

        {Number(textLimitation) >= 1000 ? (
          <Stack
            direction={'row'}
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              bgcolor: 'background.neutral',
              p: 1,
              m: 2,
            }}
          >
            <Icon name="Exclamation-Mark" color="error.main" type="solid" />
            <Typography variant="subtitle2" color={ERROR.main}>
              <FormattedMessage {...SendPostMessages.sendTextLimitation} />
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}

export default SendPost;
