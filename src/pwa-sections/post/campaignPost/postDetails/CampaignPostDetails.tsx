import { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

import { useLazyGetFundRaisingPostQuery } from 'src/_graphql/post/post-details/queries/getFundRaisingPost.generated';
import emptyIcon from 'src/assets/icons/empty_cover.svg';
import { Icon } from 'src/components/Icon';
import { PostCommets } from 'src/components/Post';
import PwaPostActions from 'src/components/Post/PwaPostActions';
import { UserTypeEnum } from 'src/types/serverTypes';

import DonorsList from './DonorsList';
import PostDetailsMessages from './PostDetails.messages';
import PostDetailsDonationDetails from './PostDetailsDonationDetails';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsNgoInfo from './PostDetailsNgoInfo';

const CardStyle = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  // width: '100%',
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const StarRateWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: 16,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 32,
  marginBottom: 32,
  borderRadius: 8,
  textAlign: 'center',
}));
const TabStyle = styled(Tab)<ITabInterface>(({ theme, active }) => ({
  color: active ? `${theme.palette.primary.main}!important` : `${theme.palette.text.secondary}!important`,
}));
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface ITabInterface {
  active: boolean;
}
function CampaignPostDetails() {
  const back = useNavigate();
  const { id } = useParams();
  const _id = id;
  console.log('_id', _id);
  const [value, setValue] = useState<number | null>(0);
  const theme = useTheme();
  const [getFundRaisingPost, { data: campaignPostData }] = useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const [tabValue, setTabValue] = useState(0);
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [isLike, setIsLike] = useState(campaignPost?.isLikedByUser);
  const [countLike, setCountLike] = useState(campaignPost?.countOfLikes);
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setCommentsCount(campaignPostData?.getFundRaisingPost?.listDto?.items?.[0]?.countOfComments);
  }, [campaignPostData]);

  // useEffect(() => {
  //   if (query?.id) getFundRaisingPost({ filter: { dto: { id: query.id[0] as string } } });
  // }, [getFundRaisingPost, query]);

  useEffect(() => {
    if (_id) getFundRaisingPost({ filter: { dto: { id: _id as string } } });
  }, [getFundRaisingPost, _id]);

  useEffect(() => {
    setIsLike(campaignPost?.isLikedByUser);
  }, [campaignPost?.isLikedByUser]);
  useEffect(() => {
    setCountLike(campaignPost?.countOfLikes);
  }, [campaignPost?.countOfLikes]);

  return (
    <>
      <Stack direction={'row'} alignItems={'center'} sx={{ p: 2 }}>
        <IconButton onClick={() => back(-1)} sx={{ padding: 0 }}>
          <Icon name="left-arrow-1" color="grey.500" type="linear" />
        </IconButton>

        <Typography sx={{ ml: 2.5 }} variant="subtitle1">
          <FormattedMessage {...PostDetailsMessages.details} />
        </Typography>
      </Stack>

      <Stack>
        <CardStyle>
          <CardMedia component="img" alt="Cover Image" image={campaignPost?.coverImageUrl || emptyIcon} />
          <CardContentStyle>
            <StackContentStyle>
              <Box sx={{ mt: 2 }}>
                <PostDetailsHeader title={campaignPost?.title || ''} isMine={!!campaignPost?.isMine} />
              </Box>
              <Box sx={{ mt: 3 }}>
                <PostDetailsNgoInfo
                  fullName={campaignPost?.fullName || ''}
                  avatar={campaignPost?.userAvatarUrl || ''}
                  location={campaignPost?.placeDescription || ''}
                  createdDateTime={campaignPost?.createdDateTime || ''}
                  userType={campaignPost?.userType as UserTypeEnum}
                  ownerUserId={campaignPost?.ownerUserId || ''}
                  isMine={campaignPost?.isMine as boolean}
                />
              </Box>
              <Box sx={{ mx: -2, mt: 3 }}>
                <PostDetailsDonationDetails
                  dayleft={campaignPost?.dayLeft as number}
                  numberOfDonations={campaignPost?.numberOfDonations || ''}
                  averageRate={campaignPost?.averageRate || ''}
                  numberOfRates={campaignPost?.numberOfRates || ''}
                  raisedMoney={campaignPost?.raisedMoney || ''}
                  target={campaignPost?.target || ''}
                />
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                  <TabStyle active={tabValue === 0} label="About" {...a11yProps(0)} />
                  <TabStyle active={tabValue === 1} label="Donors" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Typography>{ReactHtmlParser(campaignPost?.body || '')}</Typography>
                {value && value > 0 ? (
                  <StarRateWrapper sx={{ mt: 3, mb: 3 }}>
                    <Icon name="emoji-smile" type="linear" color="primary.main" />

                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      <FormattedMessage {...PostDetailsMessages.thanksRating} />
                    </Typography>
                    <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mb: 1 }}>
                      <FormattedMessage {...PostDetailsMessages.commentsRating} />
                    </Typography>
                  </StarRateWrapper>
                ) : (
                  <StarRateWrapper sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      <FormattedMessage {...PostDetailsMessages.campaignsRating} />
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </StarRateWrapper>
                )}
                <Box sx={{ mx: -2 }}>
                  <Divider />
                  <Stack sx={{ p: 2 }}>
                    <PwaPostActions
                      inDetails={true}
                      like={countLike || '0'}
                      countLikeChanged={setCountLike}
                      comment={campaignPost?.countOfComments || '0'}
                      share={campaignPost?.countOfShared || '0'}
                      view={campaignPost?.countOfViews || '0'}
                      id={campaignPost?.id as string}
                      isLikedByUser={isLike || undefined}
                      likeChanged={setIsLike}
                      setCommentOpen={setCommentOpen}
                      commentOpen={commentOpen}
                      postType="campaign"
                      sharedSocialPost={null}
                      sharedCampaignPost={null}
                    />
                  </Stack>
                  <Divider />
                  {!commentOpen ? (
                    <PostCommets
                      PostId={campaignPost?.id as string}
                      countOfComments={campaignPost?.countOfComments || '0'}
                      postType="campaign"
                      commentsCount={commentsCount}
                      setCommentsCount={setCommentsCount}
                    />
                  ) : null}
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <DonorsList donors={campaignPost?.donors as any} />
              </TabPanel>
            </StackContentStyle>
          </CardContentStyle>
        </CardStyle>
      </Stack>
    </>
  );
}

export default CampaignPostDetails;
