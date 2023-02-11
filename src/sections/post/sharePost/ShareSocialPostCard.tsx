import { useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { jsx } from 'slate-hyperscript';
import moreMedia from 'src/assets/icons/moreMedia/24/Outline.svg';
// import moreMediaIcon from 'src/assets/icons/moreMedia/24/Outline.svg';
import Dot from 'src/components/Dot';
//icon
import { Icon } from 'src/components/Icon';
import { PostActions, PostCard, PostCommets, PostCounter, PostDescription, PostTitle } from 'src/components/Post';
import SimpleVideo from 'src/components/video/SimpleVideo';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
// import { setSendPostId, setSendPostType } from 'src/store/slices/post/sendPost';
import {
  basicSharePostSelector,
  initialState, // setSharedPostId,
  // setSharedPostType,
  valuingAll,
} from 'src/store/slices/post/sharePost';
import { GREY, PRIMARY, SURFACE } from 'src/theme/palette';
import { UserTypeEnum } from 'src/types/serverTypes';

import SharePostMessages from './SharePost.messages';

interface IPostCardInterface {
  post: any;
  isShared?: boolean;
}
interface IImageStyleProps {
  limitHeight: boolean;
}
type PostMediaType = 'video' | 'img';
interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));

const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
  maxHeight: '30rem',
  maxWidth: '30rem',
  height: 'auto',
  width: '100%',
  borderEndEndRadius: 8,
  borderEndStartRadius: 8,
}));

