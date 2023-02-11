import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Descendant } from 'slate';
import { useCreateSocialPostMutation } from 'src/_graphql/post/create-post/mutations/createSocialPost.generated';
import { useUpdateSocialPostMutation } from 'src/_graphql/post/create-post/mutations/updateSocialPost.generated';
import Dot from 'src/components/Dot';
import { Icon } from 'src/components/Icon';
import ConfirmDialog from 'src/components/dialogs/ConfirmDialog';
import { MentionAndHashtag } from 'src/components/textEditor';
import GolUploader, { IChunkUploadFile, IMediaProps, LimitationType } from 'src/components/upload/GolUploader';
import { fileLimitations } from 'src/config';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { setNewPost, setUpdatePost } from 'src/store/slices/homePage';
import {
  basicCreateSocialPostSelector,
  initialState,
  setAudience,
  setFileWithErrorId,
  setLocation,
  setMediaUrls,
  setText,
} from 'src/store/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/store/slices/upload';
import { Audience, MediaUrlInputType, PostStatus, UserTypeEnum } from 'src/types/serverTypes';
import { v4 as uuidv4 } from 'uuid';

import Media from '../../Media';
import CreatePostMainFotter from './CreatePostMainFootter';
import CreatePostMainHeader from './CreatePostMainHeader';

const UserFullNameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  lineHeight: '22.5px',
  fontSize: '18px',
  color: theme.palette.grey[900],
}));

const ViewrTextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.grey[900],
}));

const ViewerButtonStyle = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 32,
  width: 'fit-content',
}));

const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17.5px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  cursor: 'pointer',
}));

