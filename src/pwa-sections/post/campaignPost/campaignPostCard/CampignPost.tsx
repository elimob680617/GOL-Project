import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PostCard, PostCommets, PostDonationDetails, PostTitle } from 'src/components/Post';
import PostDes from 'src/components/Post/PostDescription';
import PwaPostActions from 'src/components/Post/PwaPostActions';
import { UserTypeEnum } from 'src/types/serverTypes';

const ImgStyle = styled('img')(({ theme }) => ({
  maxHeight: '30rem',
  maxWidth: '30rem',
  height: 'auto',
  width: '100%',
}));

function CampignPost(props: any) {
  const { post } = props;
  const push = useNavigate();
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);

  useEffect(() => {
    setIsLike(post?.isLikedByUser);
  }, [post?.isLikedByUser]);
  useEffect(() => {
    setCountLike(post?.countOfLikes);
  }, [post?.countOfLikes]);

  return (
    <PostCard>
      <PostTitle
        avatar={
          <Avatar
            sx={{ height: 48, width: 48 }}
            aria-label="recipe"
            src={post?.userAvatarUrl}
            variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
          />
        }
        username={post?.fullName ? post?.fullName : `${post?.firstName} ${post?.lastName}`}
        Date={post?.createdDateTime}
        PostNo={'simple'}
        location={post?.placeDescription}
        isMine={post?.isMine}
        userId={post?.ownerUserId}
        userType={post?.userType}
        postId={post?.id}
      />
      <Box sx={{ paddingTop: 2 }} onClick={() => push(`/post/post-details/${post?.id}`)}>
        <ImgStyle src={post?.coverImageUrl} />
      </Box>
      <PostDes description={post?.body || ''} title={post?.title} id={post?.id} PostNo={true} />
      <PostDonationDetails
        dayleft={post?.dayLeft}
        numberOfDonations={post?.numberOfDonations}
        averageRate={post?.averageRate}
        numberOfRates={post?.numberOfRates}
        raisedMoney={post?.raisedMoney}
        target={post?.target}
      />
      <Box sx={{ m: 2, mt: 0 }}>
        <PwaPostActions
          inDetails={false}
          like={countLike}
          countLikeChanged={setCountLike}
          comment={post?.countOfComments || '0'}
          share={post?.countOfShared || '0'}
          view={post?.countOfViews || '0'}
          setCommentOpen={setCommentOpen}
          commentOpen={commentOpen}
          id={post?.id}
          postType="campaign"
          isLikedByUser={isLike}
          likeChanged={setIsLike}
          sharedSocialPost={post?.sharedSocialPost}
          sharedCampaignPost={post?.sharedCampaignPost}
        />
      </Box>
      {!commentOpen ? (
        <PostCommets PostId={post?.id} countOfComments={post?.countOfComments || '0'} postType="campaign" />
      ) : null}
    </PostCard>
  );
}

export default CampignPost;
