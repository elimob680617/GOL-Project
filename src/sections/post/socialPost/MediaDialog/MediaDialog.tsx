import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Avatar, Box, CircularProgress, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { Icon } from 'src/components/Icon';
import { PostActions, PostCommets, PostCounter, PostDescription, PostTitle } from 'src/components/Post';
import SimpleVideo from 'src/components/video/SimpleVideo';
import { PRIMARY, SURFACE } from 'src/theme/palette';
import { ISocial } from 'src/types/post';
import { UserTypeEnum } from 'src/types/serverTypes';

type PostMediaType = 'video' | 'img';

interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
interface IImageStyleProps {
  limitHeight: boolean;
}
const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
  maxHeight: 400,
  width: '80%',
  margin: 'auto',
}));

const CarouselArrow = styled(IconButton)((theme) => ({
  backgroundColor: SURFACE.main,
  height: 32,
  width: 32,
}));

function MediaDialog(props: any) {
  const [body, setBody] = useState<string>('');
  const [postCounter] = useState([]);
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [getSocialPost, { isLoading: getSocialPostLoading }] = useLazyGetSocialPostQuery();
  const [post, setPost] = useState<ISocial[]>([]);
  const [carousel, setCarousel] = useState<number>(0);
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [countLike, setCountLike] = useState(post[0]?.countOfLikes);
  const [isLike, setIsLike] = useState(post[0]?.isLikedByUser);
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');
  const { state } = useLocation();

  console.log(state);
  useEffect(() => {
    getSocialPost({ filter: { dto: { id: state } } })
      .unwrap()
      .then((res: any) => {
        console.log(res?.getSocialPost);
        const postData: ISocial[] = [];
        postData.push(res?.getSocialPost?.listDto?.items?.[0] as ISocial);
        setCommentsCount(res?.getSocialPost?.listDto?.items?.[0]?.countOfComments);
        setPost(postData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  useEffect(() => {
    setIsLike(post[0]?.isLikedByUser);
  }, [post]);

  useEffect(() => {
    setCountLike(post[0]?.countOfLikes);
  }, [post]);

  useEffect(() => {}, [carousel]);

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    post?.[0]?.mediaUrls?.forEach((value) => {
      newMedia.push({ link: value?.url as string, type: value?.isVideo ? 'video' : 'img' });
    });

    setMedia([...newMedia]);
  };
  const BrElementCreator = () => <br />;
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link to="">
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
    <Link to="">
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
  useEffect(() => {
    if (!post) return;
    let bodyData = post[0]?.body;
    const mentions = bodyData?.match(/╣(.*?)╠/g) || [];
    const tags = bodyData?.match(/#(.*?)\s/g) || [];
    // const newLines = bodyData?.match(/[\\\/]/g) || [];

    bodyData = bodyData?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyData = bodyData?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag) => {
      bodyData = bodyData?.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyData as string);
    valuingMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const navigate = useNavigate();
  return (
    <Dialog open={true} maxWidth="xl" fullWidth={true} aria-labelledby="responsive-dialog-title">
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <DialogContent sx={{ height: 540, marginTop: 1, width: '40%', padding: 0 }}>
          <Box
            sx={{
              padding: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'row-reverse',
              boxShadow: '0 0 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
            }}
          >
            <Typography
              variant="subtitle1"
              color="GrayText.primary"
              sx={{ margin: 2.25 }}
              justifyContent={'flex-start'}
            >
              <IconButton onClick={() => navigate(-1)}>
                <Icon name="Close-1" />
              </IconButton>
            </Typography>
          </Box>
          {getSocialPostLoading && (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          )}
          <Box sx={{ padding: 2 }}>
            <PostTitle
              avatar={
                <Avatar
                  sx={{ height: 48, width: 48 }}
                  aria-label="recipe"
                  src={post[0]?.userAvatarUrl || ''}
                  alt="Hanna Baldin"
                />
              }
              username={post[0]?.firstName && post[0].lastName ? `${post[0]?.fullName}` : ''}
              PostNo={'simple'}
              Date={post[0]?.createdDateTime || ''}
              location={post[0]?.placeDescription || undefined}
              userId={post[0]?.ownerUserId}
              userType={post[0]?.userType as UserTypeEnum}
              isMine={!!post[0]?.isMine}
              postId={post[0]?.id as string}
            />
            <PostDescription description={body || ''} />
            {post[0]?.postLikerUsers?.length !== 0 ? (
              <Stack direction={'row'} sx={{ p: 2 }} alignItems="center">
                <PostCounter
                  type={true} //Like & comments Counter
                  counter={countLike}
                  lastpersonName={post[0]?.postLikerUsers}
                  lastpersonsData={postCounter}
                  Comments={post[0]?.countOfComments || '0'}
                />
              </Stack>
            ) : null}

            <PostActions
              sendRouteType="home"
              shareRouteType="home"
              sharedSocialPost={post[0]?.isSharedSocialPost}
              sharedCampaignPost={post[0]?.isSharedCampaignPost}
              postType="social"
              inDetails={false}
              like={countLike || '0'}
              countLikeChanged={setCountLike}
              comment={post[0]?.countOfComments || '0'}
              share={post[0]?.countOfShared || '0'}
              view={post[0]?.countOfViews || '0'}
              id={post[0]?.id}
              setCommentOpen={setCommentOpen}
              commentOpen={commentOpen}
              isLikedByUser={isLike}
              likeChanged={setIsLike}
              commentsCount={commentsCount}
            />
          </Box>
          {!commentOpen ? (
            <PostCommets
              PostId={post[0]?.id}
              commentsCount={commentsCount}
              setCommentsCount={setCommentsCount}
              countOfComments={post[0]?.countOfComments || '0'}
              postType="social"
            />
          ) : null}
        </DialogContent>
        <DialogContent sx={{ height: 550, marginTop: 0, background: SURFACE.onSurface, width: '60%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <Box sx={{ position: 'absolute', left: 2, top: 230 }}>
              <CarouselArrow
                onClick={() => {
                  carousel === 0 ? setCarousel(0) : setCarousel(carousel - 1);
                }}
              >
                <Icon name="left-arrow" />
              </CarouselArrow>
            </Box>
            {media[carousel]?.type === 'img' ? (
              <ImgStyle
                limitHeight={true}
                key={media[carousel]?.link}
                src={
                  media[carousel]?.link.indexOf('http') >= 0 || media[carousel]?.link.indexOf('https') >= 0
                    ? media[carousel]?.link
                    : `http://${media[carousel]?.link}`
                }
              />
            ) : media[carousel]?.type === 'video' ? (
              <SimpleVideo autoShow controls src={media[carousel]?.link} maxHeight={400} />
            ) : null}
            <Box sx={{ position: 'absolute', right: 0, top: 230 }}>
              <CarouselArrow
                onClick={() => {
                  carousel === media.length - 1 ? setCarousel(media.length - 1) : setCarousel(carousel + 1);
                }}
              >
                <Icon name="right-arrow-1" />
              </CarouselArrow>
            </Box>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: '1rem',
              width: '55%',
            }}
          >
            {media.map((item, index) => (
              <Box
                sx={
                  carousel === index
                    ? {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                        border: `1px solid ${SURFACE.main}`,
                        borderRadius: '8px',
                      }
                    : {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                      }
                }
                key={index}
                onClick={() => setCarousel(index)}
              >
                {item.type === 'img' ? (
                  <img
                    src={item.link}
                    height={carousel === index ? 72 : 56}
                    width={carousel === index ? 72 : 56}
                    alt=""
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: `${carousel === index ? 72 : 56}`,
                      height: `${carousel === index ? 72 : 56}`,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        color: SURFACE.main,
                        position: 'absolute',
                        fontSize: '8px',
                        bottom: '0.2rem',
                        left: '0.2rem',
                      }}
                    >
                      {/* <img src={cameraIcon} alt="camera" /> */}
                    </Box>
                    <SimpleVideo
                      src={item.link}
                      width={carousel === index ? 72 : 56}
                      height={carousel === index ? 72 : 56}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default MediaDialog;