const SocialPostCreateDialog: FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const [startUpload, setStartUpload] = useState<boolean>(false);
  const [createPostRequest] = useCreateSocialPostMutation();
  const [updatePostRequest] = useUpdateSocialPostMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [media, setMedia] = useState<IMediaProps[]>([]);
  const [removingUniqueId, setRemovingUniqueId] = useState<string>('');
  const [showRemoveMap, setShowRemoveMap] = useState<boolean>(false);
  const [creatingLoading, setCreatingLoading] = useState<boolean>(false);
  const [firstInitializeForUpdate, setFirstInitializeForUpdate] = useState<boolean>(false);
  const [fileLimitationError, setFileLimitationError] = useState<LimitationType>('');
  const navigate = useNavigate();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [uploadingFileInformation, setUploadingFileInformation] = useState<IChunkUploadFile | null>(null);
  const [showPostingBanner, setShowPostingBanner] = useState<boolean>(false);
  const [cancelAllUploads, setCancelAllUploads] = useState<boolean>(false);
  const [hideUploadedMediaRemoveIcon, setHideUploadedMediaRemoveIcon] = useState<boolean>(false);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [resendErroringFileFlag, setResendErroringFileFlag] = useState<number>(0);
  const [disableFotterButtons, setDisableFotterButtons] = useState<boolean>(false);

  const restartPostingProcess = () => {
    setCreatingLoading(false);
    setShowPostingBanner(false);
    setDisableFotterButtons(false);
  };

  const open = Boolean(anchorEl);

  const listOfTag: string[] = [];
  const listOfMention: string[] = [];
  let postText = '';
  listOfRichs.forEach((item) => {
    item?.children?.forEach((obj: any) => {
      if (obj.type) {
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
    if (post.gifs) {
      setMedia([...media, { link: post.gifs, previewLink: '', type: 'gif', uniqueId: uuidv4() }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.gifs]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeMedia = (uniqueId: string) => {
    if (media.find((i) => i.type === 'gif')) {
      setMedia([...media.filter((i) => i.uniqueId !== uniqueId)]);
    }
    if (post.editMode) {
      removeMediaForEditMode(uniqueId);
    }
    setRemovingUniqueId(uniqueId);
  };

  const removeMediaForEditMode = (uniqueId: string) => {
    const removingIndex = media.findIndex((i) => i.uniqueId === uniqueId);
    if (removingIndex >= 0) {
      const lastMedia = [...media];
      const newMediaUrls = [...post.mediaUrls.filter((i) => i.url !== lastMedia[removingIndex].link)];
      dispatch(setMediaUrls(newMediaUrls));
      lastMedia.splice(removingIndex, 1);
      setMedia([...lastMedia]);
    }
  };
  const audienceChanged = (audience: Audience) => {
    dispatch(setAudience(audience));
    handleClose();
  };

  useEffect(() => {
    if (post.editMode && !firstInitializeForUpdate) {
      valuingMediaForUpdate();
      setFirstInitializeForUpdate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const valuingMediaForUpdate = () => {
    const newMedia: IMediaProps[] = [];
    post.mediaUrls.forEach((value) => {
      newMedia.push({
        link: value.url as string,
        type: value.isVideo ? 'video' : 'image',
        uniqueId: uuidv4(),
        previewLink: '',
      });
    });

    setMedia([...newMedia]);
  };

  const createPostOrupdatePost = (links?: IMediaProps[]) => {
    setShowPostingBanner(true);
    if (post.editMode) {
      updatePost(links as any);
    } else {
      createPost(links as any);
    }
  };

  const setLinks = (links: IMediaProps[]) => {
    setHideUploadedMediaRemoveIcon(false);
    if (Number(textLimitation) > 0 && links.length === 0) {
      restartPostingProcess();
    } else {
      createPostOrupdatePost(links);
    }
  };

  const convertSlateValueToText = () => {
    let text = '';
    post.text.forEach((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        item.children.forEach((obj: any) => {
          if (obj.type) {
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
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title} `)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
        });
      if (index + 1 !== post.text.length) text += ' \\n';
    });
    return text;
  };

  const createPost = (kinks: IMediaProps[]) => {
    const gifIndex = media.findIndex((i) => i.type === 'gif');
    const addingMedia: MediaUrlInputType[] = media
      .filter((i) => i.link)
      .map((value) => ({
        isVideo: value.type === 'video' ? true : false,
        url: value.link,
      }));
    const addingReceivingMedia = kinks
      ? kinks.map((value) => ({ isVideo: value.type === 'video' ? true : false, url: value.link }))
      : [];
    createPostRequest({
      post: {
        dto: {
          audience: post.audience,
          body: convertSlateValueToText(),
          placeId: post.location && post.location.id ? post.location.id : '',
          mentionedUserIds: listOfMention,
          tagIds: listOfTag,
          mediaUrls:
            gifIndex >= 0 ? [{ isVideo: false, url: media[gifIndex].link }] : [...addingMedia, ...addingReceivingMedia],
          status: PostStatus.Show,
        },
      },
    })
      .unwrap()
      .then((res) => {
        dispatch(setNewPost({ id: res?.createSocialPost?.listDto?.items?.[0]?.id as string, type: 'social' }));
        navigate(PATH_APP.home.index, { replace: true });
        restartPostingProcess();
      })
      .catch((err) => {
        toast.error(err.message);
        navigate(PATH_APP.home.index, { replace: true });
        restartPostingProcess();
      });
  };

  const updatePost = (recivingMedia: IMediaProps[]) => {
    const gifIndex = media.findIndex((i) => i.type === 'gif');
    const addingMedia: MediaUrlInputType[] = media
      .filter((i) => i.link)
      .map((value) => ({
        isVideo: value.type === 'video' ? true : false,
        url: value.link,
      }));
    const addingReceivingMedia = recivingMedia
      ? recivingMedia.map((value) => ({ isVideo: value.type === 'video' ? true : false, url: value.link }))
      : [];
    const mediaUrls: MediaUrlInputType[] = [...addingMedia, ...addingReceivingMedia];

    updatePostRequest({
      socialPost: {
        dto: {
          audience: post.audience,
          body: convertSlateValueToText(),
          placeId: post.location && post.location.id ? post.location.id : '',
          mentionedUserIds: [],
          tagIds: [],
          mediaUrls: gifIndex >= 0 ? [{ isVideo: false, url: media[gifIndex].link }] : mediaUrls,
          status: PostStatus.Show,
          id: post.id,
        },
      },
    })
      .unwrap()
      .then((res) => {
        dispatch(setUpdatePost({ id: res.updateSocialPost?.listDto?.items?.[0]?.id as string, type: 'social' }));
        navigate(PATH_APP.home.index, { replace: true });
        restartPostingProcess();
      })
      .catch((err) => {
        toast.error(err.message);
        navigate(PATH_APP.home.index, { replace: true });
        restartPostingProcess();
      });
  };

  const checkCountOfMedia = () => {
    let imageMediaCount = 0;
    let videoMediaCount = 0;

    uploadingFiles.forEach((file) => {
      if (file.type === 'image') {
        imageMediaCount++;
      } else if (file.type === 'video') {
        videoMediaCount++;
      }
    });

    if (post.editMode) {
      media.forEach((value) => {
        if (value.type === 'image' && value.link) imageMediaCount++;
        else if (value.type === 'video' && value.link) videoMediaCount++;
      });
    }

    if (imageMediaCount > fileLimitations.imageCount) {
      setFileLimitationError('imageCount');
      return false;
    } else if (videoMediaCount > fileLimitations.videoCount) {
      setFileLimitationError('videoCount');
      return false;
    }
    return true;
  };

  const startPost = () => {
    const mediaCountStatus = checkCountOfMedia();
    if (!mediaCountStatus) {
      return;
    }
    setDisableFotterButtons(true);
    setCreatingLoading(true);
    if (uploadingFiles.length > 0) {
      setStartUpload(true);
      setHideUploadedMediaRemoveIcon(true);
    } else {
      createPostOrupdatePost();
    }
  };

  const uploadError = (error: LimitationType) => {
    setFileLimitationError(error);
  };

  const needToConformDialog = () => {
    if (
      post.audience !== initialState.audience ||
      post.gifs !== initialState.gifs ||
      post.location !== initialState.location ||
      post.text !== initialState.text ||
      post.mediaUrls !== initialState.mediaUrls ||
      uploadingFiles.length > 0
    ) {
      setShowConfirmDialog(true);
    } else {
      navigate(PATH_APP.home.index, { replace: true });
    }
  };

  const audienctTypeToString = (audience: Audience) => {
    switch (audience) {
      case Audience.Public:
        return 'Public';
      default:
        return '';
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCancelAllUploads(false);
    }, 10);
  }, [cancelAllUploads]);

  useEffect(() => {
    if (post.fileWithError) {
      toast.error('Uploading has error,resend file or remove it for resume uploading');
    }
  }, [post.fileWithError]);

  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={true}
        onBackdropClick={() => (!showPostingBanner ? needToConformDialog() : null)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <CreatePostMainHeader cancelAllUploads={() => setCancelAllUploads(true)} />
        </DialogTitle>

        <DialogContent sx={{ height: 536, marginTop: 2, padding: 2, position: 'relative', width: '100%' }}>
          <Stack spacing={2} direction="row">
            <Stack sx={{ height: 'inherit' }}>
              <Avatar
                variant={user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
                src={user?.avatarUrl || ''}
                sx={{ width: 48, height: 48 }}
              />
            </Stack>
            <Stack spacing={1}>
              <Stack spacing={1} direction="row">
                <UserFullNameStyle variant="h6">
                  {user?.firstName && user?.lastName ? user.firstName + ' ' + user.lastName : ''}
                </UserFullNameStyle>
                {post.location && post.location.id && (
                  <Stack justifyContent="center">
                    <Dot />
                  </Stack>
                )}
                {post.location && post.location.id && (
                  <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                    <Box sx={{ minWidth: 16, minHeight: 16 }}>
                      <Icon name="location" />
                    </Box>
                    <SelectedLocationStyle
                      onClick={() => navigate(PATH_APP.post.createPost.socialPost.addLocation)}
                      variant="subtitle2"
                    >
                      {post.location.address}
                    </SelectedLocationStyle>
                  </Stack>
                )}
              </Stack>
              <ViewerButtonStyle
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack justifyContent="center">
                    {/* <img src="/icons/location/global.svg" width={20} height={20} alt="post-viewers" /> */}
                    <Icon name="Earth" />
                  </Stack>
                  <ViewrTextStyle variant="body2">{audienctTypeToString(post.audience)}</ViewrTextStyle>
                  <Stack justifyContent="center">
                    <Icon name="down-arrow" />
                  </Stack>
                </Stack>
              </ViewerButtonStyle>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => audienceChanged(Audience.Public)}>Public</MenuItem>
              </Menu>
            </Stack>
          </Stack>
          <MentionAndHashtag
            setListOfRichs={setListOfRichs}
            eventType={'createPost'}
            setTextLimitation={setTextLimitation}
            media={media}
            value={post.text}
            onChange={(value: Descendant[]) => dispatch(setText(value))}
          />
          <Box sx={{ marginTop: 3 }}>
            <Media
              uploadingInformations={
                uploadingFileInformation
                  ? {
                      uniqueId: uploadingFileInformation.uniqueId,
                      uploadProgress: Math.round(uploadingFileInformation.progress),
                    }
                  : undefined
              }
              media={media}
              removeMedia={removeMedia}
              hideUploadedMediaRemoveIcon={hideUploadedMediaRemoveIcon}
              erroredFileRemove={() => {
                if (uploadingFiles.length > 1) {
                  removeMedia(post.fileWithError);
                } else {
                  const removingUniqueIdFile = post.fileWithError;
                  restartPostingProcess();
                  setHideUploadedMediaRemoveIcon(false);
                  dispatch(setFileWithErrorId(''));
                  removeMedia(removingUniqueIdFile);
                }
              }}
              erroredFileResend={() => setResendErroringFileFlag(resendErroringFileFlag + 1)}
            />
          </Box>

          <GolUploader
            resendFileFlag={resendErroringFileFlag}
            chunkFileUploadingChanges={setUploadingFileInformation}
            uploadeError={uploadError}
            uploadedLinkAdded={setLinks}
            previewLinksAdded={(previews) => {
              if (post.editMode) {
                setMedia([...media, ...previews]);
              } else {
                setMedia([...media, ...previews]);
              }
            }}
            linkRemoved={(link) => {
              setMedia([...media.filter((i) => i.uniqueId !== link.uniqueId)]);
            }}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.gif'],
              'video/*': ['.3gp', '.mkv', '.mp4'],
            }}
            removingUniqueId={removingUniqueId}
            uploadStart={startUpload}
            variant="withOutUi"
            showInput={showUpload}
            cancelAllUpload={cancelAllUploads}
          />
        </DialogContent>

        <DialogActions sx={{ padding: '0!important' }}>
          <CreatePostMainFotter
            disableButtons={disableFotterButtons}
            textLimitation={textLimitation}
            media={media}
            okLimitationClicked={() => setFileLimitationError('')}
            limitationError={fileLimitationError}
            loading={creatingLoading}
            startPosting={() => {
              // setStartUpload(true);
              startPost();
            }}
            addImage={() => {
              setShowUpload(true);
              setTimeout(() => {
                setShowUpload(false);
              }, 10);
            }}
          />
        </DialogActions>

        {showPostingBanner && (
          <Stack
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'white',
              zIndex: 10,
            }}
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <img src="/images/post/posting.svg" width={230} height={175} alt="posting" />
            <Typography
              variant="body1"
              sx={{ fontWeight: '300', fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
            >
              Posting...
            </Typography>
          </Stack>
        )}

        <ConfirmDialog
          confirmText="Are you sure for remove this location?"
          actionButtonText="Approve"
          open={showRemoveMap}
          onClose={() => setShowRemoveMap(false)}
          titleText="Remove Location"
          confirm={() => dispatch(setLocation(null))}
        />
      </Dialog>
      <ConfirmDialog
        confirmText="Unsaved Data will be lost. Do you want to Continue?"
        actionButtonText="Confirm"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        titleText="Exit Social Create Dialog"
        confirm={() => {
          navigate(PATH_APP.home.index, { replace: true });
          setCancelAllUploads(true);
        }}
      />
    </>
  );
};

export default SocialPostCreateDialog;