const MediaPostCounter = styled('div')(({ theme }) => ({
  padding: '0.5rem',
  paddingLeft: '1rem',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const MoreImg = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: '0.5rem',
}));
function ShareSocialPostCard(props: IPostCardInterface) {
  const { post, isShared = false } = props;
  const push = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const postShared = useSelector(basicSharePostSelector);
  const [body, setBody] = useState<string>('');
  const [isReport] = useState<boolean>(false);
  const [bodySharedSocialPost, setBodySharedSocialPost] = useState<string>('');
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);

  // const handleSharedSocialPost = () => {
  //   dispatch(setSharedPostId(post?.sharedSocialPost?.id));
  //   dispatch(setSharedPostType('social'));
  //   push(PATH_APP.post.sharePost.index);
  // };
  // const handleSentPost = () => {
  //   dispatch(setSendPostId(post?.id));
  //   dispatch(setSendPostType(post?.postType || ''));
  //   push(`${PATH_APP.post.sendPost.index}/${post?.id}/send/${post?.postType}`);
  // };

  const setGridFlex = (type: PostMediaType, index: number) => {
    const beforeFullWidth = media[index - 1] && media[index - 1].type === 'video' ? true : false;
    const nextFullWidth = media[index + 1] && media[index + 1].type === 'video' ? true : false;

    if (type === 'img') {
      if (beforeFullWidth || nextFullWidth) {
        if ((index + 1) % 2 !== 0) {
          return 12;
        } else {
          return 6;
        }
      } else {
        if (media.length > index + 1) {
          return 6;
        } else {
          if ((index + 1) % 2 !== 0) {
            return 12;
          } else {
            return 6;
          }
        }
      }
    }
    // else if (type === 'video') {
    return 12;
    // }
  };

  const valuingMediaPost = useCallback(() => {
    const newMedia: IPostMedia[] = [];
    // post.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post?.videoUrls?.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });

    post?.mediaUrls?.forEach((value: any) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img', thumbnail: '' });
    });

    setMedia([...newMedia]);
  }, [post?.mediaUrls]);

  const valuingMedia = useCallback(() => {
    const newMedia: IPostMedia[] = [];

    post?.sharedSocialPost?.mediaUrls?.forEach((value: any) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });

    setMedia([...newMedia]);
  }, [post?.sharedSocialPost?.mediaUrls]);
  useEffect(() => {
    setIsLike(post?.isLikedByUser);
  }, [post?.isLikedByUser]);

  useEffect(() => {
    setCountLike(post?.countOfLikes);
  }, [post?.countOfLikes]);
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

    mentions.forEach((mention: string) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyNew = bodyNew.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: string) => {
      bodyNew = bodyNew.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyNew);
    valuingMediaPost();
  }, [post, valuingMediaPost]);

  useEffect(() => {
    if (!post?.sharedSocialPost) return;
    let bodySharedSocialPostNew = post?.sharedSocialPost?.body;
    const mentions = bodySharedSocialPostNew?.match(/╣(.*?)╠/g) || [];
    const tags = bodySharedSocialPostNew?.match(/#(.*?)\s/g) || [];

    bodySharedSocialPostNew = bodySharedSocialPostNew?.replace(
      /\\n/g,
      ReactDOMServer.renderToStaticMarkup(BrElementCreator()),
    );

    mentions.forEach((mention: string) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodySharedSocialPostNew = bodySharedSocialPostNew.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: string) => {
      bodySharedSocialPostNew = bodySharedSocialPostNew.replace(
        new RegExp(tag, 'g'),
        ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)),
      );
    });

    setBodySharedSocialPost(bodySharedSocialPostNew);
    valuingMedia();
  }, [post?.sharedSocialPost, post?.social?.sharedSocialPost, valuingMedia]);

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
        audience: post.audience,
        location: {
          address: post.placeDescription,
          id: post.placeId,
          name: post.placeMainText,
          variant: 'company',
          locationType: 'share',
          secondaryText: post.placeSecondaryText,
        },
        text: handleTextBodyEdit(),
        mediaUrls: post.mediaUrls,
        editMode: true,
        id: post.id,
        postType: 'social',
        sharedPostType: 'social',
        sharePostId: post.sharedSocialPost.id,
        currentPosition: [],
      }),
    );
  };

  return (
    <>
      {isReport && (
        <Stack
          direction={'row'}
          alignItems={'center'}
          sx={{ background: '#fff', p: 2, borderRadius: '10px' }}
          spacing={1}
        >
          <Icon name="Info" />{' '}
          <Typography variant="subtitle2" color="text.secondary">
            <FormattedMessage {...SharePostMessages.sharePostReport} />
          </Typography>
        </Stack>
      )}
      <PostCard>
        {!isShared && (
          <>
            <PostTitle
              editCallback={() => {
                setEditingValue();
              }}
              avatar={
                <Avatar
                  sx={{ height: 48, width: 48 }}
                  src={post?.userAvatarUrl || undefined}
                  variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
                />
              }
              username={post?.fullName ? post?.fullName : `${post?.firstName} ${post?.lastName}`}
              Date={post?.createdDateTime || ''}
              PostNo={'simple'}
              location={post?.placeDescription}
              isMine={post?.isMine}
              userId={post?.ownerUserId}
              userType={post?.userType}
              postId={post?.id}
            />
            <Box sx={{ paddingTop: 2 }} />
            <PostDescription description={body || ''} />
            <Box sx={{ paddingTop: 2 }} />
          </>
        )}

        <Stack sx={{ border: `1px solid ${GREY[100]}`, borderRadius: 1, pt: 2, mx: 2 }} spacing={2}>
          <Stack direction={'row'} spacing={1} alignItems="center" sx={{ px: 2 }}>
            <Box sx={{ bgcolor: 'background.neutral' }}>
              <Icon name="Reshare" type="linear" color="grey.700" />
            </Box>
            {!isShared ? (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.sharedSocialPost?.userAvatarUrl || ''}
                variant={post?.sharedSocialPost?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            ) : postShared.editMode ? (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.sharedSocialPost?.userAvatarUrl || ''}
                variant={post?.sharedSocialPost?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            ) : (
              <Avatar
                sx={{ height: 32, width: 32 }}
                src={post?.userAvatarUrl || ''}
                variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            )}

            <Stack spacing={0.5}>
              <Typography variant="subtitle2">
                {!isShared
                  ? post?.sharedSocialPost?.firstName && post?.sharedSocialPost?.lastName
                    ? `${post?.sharedSocialPost?.firstName} ${post?.sharedSocialPost?.lastName}`
                    : `${post?.sharedSocialPost?.fullName}`
                  : postShared.editMode
                  ? post?.sharedSocialPost?.firstName && post?.sharedSocialPost?.lastName
                    ? `${post?.sharedSocialPost?.firstName} ${post?.sharedSocialPost?.lastName}`
                    : `${post?.sharedSocialPost?.fullName}`
                  : post?.firstName && post?.lastName
                  ? `${post?.firstName} ${post?.lastName}`
                  : `${post?.fullName}`}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {!isShared
                    ? post?.sharedSocialPost?.createdDateTime
                    : postShared.editMode
                    ? post?.sharedSocialPost?.createdDateTime
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
          <Stack>
            {!isShared ? (
              <PostDescription description={bodySharedSocialPost || ''} />
            ) : postShared.editMode ? (
              <PostDescription description={bodySharedSocialPost || ''} />
            ) : (
              <PostDescription description={body || ''} />
            )}
          </Stack>
          <Stack>
            {media.length !== 0 && (
              <Grid
                // onClick={() =>
                //   !isShared
                //     ? setSearchParams({ post: post?.sharedSocialPost?.id })
                //     : postShared.editMode
                //     ? setSearchParams({ post: post?.sharedSocialPost?.id })
                //     : setSearchParams({ post: post?.id })
                // }
                onClick={() =>
                  !isShared
                    ? push(`/post${PATH_APP.post.moreMedia}/${post?.sharedSocialPost?.id}`, {
                        state: post?.sharedSocialPost?.id,
                      })
                    : postShared.editMode
                    ? push(`/post${PATH_APP.post.moreMedia}/${post?.sharedSocialPost?.id}`, {
                        state: post?.sharedSocialPost?.id,
                      })
                    : push(`/post${PATH_APP.post.moreMedia}/${post?.id}`, {
                        state: post?.id,
                      })
                }
                container
                spacing={0.5}
                sx={{
                  marginLeft: 0.1,
                  backgroundColor: SURFACE.onSurface,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: '100%',
                  maxHeight: '30rem',
                  borderEndEndRadius: 8,
                  borderEndStartRadius: 8,
                }}
              >
                {media && media.findIndex((i) => i.type === 'video') >= 0 && (
                  <Box>
                    <SimpleVideo
                      controls
                      key={media.find((i) => i.type === 'video')?.link}
                      autoShow
                      src={media.find((i) => i.type === 'video')?.link || ''}
                    />
                  </Box>
                )}
                {media && media.findIndex((i) => i.type === 'video') < 0 && media[0] && (
                  <ImgStyle
                    limitHeight={setGridFlex('img', 1) === 6 ? true : false}
                    key={media[0].link}
                    src={
                      media[0].link.indexOf('http') >= 0 || media[0].link.indexOf('https') >= 0
                        ? media[0].link
                        : `http://${media[0].link}`
                    }
                  />
                )}
              </Grid>
            )}
            {media.length >= 2 ? (
              <MediaPostCounter onClick={() => push(`/post${PATH_APP.post.moreMedia}/${post.id}`, { state: post.id })}>
                <MoreImg>
                  <img src={moreMedia} alt="more media" />
                </MoreImg>
                <Typography>+{media.length - 1} more media</Typography>
              </MediaPostCounter>
            ) : null}
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
                postType="social"
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
                // handleSharedSocialPost={handleSharedSocialPost}
                // handleSentPost={handleSentPost}
              />
            </Stack>
            {!commentOpen ? (
              <PostCommets PostId={post?.id} countOfComments={post?.countOfComments || '0'} postType="social" />
            ) : null}
          </>
        )}
      </PostCard>
    </>
  );
}

export default ShareSocialPostCard;
