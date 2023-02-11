/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Card, Divider, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import { useLazyGetFundRaisingPostForEditQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignPostForEdit.generated';
import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { useLazyGetHomePagePostsQuery } from 'src/_graphql/post/queries/getHomePagePosts.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import NgoWizard from 'src/sections/profile/ngo/wizard/Wizard';
import Wizard from 'src/sections/profile/user/wizard/Wizard';
import { useDispatch, useSelector } from 'src/store';
import {
  addToHomePageUpdatePost,
  getHomeNewAddedPost,
  getHomeScroll,
  getHomeUpdatedPost,
  getPosts,
  getPostsCount,
  insertPosts,
  setHomeScroll,
  setNewPost,
  valuingHomePostCount,
} from 'src/store/slices/homePage';
import { reset } from 'src/store/slices/post/createSocialPost';
import { reset as resetUpload } from 'src/store/slices/upload';
import { ICampaign, IPost, ISocial } from 'src/types/post';
import { UserTypeEnum } from 'src/types/serverTypes';

import CampignPost from '../post/campaignPost/campignPostCard/CampignPost';
import ShareCampaignPostCard from '../post/sharePost/ShareCampaignPostCard';
import ShareSocialPostCard from '../post/sharePost/ShareSocialPostCard';
import SocialPost from '../post/socialPost/socialPostCard/SocialPost';
import HomeMessages from './home.messages';

const CreatePostWrapperStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ClickableStyle = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
}));

const CreatePostButton = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
}));

const CreatePostButtonText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

type Params = {
  processType:
    | 'home'
    | 'post/create-social-post'
    | 'add-social-post-location'
    | 'add-gif'
    | 'more-media'
    | 'share-post'
    | 'add-share-location'
    | 'send-post'
    | 'send-to-connections';
};

