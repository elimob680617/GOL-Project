import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { jsx } from 'slate-hyperscript';
import Dot from 'src/components/Dot';
//icon
import { Icon } from 'src/components/Icon';
import {
  PostActions,
  PostCard,
  PostCommets,
  PostCounter,
  PostDescription,
  PostDonationDetails,
  PostTitle,
} from 'src/components/Post';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
// import { setSendPostId, setSendPostType } from 'src/store/slices/post/sendPost';
import {
  basicSharePostSelector,
  initialState, // setSharedPostId,
  // setSharedPostType,
  valuingAll,
} from 'src/store/slices/post/sharePost';
import { GREY, PRIMARY } from 'src/theme/palette';
import { UserTypeEnum } from 'src/types/serverTypes';

interface IPostCardInterface {
  post: any;
  isShared?: boolean;
}
const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));
const ImgStyle = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));
function ShareCampaignPostCard(props: IPostCardInterface) {
  const { post, isShared = false } = props;
  const push = useNavigate();
  const dispatch = useDispatch();
  const [body, setBody] = useState<string>('');
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);
  const postShared = useSelector(basicSharePostSelector);
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');
  // const sendRouteType = 'home';

  // const handleSharedCampaignPost = () => {
  //   dispatch(setSharedPostId(post?.sharedCampaignPost?.id));
  //   dispatch(setSharedPostType('campaign'));
  //   push(PATH_APP.post.sharePost.index);
  // };
  // const handleSentCampaignPost = () => {
  //   dispatch(setSendPostId(post?.id));
  //   dispatch(setSendPostType('social'));
  //   if (sendRouteType === 'home') {
  //     push(`${PATH_APP.post.sendPost.index}/${post?.id}/send/${post?.postType}`);
  //   } else {
  //     push(`${PATH_APP.post.postDetails.index}/${post?.id}/send/${post?.postType}`);
  //   }
  // };

  useEffect(() => {
    setCommentsCount(post?.countOfComments);
  }, [post]);
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-mention"
        id={id}
        sx={{
          padding: '0!important',
          verticalAlign: 'baseline',
          display: 'inline-block',
          lineHeight: '0',
        }}
      >
        {fullname}
      </Typography>
    </Link>
  );

  const TagElementCreator = (tag: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-tag"
        sx={{
          verticalAlign: 'baseline',
          display: 'inline-block',
          padding: '0!important',
          lineHeight: '0',
        }}
      >
        {tag}
      </Typography>
    </Link>
  );

  const BrElementCreator = () => <br />;

  useEffect(() => {
    if (!post) return;
    let bodyNew = post?.body;
    const mentions = bodyNew?.match(/╣(.*?)╠/g) || [];
    const tags = bodyNew?.match(/#(.*?)\s/g) || [];

    bodyNew = bodyNew?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention: any) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyNew = bodyNew.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: any) => {
      bodyNew = bodyNew.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyNew);
  }, [post]);

  const handleTextBodyEdit = () => {
    let editText = post.body;
    let element: any = [];
    let children: any[] = [];
    let bodyText = '';
    let editTextIndex = 0;

    if (editText.length === 0) {
      children = initialState.text;
    }

    while (editText.length > 0) {
      if (editText[editTextIndex] !== '╣' && editText[editTextIndex] !== '#' && editText[editTextIndex] !== '\\') {
        bodyText += editText[editTextIndex];
        editTextIndex++;
        if (editText[editTextIndex] === null || editText[editTextIndex] === undefined) {
          editText = '';
          editTextIndex = 0;
          element.push({ text: bodyText });
          bodyText = '';
          children.push({ type: 'paragraph', children: element });
          break;
        }
      } else {
        editText = editText.substr(editTextIndex);
        editTextIndex = 0;
        element.push({ text: bodyText });
        bodyText = '';
        if (editText[editTextIndex] === '╣') {
          const mention = editText.match(/╣(.*?)╠/)[0];

          const mentionedValue = mention.replace('╣', '').replace('╠', '');
          element.push(
            jsx(
              'element',
              {
                type: 'mention',
                username: mentionedValue,
                fullname: mentionedValue,
                class: 'inserted-mention',
              },
              [{ text: '' }],
            ),
          );
          element.push({ text: '' });
          editText = editText.replace(/╣(.*?)╠/, '');
        } else if (editText[editTextIndex] === '#') {
          const tag = editText.match(/#(.*?)\s/)[0];

          const tagedValue = tag.replace('#', '');
          element.push(jsx('element', { type: 'tag', class: 'inserted-tag', title: tagedValue }, [{ text: '' }]));
          element.push({ text: '' });
          editText = editText.replace(/#(.*?)\s/, '');
        } else if (editText[editTextIndex] === '\\') {
          editText = editText.substr(2);
          children.push({ type: 'paragraph', children: element });
          element = [{ text: '' }];
        }
      }

      if (editText === '') {
        children.push({ type: 'paragraph', children: element });
      }
    }

    return children;
  };

  const setEditingValue = () => {
    push(PATH_APP.post.sharePost.index);
    dispatch(
      valuingAll({
        audience: post?.audience,
        location: {
          address: post?.placeDescription,
          id: post?.placeId,
          name: post?.placeMainText,
          variant: 'company',
          locationType: 'share',
          secondaryText: post?.placeSecondaryText,
        },
        text: handleTextBodyEdit(),
        mediaUrls: post?.mediaUrls,
        editMode: true,
        id: post?.id,
        postType: 'social',
        sharedPostType: 'social',
        sharePostId: post?.sharedCampaignPost?.id,
        currentPosition: [],
      }),
    );
  };

  return (
    <>
      <PostCard>
        {!isShared && (
          <>
            <PostTitle
              editCallback={() => {
                setEditingValue();
              }}
              postId={post?.id}
              avatar={
                <Avatar
                  sx={{ height: 48, width: 48 }}
                  src={post?.userAvatarUrl || undefined}
                  variant={
                    post?.userType === UserTypeEnum.Ngo || post?.userType === UserTypeEnum.Company
                      ? 'rounded'
                      : 'circular'
                  }
                />
              }
              username={post?.firstName && post.lastName ? `${post?.firstName} ${post?.lastName}` : `${post?.fullName}`}
              Date={post?.createdDateTime || ''}
              PostNo={'simple'}
              location={post?.placeDescription}
              isMine={post?.isMine}
              userId={post?.ownerUserId}
              userType={post?.userType}
            />
            <Box sx={{ paddingTop: 2 }} />

            <PostDescription description={body || ''} />
            <Box sx={{ paddingTop: 2 }} />
          </>
        )}

        <Stack sx={{ border: `1px solid ${GREY[100]}`, borderRadius: 1, mx: 2, pt: 2 }}>
          <Stack direction={'row'} spacing={1} alignItems="center" sx={{ px: 2 }}>
            <Box sx={{ bgcolor: 'background.neutral' }}>
              <Icon name="Reshare" type="linear" color="grey.700" />
            </Box>

            {!isShared ? (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.sharedCampaignPost?.userAvatarUrl || undefined}
                variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            ) : postShared.editMode ? (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.sharedCampaignPost?.userAvatarUrl || undefined}
                variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            ) : (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.userAvatarUrl || undefined}
                variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            )}

            <Stack spacing={0.5}>
              <Typography variant="subtitle1">
                {!isShared
                  ? post?.sharedCampaignPost?.firstName && post?.sharedCampaignPost?.lastName
                    ? `${post?.sharedCampaignPost?.firstName} ${post?.sharedCampaignPost?.lastName}`
                    : `${post?.sharedCampaignPost?.fullName}`
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.firstName && post?.sharedCampaignPost?.lastName
                    ? `${post?.sharedCampaignPost?.firstName} ${post?.sharedCampaignPost?.lastName}`
                    : `${post?.sharedCampaignPost?.fullName}`
                  : post?.firstName && post?.lastName
                  ? `${post?.firstName} ${post?.lastName}`
                  : `${post?.fullName}`}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {!isShared
                    ? post?.sharedCampaignPost?.createdDateTime
                    : postShared.editMode
                    ? post?.sharedCampaignPost?.createdDateTime
                    : post?.createdDateTime}
                </Typography>
                <PostTitleDot>
                  <Stack justifyContent="center">
                    <Dot />
                  </Stack>
                </PostTitleDot>

                <Stack justifyContent="center">
                  <Icon name="Earth" type="linear" color="grey.300" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack sx={{ pt: 2 }}>
            {!isShared ? (
              <ImgStyle src={post?.sharedCampaignPost?.coverImageUrl} />
            ) : postShared.editMode ? (
              <ImgStyle src={post?.sharedCampaignPost?.coverImageUrl} />
            ) : (
              <ImgStyle src={post?.coverImageUrl} />
            )}
          </Stack>
          <Stack>
            {!isShared ? (
              <PostDescription
                description={post?.sharedCampaignPost?.body || ''}
                title={post?.sharedCampaignPost?.title}
                id={post?.sharedCampaignPost?.id}
                PostNo={true}
              />
            ) : postShared.editMode ? (
              <PostDescription
                description={post?.sharedCampaignPost?.body || ''}
                title={post?.sharedCampaignPost?.title}
                id={post?.sharedCampaignPost?.id}
                PostNo={true}
              />
            ) : (
              <PostDescription description={post?.body || ''} title={post?.title} id={post?.id} PostNo={true} />
            )}
          </Stack>
          <Stack>
            <PostDonationDetails
              dayleft={
                !isShared
                  ? post?.sharedCampaignPost?.dayLeft
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.dayLeft
                  : post?.dayLeft
              }
              numberOfDonations={
                !isShared
                  ? post?.sharedCampaignPost?.numberOfDonations
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.numberOfDonations
                  : post?.numberOfDonations
              }
              averageRate={
                !isShared
                  ? post?.sharedCampaignPost?.averageRate
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.averageRate
                  : post?.averageRate
              }
              numberOfRates={
                !isShared
                  ? post?.sharedCampaignPost?.numberOfRates
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.numberOfRates
                  : post?.numberOfRates
              }
              raisedMoney={
                !isShared
                  ? post?.sharedCampaignPost?.raisedMoney
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.raisedMoney
                  : post?.raisedMoney
              }
              target={
                !isShared
                  ? post?.sharedCampaignPost?.target
                  : postShared.editMode
                  ? post?.sharedCampaignPost?.target
                  : post?.target
              }
              isShared
            />
          </Stack>
        </Stack>

        {!isShared && (
          <>
            <Stack direction={'row'} sx={{ p: 2 }} alignItems="center">
              {post?.postLikerUsers.length !== 0 ? (
                <Stack direction={'row'} sx={{ p: 2 }} alignItems="center">
                  <PostCounter
                    type={true} //Like & comments Counter
                    counter={countLike}
                    lastpersonName={post?.postLikerUsers}
                    lastpersonsData={post?.postLikerUsers}
                    Comments={post?.countOfComments || '0'}
                  />
                </Stack>
              ) : null}
            </Stack>

            <Divider />
            <Stack sx={{ p: 2 }}>
              <PostActions
                sendRouteType="home"
                shareRouteType="home"
                sharedSocialPost={post?.sharedSocialPost}
                sharedCampaignPost={post?.sharedCampaignPost}
                postType="campaign"
                inDetails={false}
                like={countLike}
                countLikeChanged={setCountLike}
                comment={post?.countOfComments || '0'}
                share={post?.countOfShared || '0'}
                view={post?.countOfViews || '0'}
                id={post?.id}
                setCommentOpen={setCommentOpen}
                commentOpen={commentOpen}
                isLikedByUser={isLike}
                likeChanged={setIsLike}
                commentsCount={commentsCount}
                // handleSharedCampaignPost={handleSharedCampaignPost}
                // handleSentCampaignPost={handleSentCampaignPost}
              />
            </Stack>
            {!commentOpen ? (
              <PostCommets
                PostId={post?.id}
                countOfComments={post?.countOfComments || '0'}
                postType="campaign"
                commentsCount={commentsCount}
                setCommentsCount={setCommentsCount}
              />
            ) : null}
          </>
        )}
      </PostCard>
    </>
  );
}

export default ShareCampaignPostCard;
