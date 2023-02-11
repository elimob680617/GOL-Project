// @mui
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { useDeleteFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/deletePost.generated';
import { Icon } from 'src/components/Icon';
import NotFound from 'src/components/notFound/NotFound';
import { PATH_APP } from 'src/routes/paths';
import { PostStatus } from 'src/types/serverTypes';

import CampaginPostMessages from '../campaginPost.messages';

export interface IPost {
  id: string;
  title: string;
  ownerUserId: string;
  status: PostStatus;
  coverImageUrl: string;
  createdDateTime: string;
}
interface DraftsDialogProps {
  open: boolean;
  onClose: () => void;
  posts: IPost[];
  removedPost: (id: string) => void;
  variant: 'draft' | 'article' | 'campaign';
  loading: boolean;
}

const CoverDraftImage = styled('img')(({ theme }) => ({
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '100%',
  objectFit: 'cover',
}));
const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

function CampaignPostListDialog(props: DraftsDialogProps) {
  const { open, onClose, posts, removedPost, variant, loading } = props;
  const theme = useTheme();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [removePost, { isLoading: removingLoading }] = useDeleteFundRaisingPostMutation();
  const [title] = useState<string>(variant);
  const navigate = useNavigate();
  const height = '656px';
  const { formatMessage } = useIntl();
  return (
    <>
      <Dialog fullWidth={true} keepMounted open={open} onClose={onClose}>
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.text.primary} sx={{ fontWeight: 'bold' }}>
              <FormattedMessage
                {...CampaginPostMessages.yourCampaginsSummary}
                values={{ title, length: posts.length }}
              />
            </Typography>
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              {/* <CloseSquare variant="Outline" color={theme.palette.text.primary} /> */}
              <Stack alignItems="center" justifyContent="center">
                <img width={24} height={24} src="/icons/Close/24/Outline.svg" alt="close" />
              </Stack>
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          {!loading && (
            <Stack spacing={2}>
              {posts.map((post, index) => (
                <>
                  {index !== 0 && <Divider />}
                  <Stack spacing={3} sx={{ marginTop: 3 }}>
                    <Stack spacing={1}>
                      <Typography
                        sx={{ wordBreak: 'break-word' }}
                        variant="h6"
                        color={post.title ? theme.palette.primary.main : 'text.primary'}
                      >
                        {post.title ? post.title : 'Untitled'}
                      </Typography>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        <FormattedMessage
                          values={{ date: post.createdDateTime }}
                          {...CampaginPostMessages.lastModified}
                        />
                      </Typography>
                    </Stack>
                    {post.coverImageUrl && (
                      <Stack>
                        <CoverDraftImage alt="Cover Image" height={'177px'} src={post.coverImageUrl} />
                      </Stack>
                    )}

                    <Stack spacing={2} direction={'row'}>
                      {editingIndex === index ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: theme.palette.background.neutral,
                            borderRadius: 1,
                            py: 1,
                            px: 1,
                            width: '100%',
                            gap: 2,
                          }}
                        >
                          <Typography variant="subtitle2" color={theme.palette.text.primary}>
                            <FormattedMessage values={{ title: post.title }} {...CampaginPostMessages.sureDelete} />
                          </Typography>
                          <Button onClick={() => setEditingIndex(null)}>
                            <Typography variant="subtitle2" color={theme.palette.primary.main}>
                              <FormattedMessage {...CampaginPostMessages.cancel} />
                            </Typography>
                          </Button>
                          <LoadingButton
                            loading={editingIndex === index && removingLoading}
                            onClick={() =>
                              removePost({ fundRaisingPost: { dto: { id: post.id } } })
                                .unwrap()
                                .then((res) => {
                                  removedPost(post.id);
                                  setEditingIndex(null);
                                })
                                .catch((err) => {
                                  setEditingIndex(null);
                                })
                            }
                          >
                            <Typography variant="subtitle2" color={theme.palette.error.main}>
                              <FormattedMessage {...CampaginPostMessages.delete} />
                            </Typography>
                          </LoadingButton>
                        </Box>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              navigate(
                                `${
                                  variant === 'draft'
                                    ? PATH_APP.post.createPost.campainPost.draft
                                    : PATH_APP.post.createPost.campainPost.edit
                                }/${post.id}`,
                              );
                              onClose();
                            }}
                            variant="text"
                            sx={{ display: 'flex', gap: 1, cursor: 'pointer', alignItems: 'center' }}
                          >
                            <Icon name="Edit-Pen" />
                            <Typography variant="body2" color={theme.palette.text.primary}>
                              <FormattedMessage {...CampaginPostMessages.edit} />
                            </Typography>
                          </Button>
                          <Button
                            variant="text"
                            sx={{ display: 'flex', gap: 1, cursor: 'pointer', alignItems: 'center' }}
                            onClick={() => setEditingIndex(index)}
                          >
                            <Icon name="trash" />

                            <Typography variant="body2" color={theme.palette.text.primary}>
                              <FormattedMessage {...CampaginPostMessages.delete} />
                            </Typography>
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </>
              ))}
            </Stack>
          )}
          {loading && (
            <Stack sx={{ height }} alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          )}
          {!loading && posts.length === 0 && (
            <Stack sx={{ height }} alignItems="center" justifyContent="center">
              <NotFound text={formatMessage(CampaginPostMessages.notFound)} />
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CampaignPostListDialog;