const HomePosts: FC = () => {
  const { user } = useAuth();
  const { processType } = useParams<Params>();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsResponse, isFetching: getPostFetching }] =
    useLazyGetHomePagePostsQuery();

  const [hasMorePosts, setHasmorePosts] = useState<boolean>(false);

  const pageSize = 20;

  const pageIndex = useRef<number>(0);

  const posts = useSelector(getPosts);

  const newPost = useSelector(getHomeNewAddedPost);

  const updatePost = useSelector(getHomeUpdatedPost);

  const postCount = useSelector(getPostsCount);

  const homePageScroll = useSelector(getHomeScroll);

  const [getSocialPost] = useLazyGetSocialPostQuery();

  const [getCampaignPost] = useLazyGetFundRaisingPostForEditQuery();

  const handler = () => {
    dispatch(setHomeScroll(window.scrollY));
  };

  useEffect(() => {
    if (processType === 'home') {
      dispatch(reset());

      dispatch(resetUpload());
    } else {
      handler();
    }
  }, [processType]);

  const valuingHasMorePosts = () => {
    if (postCount === null) return;

    if (postCount < (pageIndex.current + 1) * pageSize) {
      setHasmorePosts(false);
    } else {
      setHasmorePosts(true);
    }
  };

  useEffect(() => {
    if (posts === null) {
      pageIndex.current = 0;

      getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } });
    } else {
      const outOfBind = posts.length % pageSize;

      const division = posts.length / pageSize;

      if (outOfBind === 0) {
        pageIndex.current = division - 1;
      } else {
        pageIndex.current = Math.floor(division);
      }
    }
  }, [posts]);

  const addToHomePageNewPost = (homeNewPost: IPost) => {
    dispatch(insertPosts([homeNewPost, ...(posts || [])]));

    dispatch(setNewPost(null));

    dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
  };

  useEffect(() => {
    if (!newPost) return;

    if (newPost.type === 'social') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
        });
    }

    if (newPost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ campaign: res?.getFundRaisingPost?.listDto?.items?.[0] as ICampaign });
        });
    }

    if (newPost.type === 'share') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
        });
    }
  }, [newPost]);

  useEffect(() => {
    if (!updatePost) return;

    if (updatePost.type === 'social') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'social',

              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            }),
          );
        });
    }

    if (updatePost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'campaign',

              post: { campaign: res?.getFundRaisingPost?.listDto?.items?.[0] } as IPost,
            }),
          );
        });
    }

    if (updatePost.type === 'share') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'social',

              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            }),
          );
        });
    }
  }, [updatePost]);

  useEffect(() => {
    valuingHasMorePosts();
  }, [postCount]);

  const loadMore = () => {
    if (getPostFetching) return;

    pageIndex.current = pageIndex.current + 1;

    getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } })
      .unwrap()

      .then((res) => {
        if (res?.getHomePagePosts?.listDto?.count < (pageIndex.current + 1) * pageSize) {
          setHasmorePosts(false);
        }
      });
  };

  useEffect(() => {
    if (postsResponse) {
      const newPosts = [...(posts || []), ...(postsResponse?.getHomePagePosts?.listDto?.items || [])];

      dispatch(insertPosts(newPosts as IPost[]));

      dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
    }
  }, [postsResponse]);

  useEffect(() => {
    changeScroll();
  }, []);

  useEffect(() => {
    return () => {
      handler();
    };
  }, []);

  const changeScroll = () => {
    if (!homePageScroll) return;

    window.scrollTo({ top: homePageScroll, behavior: 'smooth' });
  };

  return (
    <Stack spacing={2} sx={{ flex: 1, maxWidth: 480 }}>
      <CreatePostWrapperStyle>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            onClick={() => navigate(PATH_APP.post.createPost.socialPost.index)}
            sx={{ cursor: 'pointer' }}
          >
            <Avatar
              src={user?.avatarUrl || ''}
              variant={
                user?.userType === UserTypeEnum.Company || user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'
              }
              sx={{ width: 48, height: 48 }}
            />

            <ClickableStyle onClick={() => navigate(PATH_APP.post.createPost.socialPost.index)}>
              <Typography variant="h6" sx={{ color: 'surface.onSurfaceVariantL' }}>
                <FormattedMessage {...HomeMessages.HomeWhats} />
              </Typography>
            </ClickableStyle>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <CreatePostButton
              alignItems="center"
              spacing={0.75}
              direction="row"
              onClick={() => navigate(PATH_APP.post.createPost.socialPost.index)}
            >
              <Icon name="image" size={24} />

              <CreatePostButtonText variant="caption">
                <FormattedMessage {...HomeMessages.photo} />
              </CreatePostButtonText>
            </CreatePostButton>

            <CreatePostButton
              onClick={() => navigate(PATH_APP.post.createPost.socialPost.index)}
              alignItems="center"
              spacing={0.75}
              direction="row"
            >
              <Icon name="Video" size={24} />

              <CreatePostButtonText variant="caption">
                <FormattedMessage {...HomeMessages.video} />
              </CreatePostButtonText>
            </CreatePostButton>

            {user?.organizationUserDto?.organizationUserType === 'NGO' && (
              <CreatePostButton
                onClick={() => navigate(PATH_APP.post.createPost.campainPost.new)}
                alignItems="center"
                spacing={0.75}
                direction="row"
              >
                <Icon name="Campaign" size={24} />

                <CreatePostButtonText variant="caption">
                  <FormattedMessage {...HomeMessages.campaign} />
                </CreatePostButtonText>
              </CreatePostButton>
            )}

            <CreatePostButton alignItems="center" spacing={0.75} direction="row">
              <Icon name="Campaign" size={24} />

              <CreatePostButtonText variant="caption">
                <FormattedMessage {...HomeMessages.article} />
              </CreatePostButtonText>
            </CreatePostButton>
          </Stack>
        </Stack>
      </CreatePostWrapperStyle>

      {user?.userType === UserTypeEnum.Normal ? (
        <Wizard percentage={user?.completeProfilePercentage ?? 0} fromHomePage={true} />
      ) : user?.userType === UserTypeEnum.Ngo ? (
        <NgoWizard percentage={user?.completeProfilePercentage ?? 0} fromHomePage={true} />
      ) : (
        <></>
      )}

      {getPostsLoading && !posts ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMorePosts}
          loader={
            <Stack sx={{ marginTop: 1, marginBottom: 1 }} direction="row" justifyContent="center">
              <CircularProgress />
            </Stack>
          }
        >
          <Stack spacing={2} sx={{ flex: 1 }}>
            {posts?.map((post) => {
              if (post?.social?.isSharedSocialPost)
                return <ShareSocialPostCard key={post!.social?.id} post={post?.social} />;
              else if (post?.social?.isSharedCampaignPost)
                return <ShareCampaignPostCard key={post!.social?.id} post={post?.social} />;
              else if (post?.social) return <SocialPost page="home" key={post!.social?.id} post={post?.social} />;

              return <CampignPost key={post!.campaign?.id} post={post?.campaign} />;
            })}
          </Stack>
        </InfiniteScroll>
      )}
    </Stack>
  );
};

export default HomePosts;
