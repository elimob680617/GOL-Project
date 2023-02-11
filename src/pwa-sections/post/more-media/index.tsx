import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import { Avatar, Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { Icon } from 'src/components/Icon';
import { PostActions, PostCounter, PostDescriptionMoreMedia, PostTitleMoreMedia } from 'src/components/Post';
import SimpleVideo from 'src/components/video/SimpleVideo';

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
  maxHeight: '100%',
  width: '100%',
  margin: 'auto',
  position: 'relative',
}));
const ActionArea = styled('div')(({ theme }) => ({
  padding: 15,
  height: 42,
  borderTop: `1px solid ${theme.palette.surface.onSurfaceVariant}`,
}));

function MediaDialog(props: any) {
  const [body, setBody] = useState<string>('');
  const theme = useTheme();

  const [postCounter] = useState([
    {
      id: 1,
      name: 'Remy Sharp',
      image: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser.02b413c5.jpg&w=1920&q=75',
    },
    {
      id: 2,
      name: 'Travis Howard',
      image: 'https://mui.com/static/images/avatar/1.jpg',
    },
    {
      id: 3,
      name: 'Cindy Baker',
      image: 'https://mui.com/static/images/avatar/2.jpg',
    },
    {
      id: 4,
      name: 'Agnes Walker',
      image: 'https://mui.com/static/images/avatar/3.jpg',
    },
  ]);
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [getSocialPost] = useLazyGetSocialPostQuery();
  const [post, setPost] = useState<any>([]);
  const [carousel, setCarousel] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    getSocialPost({ filter: { dto: { id: props.router.query.post } } })
      .unwrap()
      .then((res: any) => {
        const postData = [];
        postData.push(res?.getSocialPost?.listDto?.items[0]);
        setPost(postData);
      });
  }, [getSocialPost, props.router.query.post]);

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    // post[0]?.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post[0]?.videoUrls.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });
    post[0]?.mediaUrls?.forEach((value: any) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });
    setMedia([...newMedia]);
  };
  const BrElementCreator = () => <br />;
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link to="">
      <Typography
        variant="subtitle1"
        color="primary.main"
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
        color="primary.main"
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

    bodyData = bodyData?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention: any) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyData = bodyData?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: any) => {
      bodyData = bodyData?.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyData);
    valuingMedia();
  }, [post]);

  const [isLike, setIsLike] = useState(post[0]?.isLikedByUser);
  useEffect(() => {
    setIsLike(post[0]?.isLikedByUser);
  }, [post[0]?.isLikedByUser]);

  const handlers = useSwipeable({
    onSwipedLeft: () => (carousel === media.length ? setCarousel(media.length) : setCarousel(carousel + 1)),
    onSwipedRight: () => (carousel === 1 ? setCarousel(1) : setCarousel(carousel - 1)),
  });
  return (
    <Box
      sx={{
        bgcolor: 'surface.onSurface',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <Box
        sx={{
          color: 'surface.main',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 1,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <Icon name="left-arrow" />
        </IconButton>
        <Typography variant="subtitle1">{`${carousel} of ${media.length}`}</Typography>
      </Box>
      <Box>
        <PostTitleMoreMedia
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
        />
      </Box>
      <Box>
        <PostDescriptionMoreMedia description={body || ''} seeMore={true} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Box
          {...handlers}
          sx={{
            maxHeight: 550,
            marginTop: 0,
            background: 'surface.onSurface',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'relative' }}>
            {media[carousel - 1]?.type === 'img' ? (
              <ImgStyle
                limitHeight={true}
                key={media[carousel - 1]?.link}
                src={
                  media[carousel - 1]?.link.indexOf('http') >= 0 || media[carousel - 1]?.link.indexOf('https') >= 0
                    ? media[carousel - 1]?.link
                    : `http://${media[carousel - 1]?.link}`
                }
              />
            ) : media[carousel - 1]?.type === 'video' ? (
              <Box sx={{ position: 'relative' }}>
                <SimpleVideo autoShow controls src={media[carousel - 1]?.link} />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {media.map((item, index) => (
            <Box
              sx={
                carousel - 1 === index
                  ? {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'black',
                      marginLeft: 1,
                      marginRight: 1,
                      cursor: 'pointer',
                      border: '1px solid surface.main',
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
              onClick={() => setCarousel(index + 1)}
            >
              {item.type === 'img' ? (
                <img
                  src={item.link}
                  height={carousel - 1 === index ? 72 : 56}
                  width={carousel - 1 === index ? 72 : 56}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: `${carousel - 1 === index ? 72 : 56}`,
                    height: `${carousel - 1 === index ? 72 : 56}`,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      color: 'surface.main',
                      position: 'absolute',
                      fontSize: '8px',
                      bottom: '0.2rem',
                      left: '0.2rem',
                    }}
                  >
                    <Icon name="camera" /> 02:10
                  </Box>
                  <SimpleVideo
                    width={carousel - 1 === index ? 72 : 56}
                    height={carousel - 1 === index ? 72 : 56}
                    src={item.link}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Stack direction={'row'} sx={{ p: 2 }} justifyContent={'center'} alignItems={'center'}>
        <PostCounter type={true} counter={109} lastpersonName={'Davood Malekia'} lastpersonsData={postCounter} />
        <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
          Davood Malekia and 13.2k others liked this post.
        </Typography>
      </Stack>
      <ActionArea>
        <PostActions
          like={post[0]?.countOfLikes || ''}
          comment={post[0]?.countOfComments || ''}
          share={post[0]?.countOfShared || ''}
          view={post[0]?.countOfViews || ''}
          id={post[0]?.id}
          isLikedByUser={isLike}
          likeChanged={setIsLike}
        />
      </ActionArea>
    </Box>
  );
}

export default MediaDialog;
