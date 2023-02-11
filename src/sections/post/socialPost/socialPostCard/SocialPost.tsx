import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { jsx } from 'slate-hyperscript';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { initialState, valuingAll } from 'src/store/slices/post/createSocialPost';
import { UserTypeEnum } from 'src/types/serverTypes';

import {
  PostActions,
  PostCard,
  PostCommets,
  PostCounter,
  PostDescription,
  PostTitle,
} from '../../../../components/Post';
import SimpleVideo from '../../../../components/video/SimpleVideo';
import MediaDialogShare from '../MediaDialog/MediaDialogShare';

interface IImageStyleProps {
  limitHeight: boolean;
}

const ImgStyle = styled('img')<IImageStyleProps>(() => ({
  maxHeight: '30rem',
  maxWidth: '30rem',
  height: 'auto',
  // width: '100%',
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

const MoreImg = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: '0.5rem',
}));

type PostMediaDialogType = 'search' | 'home';
interface IPostCardInterface {
  post: any;
  isShared?: boolean;
  page: PostMediaDialogType;
}

type PostMediaType = 'video' | 'img';
interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}

function SocialPost(props: IPostCardInterface) {
  const dispatch = useDispatch();
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const { post, isShared = false, page } = props;
  const navigate = useNavigate();
  const [isReport, setIsReport] = useState<boolean>(false);
  const [body, setBody] = useState<string>('');
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [moreMediaDialog, setMoreMediaDialog] = useState<boolean>(false);
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
    navigate(PATH_APP.post.createPost.socialPost.index);
    dispatch(
      valuingAll({
        audience: post.audience,
        gifs: '',
        location: {
          address: post.placeDescription,
          id: post.placeId,
          name: post.placeMainText,
          variant: 'company',
          secondaryText: post.placeSecondaryText,
        },
        text: handleTextBodyEdit(),
        mediaUrls: post.mediaUrls,
        editMode: true,
        id: post.id,
        fileWithError: '',
        currentPosition: [],
      }),
    );
  };

  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={'primary.main'}
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
        color={'primary.main'}
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

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    post?.mediaUrls?.forEach((value: any) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });
    setMedia([...newMedia]);
  };

  useEffect(() => {
    if (!post) return;
    let bodyData = post.body;
    const mentions = bodyData?.match(/╣(.*?)╠/g) || [];
    const tags = bodyData?.match(/#(.*?)\s/g) || [];

    bodyData = bodyData?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention: any) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyData = bodyData.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: any) => {
      bodyData = bodyData.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyData);
    valuingMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);
  useEffect(() => {
    setIsLike(post?.isLikedByUser);
    setCountLike(post?.countOfLikes);
  }, [post.countOfLikes, post.isLikedByUser]);

  const handleMoreMedia = () => {
    if (page === 'home') {
      navigate(`/post${PATH_APP.post.moreMedia}/${post.id}`, { state: post.id });
    } else if (page === 'search') {
      setMoreMediaDialog(true);
    }
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
            This post reported by you
          </Typography>
        </Stack>
      )}

      <PostCard>
        <PostTitle
          setIsReport={setIsReport}
          editCallback={() => {
            setEditingValue();
          }}
          avatar={
            <Avatar
              sx={{ height: 48, width: 48 }}
              src={post?.userAvatarUrl || undefined}
              variant={
                post?.userType === UserTypeEnum.Company
                  ? 'rounded'
                  : post?.userType === UserTypeEnum.Ngo
                  ? 'rounded'
                  : 'circular'
              }
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
        {media.length !== 0 && (
          <Grid
            onClick={handleMoreMedia}
            container
            spacing={0.5}
            sx={{
              marginLeft: 0.1,
              backgroundColor: 'surface.onSurface',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '100%',
              maxHeight: '30rem',
            }}
          >
            {media && media.findIndex((i) => i.type === 'video') >= 0 && (
              <Box>
                <SimpleVideo
                  controls
                  key={media?.find((i) => i.type === 'video')?.link}
                  autoShow
                  src={media?.find((i) => i.type === 'video')?.link as string}
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
          <MediaPostCounter onClick={handleMoreMedia}>
            <MoreImg>
              <Icon name="multiple-image" />
            </MoreImg>
            <Typography>+{media.length - 1} more media</Typography>
          </MediaPostCounter>
        ) : null}

        {!isShared && (
          <>
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
              />
            </Stack>
            {!commentOpen ? (
              <PostCommets PostId={post?.id} countOfComments={post?.countOfComments || '0'} postType="social" />
            ) : null}
          </>
        )}
        <MediaDialogShare id={post?.id} open={moreMediaDialog} setOpen={setMoreMediaDialog} />
      </PostCard>
    </>
  );
}

export default SocialPost;
