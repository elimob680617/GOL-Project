/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Resumable from 'resumablejs';
import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import { useCreateFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/createCampainPost.generated';
import { useUpdateFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/updateCampaignPost.generated';
import {
  GetFundRaisingPostForEditQuery,
  useLazyGetFundRaisingPostForEditQuery,
} from 'src/_graphql/post/campaign-post/queries/getCampaignPostForEdit.generated';
import { useLazyGetFundRaisingPostsQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignPosts.generated';
import { useCreatePlaceMutation } from 'src/_graphql/post/mutations/createPlace.generated';
import { Icon } from 'src/components/Icon';
import { Advanced } from 'src/components/textEditor';
import { IEditorObject } from 'src/components/textEditor/advanced/Advanced';
import useAuth from 'src/hooks/useAuth';
import useCampgingCategories from 'src/hooks/useCampginCategories';
import useDebounce from 'src/hooks/useDebounce';
import { PATH_APP } from 'src/routes/paths';
import CampaignPostExpireDateDialog from 'src/sections/post/campaignPost/careateCampaignPost/CampaignPostExpireDateDialog';
import CampaignPostListDialog from 'src/sections/post/campaignPost/careateCampaignPost/CampaignPostListDialog';
import { dispatch } from 'src/store';
import { setNewPost } from 'src/store/slices/homePage';
import { Audience, PostStatus } from 'src/types/serverTypes';
import { convertToBase64 } from 'src/utils/fileFunctions';
import { v4 as uuidv4 } from 'uuid';

import CampaginPostMessages from '../campaginPost.messages';

dayjs.extend(utc);

interface IImageWrapperInterface {
  hasImage: boolean;
  dragActive: boolean;
}
interface IImageCoverInterface {
  blured?: boolean;
}

const ImageWrapperStyle = styled(Stack)<IImageWrapperInterface>(({ theme, hasImage, dragActive }) => ({
  backgroundColor: theme.palette.background.neutral,
  borderRadius: 2,
  ...(!hasImage && { padding: theme.spacing(8, 3) }),
  overflow: 'hidden',
  ...(dragActive && { opacity: 0.72 }),
  position: 'relative',
  cursor: 'pointer',
}));

const ImageCoverStyle = styled('img')<IImageCoverInterface>(({ theme, blured }) => ({
  width: '100%',
  marginTop: `${0}!important`,
  ...(blured && { filter: 'blur(8px)' }),
}));

const MenuButtonStyle = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1, 2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 'fit-content',
}));

const MenuTextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.grey[900],
}));

const RemoveCoverImageStyle = styled('button')(({ theme }) => ({
  borderRadius: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface IFormInterface {
  deadLine: string | null;
  target: string;
  place: IPlace | null;
  category: number | null;
  title: string;
}

const formInitialize: IFormInterface = {
  category: null,
  deadLine: null,
  place: null,
  target: '',
  title: '',
};

interface IPlace {
  description: string;
  placeId?: string;
  structuredFormatting?: {
    mainText?: string;
    secondaryText?: string;
  };
}

const config: Resumable.ConfigurationHash = {
  generateUniqueIdentifier() {
    return uuidv4();
  },
  testChunks: false,
  chunkSize: 1 * 1024 * 1024,
  simultaneousUploads: 1,
  fileParameterName: 'file',
  forceChunkSize: true,
  uploadMethod: 'PUT',
  chunkNumberParameterName: 'chunkNumber',
  chunkSizeParameterName: 'chunkSize',
  currentChunkSizeParameterName: 'chunkSize',
  fileNameParameterName: 'fileName',
  totalSizeParameterName: 'totalSize',
};

const editorValueInitialValue: IEditorObject = { body: '' };

const CreateCampaignPost: FC = () => {
  const theme = useTheme();
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState<boolean>(false);
  const {
    trigger,
    setValue,
    getValues,
    formState: { errors, isValid },
    control,
    clearErrors,
  } = useForm<IFormInterface>({ mode: 'onSubmit', shouldFocusError: true, defaultValues: { category: 0 } });
  const [createCampaignPost] = useCreateFundRaisingPostMutation();
  const [updateCampaignPost] = useUpdateFundRaisingPostMutation();
  const [draftCampaignPost, { isLoading: darftingLoading }] = useCreateFundRaisingPostMutation();
  const [updateDraftPost, { isLoading: updatingDraftLoading }] = useUpdateFundRaisingPostMutation();
  const [editorValue, setEditorValue] = useState<IEditorObject>(editorValueInitialValue);
  const editorValueRef = useRef<IEditorObject>(editorValueInitialValue);
  const [disableRealTimeChanging, setDisableRealTimeChanging] = useState<boolean>(true);
  const isDrafting = useRef<boolean>(false);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [getDrafts, { isLoading: draftsLoading, data: draftResponse }] = useLazyGetFundRaisingPostsQuery();
  const [getPosts, { isLoading: postsLoading, data: postResponse }] = useLazyGetFundRaisingPostsQuery();
  const [getPostForEdit, { isFetching: gettingPostLoading }] = useLazyGetFundRaisingPostForEditQuery();
  const [gettedPostForUpdate, setGettedPostForUpdate] = useState<GetFundRaisingPostForEditQuery | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [resumable] = useState<Resumable>(new Resumable(config));
  const categories = useCampgingCategories();
  const { formatMessage } = useIntl();

  const openMenu = Boolean(menuEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuEl(null);
  };

  const [searchedPlaceText, setSearchedPlaceText] = useState<string>('');
  const searchedPlaceDebouncedValue = useDebounce<string>(searchedPlaceText, 500);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [audience] = useState<Audience>(Audience.Public);
  const [openDraftDialog, setOpenDraftDialog] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [getPlaces, { isFetching: gettingPlaceLoading, data: placesResponse }] = useLazySearchPlacesQuery();
  const [getEditorValue, setGetEditorValue] = useState<number>(0);
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [openPublishDialog, setOpenPublishDialog] = useState<boolean>(false);
  const [isValidEditor, setIsValidEditor] = useState<boolean>(false);
  const [createPlaceReq] = useCreatePlaceMutation();
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [firstValuingPlace, setFirstValuingPlace] = useState<boolean>(true);
  const [initializeEditorValue, setInitializeEditorValue] = useState<IEditorObject | null>(null);
  const onWorkPostId = useRef<string>('');
  const editorObjectForPublishRef = useRef<IEditorObject | null>(null);
  const [target, setTarget] = useState<string>('');
  const targetDebounce = useDebounce<string>(target, 500);
  const [triggerFirstTime, setTriggerFirstTime] = useState<boolean>(true);
  const [title, setTitle] = useState<string | null>(null);
  const [coverImageBase64, setCoverImageBase64] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const uploadServiceUrl = process.env.NEXT_UPLOAD_URL;
  const titleDebouncedValue = useDebounce<string | null>(title, 500);
  const { id, processType } = useParams<'processType' | 'id'>();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.bmp', '.gif'],
    },
  });

  const handleDraftsDialog = () => {
    setOpenDraftDialog(true);
    handleCloseMenu();
  };

  const handleArticleDialog = () => {
    setOpenPostDialog(true);
    handleCloseMenu();
  };

  const handleNewCampaignPost = () => {
    handleCloseMenu();
    setTimeout(() => {
      navigate(PATH_APP.post.createPost.campainPost.new);
    }, 1);
  };

  useEffect(() => {
    const addingPlaces = placesResponse?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((place) => {
      const addingPlace: IPlace = {
        description: place?.description as string,
        placeId: place?.placeId as string,
        structuredFormatting: {
          mainText: place?.structuredFormatting?.mainText as string,
          secondaryText: place?.structuredFormatting?.secondaryText as string,
        },
      };
      return addingPlace;
    });
    setPlaces(addingPlaces as IPlace[]);
  }, [placesResponse]);

  useEffect(() => {
    setDrafts([...(draftResponse?.getHomePageFundRaisingPosts?.listDto?.items || [])]);
  }, [draftResponse]);

  useEffect(() => {
    setPosts([...(postResponse?.getHomePageFundRaisingPosts?.listDto?.items || [])]);
  }, [postResponse]);

  useEffect(() => {
    isDrafting.current = false;
    if (processType === 'new') {
      clearErrors();
      onWorkPostId.current = '';
      setGettedPostForUpdate(null);
      setInitializeEditorValue({ body: '' });
      setCoverImageUrl('');
      setCoverImageBase64('');
      setValue('title', formInitialize.title);
      setTitle(formInitialize.title);
      setValue('category', formInitialize.category);
      setValue('deadLine', null);
      setValue('place', formInitialize.place);
      setValue('target', formInitialize.target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processType]);

  const numberWithCommas = (x: string) => {
    const numberText = x.replace(/,/g, '');
    return numberText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    if (searchedPlaceDebouncedValue)
      getPlaces({
        filter: { dto: { searchText: searchedPlaceDebouncedValue } },
      });
  }, [searchedPlaceDebouncedValue]);

  useEffect(() => {
    if (!user?.id) return;
    getDrafts({ filter: { dto: { status: PostStatus.Draft, ownerUserId: user.id } } });
    getPosts({ filter: { dto: { status: PostStatus.Show, ownerUserId: user.id } } });
  }, [user]);

  useEffect(() => {
    setDisableRealTimeChanging(true);
    const currentPostId = id;
    if (currentPostId && onWorkPostId.current !== currentPostId) {
      getPostForEdit({ filter: { dto: { id: currentPostId } } })
        .unwrap()
        .then((res) => setGettedPostForUpdate(res))
        .catch((err) => {
          setGettedPostForUpdate(null);
          navigate(PATH_APP.post.createPost.campainPost.new);
        });
    }
  }, [getPostForEdit, id]);

  useEffect(() => {
    setDisableRealTimeChanging(true);
  }, []);

  const checkPostOwner = () => {
    const postOwnerId = gettedPostForUpdate?.getFundRaisingPost?.listDto?.items?.[0]?.ownerUserId || null;
    if (postOwnerId === user?.id || !postOwnerId) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const ownerFlag = checkPostOwner();
    if (!ownerFlag) {
      navigate(PATH_APP.post.createPost.campainPost.new);
      return;
    }
    if (gettedPostForUpdate) {
      const post = gettedPostForUpdate?.getFundRaisingPost?.listDto?.items?.[0];
      let localTime: string | null = null;
      if (post?.deadline) {
        localTime = dayjs(post.deadline).local().format('YYYY-MM-DD');
      }
      setCoverImageUrl(post?.coverImageUrl || '');
      setCoverImageBase64(post?.coverImageUrl || '');
      setValue('title', post?.title || '');
      setTitle(post?.title || '');
      setValue('target', post?.target ? numberWithCommas(post?.target.toString()) : formInitialize.target);
      setValue('deadLine', localTime);
      setValue(
        'place',
        post?.placeId
          ? {
              description: post?.placeDescription as string,
              placeId: post?.placeId as string,
              structuredFormatting: {
                mainText: post?.placeMainText as string,
                secondaryText: post?.placeSecondaryText as string,
              },
            }
          : null,
      );
      setValue('category', post?.category as any);
      setInitializeEditorValue({
        body: post?.body || '',
      });

      trigger('category');
      trigger('deadLine');
      trigger('place');
      trigger('target');
      trigger('title');
      valuingEditorValue({ body: post?.body || '' });
    }
  }, [gettedPostForUpdate]);

  const valuingEditorValue = (value: IEditorObject) => {
    setEditorValue(value);
    editorValueRef.current = value;
  };

  const handlePublish = (editorObject: IEditorObject) => {
    editorObjectForPublishRef.current = editorObject;
    setActionLoading(true);
    if (!darftingLoading && !updatingDraftLoading) {
      publishPost();
    }
  };

  const publishPost = () => {
    const utcTime = dayjs.utc(getValues('deadLine'), 'YYYY-MM-DD').format();
    const editorObject = editorObjectForPublishRef.current;
    if (!editorObject) return;
    const placeId = getValues('place')?.placeId;
    if (id) {
      updateCampaignPost({
        fundraisingPost: {
          dto: {
            audience,
            body: editorObject.body,
            category: (getValues('category') as any) ?? 1,
            coverImageUrl: coverImageUrl,
            deadline: utcTime,
            placeId: placeId,
            title: getValues('title') || '',
            target: getValues('target') ? Number.parseInt(getValues('target').replace(/,/g, '')) : null,
            status: PostStatus.Show,
            id,
            tagIds: editorObject.tagIds || [],
            summary: editorObject.summary,
          },
        },
      })
        .unwrap()
        .then((res) => {
          onWorkPostId.current = res?.updateFundRaisingPost?.listDto?.items?.[0]?.id as string;
          dispatch(setNewPost({ id: res?.updateFundRaisingPost?.listDto?.items?.[0]?.id as string, type: 'campaign' }));

          setActionLoading(false);
          editorObjectForPublishRef.current = null;
          navigate(PATH_APP.home.index);
        })
        .catch((err) => {
          setActionLoading(false);
          editorObjectForPublishRef.current = null;
        });
      return;
    }
    createCampaignPost({
      fundraisingPost: {
        dto: {
          audience,
          body: editorObject.body,
          category: (getValues('category') as any) ?? 1,
          coverImageUrl: coverImageUrl,
          deadline: utcTime,
          placeId: placeId,
          title: getValues('title') || '',
          target: getValues('target') ? Number.parseInt(getValues('target').replace(/,/g, '')) : null,
          status: PostStatus.Show,
          tagIds: editorObject.tagIds || [],
          summary: editorObject.summary,
        },
      },
    })
      .unwrap()
      .then((res) => {
        onWorkPostId.current = res?.createFundRaisingPost?.listDto?.items?.[0]?.id as string;
        dispatch(setNewPost({ id: res?.createFundRaisingPost?.listDto?.items?.[0]?.id as string, type: 'campaign' }));

        setActionLoading(false);
        editorObjectForPublishRef.current = null;
        navigate(PATH_APP.home.index);
      })
      .catch((err) => {
        setActionLoading(false);
        editorObjectForPublishRef.current = null;
      });
  };

  const draftPost = () => {
    if (processType === 'edit') return;
    let utcTime: string | null = null;
    if (getValues('deadLine')) {
      utcTime = dayjs.utc(getValues('deadLine'), 'YYYY-MM-DD').format();
    }
    setDisableRealTimeChanging(true);
    if (processType === 'new') {
      if (isDrafting.current) return;
      isDrafting.current = true;

      draftCampaignPost({
        fundraisingPost: {
          dto: {
            audience,
            body: editorValueRef.current.body || '',
            category: getValues('category') ? (getValues('category') as any) : 1,
            coverImageUrl: coverImageUrl || '',
            deadline: utcTime,
            placeId: getValues('place') ? getValues('place')?.placeId : null,
            title: getValues('title') || '',
            target: getValues('target') ? Number.parseInt(getValues('target').replace(/,/g, '')) : null,
            status: PostStatus.Draft,
          },
        },
      })
        .unwrap()
        .then((res) => {
          const resId = res?.createFundRaisingPost?.listDto?.items?.[0]?.id as string;
          onWorkPostId.current = resId;
          isDrafting.current = false;

          navigate(`${PATH_APP.post.createPost.campainPost.draft}/${resId}`);
          setDisableRealTimeChanging(false);
          if (editorObjectForPublishRef.current) {
            publishPost();
          }
        })
        .catch((err) => {
          setDisableRealTimeChanging(false);
          isDrafting.current = false;
        });
    } else if (processType === 'draft') {
      updateDraftPost({
        fundraisingPost: {
          dto: {
            audience,
            body: editorValueRef.current.body || '',
            category: getValues('category') ? (getValues('category') as any) : 1,
            coverImageUrl: coverImageUrl || '',
            deadline: utcTime,
            placeId: getValues('place') ? getValues('place')?.placeId : null,
            title: getValues('title') || '',
            target: getValues('target') ? Number.parseInt(getValues('target').replace(/,/g, '')) : null,
            status: PostStatus.Draft,
            id,
          },
        },
      })
        .unwrap()
        .then((res) => {
          isDrafting.current = false;
          onWorkPostId.current = res?.updateFundRaisingPost?.listDto?.items?.[0]?.id as string;
          setDisableRealTimeChanging(false);
          if (editorObjectForPublishRef.current) {
            publishPost();
          }
        })
        .catch((err) => {
          setDisableRealTimeChanging(false);
          isDrafting.current = false;
        });
    }
  };

  const removedDraftFromUi = (removedId: string) => {
    setDrafts([...drafts.filter((i) => i.id !== removedId)]);
  };

  const removedPostFromUi = (removedId: string) => {
    setPosts([...posts.filter((i) => i.id !== removedId)]);
  };

  useEffect(() => {
    if (!disableRealTimeChanging) {
      draftPost();
    }
    if (!triggerFirstTime) trigger('target');
  }, [targetDebounce]);

  const removeCoverImage = () => {
    setDisableRealTimeChanging(false);
    setCoverImageBase64('');
    setCoverImageUrl('');
  };

  const upload = (file: File) => {
    resumable.addFile(file);
    const creationSessionId = Number.parseInt(`${Math.random() * 1000}`);
    fetch(`${uploadServiceUrl}api/fileupload/create/${creationSessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chunkSize: resumable!.opts.chunkSize,
        totalSize: file.size,
        fileName: file.name,
      }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        resumable.opts.target = `${uploadServiceUrl}api/fileupload/upload/user/${creationSessionId}/session/${data.sessionId}`;
        resumable.upload();
      });
  };
  const imageChoosed = (file: File) => {
    upload(file);
  };

  const coverImageChoosed = async (file: File) => {
    const preview = await convertToBase64(file);
    setCoverImageBase64(preview);
    imageChoosed(file);
  };

  useEffect(() => {
    if (acceptedFiles[0]) {
      removeCoverImage();
      coverImageChoosed(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (resumable) {
      resumable.on('fileSuccess', (file: Resumable.ResumableFile, message: string) => {
        setCoverImageUrl(message.replace(/["']/g, ''));
      });

      resumable.on('fileError', (file, message) => {
        toast.error('Cover image upload has error');
        removeCoverImage();
      });
    }
  }, [resumable]);

  useEffect(() => {
    if (titleDebouncedValue !== null && !disableRealTimeChanging) {
      draftPost();
    }
  }, [titleDebouncedValue]);

  useEffect(() => {
    if (coverImageUrl !== null && !disableRealTimeChanging) {
      draftPost();
    }
  }, [coverImageUrl]);

  useEffect(() => {
    setIsValidEditor(title && title.length > 4 && title.length <= 220 && coverImageUrl ? true : false);
  }, [title, coverImageUrl]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        {gettingPostLoading ? (
          <Skeleton variant="rectangular" width={317} height={25} />
        ) : (
          <Typography variant="h4" color="text.primary">
            <FormattedMessage {...CampaginPostMessages.create} />
          </Typography>
        )}

        <Stack direction="row" spacing={1}>
          {gettingPostLoading ? (
            <Skeleton variant="rectangular" width={100} height={40} />
          ) : (
            <>
              <MenuButtonStyle
                id="select-button"
                aria-controls={openMenu ? 'select-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={handleClickMenu}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MenuTextStyle variant="body2">
                    <FormattedMessage {...CampaginPostMessages.menu} />
                  </MenuTextStyle>

                  <Stack justifyContent="center">
                    <img src="/icons/arrow/arrow-down.svg" width={20} height={20} alt="post-viewers" />
                  </Stack>
                </Stack>
              </MenuButtonStyle>
              <Stack spacing={2}>
                <Menu
                  id="select-menu"
                  anchorEl={menuEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    'aria-labelledby': 'select-button',
                  }}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={handleNewCampaignPost} sx={{ p: 1, mx: 1 }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                      <FormattedMessage {...CampaginPostMessages.newCampagin} />
                    </Typography>
                  </MenuItem>
                  <Divider sx={{ mx: 1 }} />
                  <MenuItem onClick={handleDraftsDialog} sx={{ p: 1, mx: 1 }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                      <FormattedMessage {...CampaginPostMessages.myDrafts} />
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleArticleDialog} sx={{ p: 1, mx: 1 }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                      <FormattedMessage {...CampaginPostMessages.myCampagins} />
                    </Typography>
                  </MenuItem>
                </Menu>
              </Stack>
            </>
          )}

          {gettingPostLoading ? (
            <Skeleton variant="rectangular" width={159} height={40} />
          ) : (
            <Button
              disabled={!isValid || !isValidEditor || fileUploading}
              onClick={() => {
                if (isValid) {
                  setOpenPublishDialog(true);
                }
              }}
              sx={{ width: 160 }}
              variant="primary"
            >
              <FormattedMessage {...CampaginPostMessages.publish} />
            </Button>
          )}
        </Stack>
      </Stack>
      <form>
        <Stack spacing={4}>
          {gettingPostLoading ? (
            <Skeleton variant="rectangular" width="100%" height={352} />
          ) : (
            <ImageWrapperStyle
              dragActive={isDragActive}
              hasImage={!!coverImageBase64}
              {...(!coverImageBase64 && getRootProps())}
              alignItems="center"
              spacing={4}
            >
              {!coverImageBase64 && (
                <>
                  <input {...getInputProps()} />
                  <img src="/icons/camera/camera.svg" width={80} height={80} alt="cover-select" />
                  <Typography variant="h3" color="text.secondary">
                    <FormattedMessage {...CampaginPostMessages.noCoverImage} />
                  </Typography>
                  <Stack alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                      <FormattedMessage {...CampaginPostMessages.coverImagePoint} />
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <FormattedMessage {...CampaginPostMessages.recomendedCoverImage} />
                    </Typography>
                  </Stack>
                </>
              )}

              {coverImageBase64 && <ImageCoverStyle blured={!coverImageUrl} src={coverImageBase64} width="100%" />}
              {coverImageUrl && (
                <Stack sx={{ position: 'absolute', bottom: (t) => t.spacing(2) }} alignItems="center">
                  <RemoveCoverImageStyle onClick={() => removeCoverImage()}>
                    <img width={24} height={24} src="/icons/recyclebin.svg" alt="remove-cover" />
                  </RemoveCoverImageStyle>
                </Stack>
              )}
            </ImageWrapperStyle>
          )}

          <Stack justifyContent="center">
            {gettingPostLoading ? (
              <Skeleton variant="rectangular" width="100%" height={40} />
            ) : (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { value, onBlur } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      value={value}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setValue('title', e.target.value);
                      }}
                      onBlur={() => trigger('title')}
                      onKeyDown={() => setDisableRealTimeChanging(false)}
                      sx={{
                        // '& fieldset': { border: 'none!important' },
                        '& textarea': { fontWeight: '700' },
                        '& textarea::placeholder': { color: 'text.secondary' },
                      }}
                      placeholder={formatMessage({ ...CampaginPostMessages.addTitle })}
                      variant="outlined"
                      error={errors.title ? true : false}
                      helperText={
                        !errors.title
                          ? ''
                          : errors.title.type === 'required'
                          ? formatMessage({ ...CampaginPostMessages.isRequired }, { value: 'Title' })
                          : ''
                      }
                    />
                  )}
                  rules={{
                    required: true,
                  }}
                />
                {title && title?.length > 220 && (
                  <Stack spacing={0.5} direction="row" alignItems="center">
                    <img src="/icons/Exclamation Mark/24/Outline.svg" width={24} height={24} alt="Exclamation Mark" />
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      <FormattedMessage {...CampaginPostMessages.charactersMaximum} />
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>

          <Stack spacing={6} direction="row" flexWrap="wrap">
            {gettingPostLoading ? (
              <Skeleton variant="rectangular" width={410} height={40} />
            ) : (
              <Controller
                name="deadLine"
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <TextField
                    size="small"
                    onClick={() => {
                      setDeadlineDialogOpen(true);
                    }}
                    onBlur={() => trigger('deadLine')}
                    value={value || ''}
                    sx={{ width: 410 }}
                    label={formatMessage({ ...CampaginPostMessages.deadLine })}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <img width={24} height={24} src="/icons/calendar/24/Outline.svg" alt="deadline" />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      !errors.deadLine
                        ? formatMessage({ ...CampaginPostMessages.deadLineHelper })
                        : errors.deadLine.type === 'required'
                        ? formatMessage({ ...CampaginPostMessages.isRequired }, { value: 'Deadline' })
                        : ''
                    }
                    variant="outlined"
                    error={errors.deadLine ? true : false}
                  />
                )}
                // rules={{ required: true }}
              />
            )}
            {gettingPostLoading ? (
              <Skeleton variant="rectangular" width={410} height={40} />
            ) : (
              <Controller
                name="target"
                control={control}
                render={({ field: { value, onBlur, onChange } }) => (
                  <TextField
                    size="small"
                    onPaste={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const clipboardData = e.clipboardData || (window as any).clipboardData;
                      const pastedData = clipboardData.getData('Text');
                      const priceFlag = /^[0-9,]*$/.test(pastedData);
                      if (priceFlag) {
                        setValue('target', numberWithCommas(pastedData));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        !/^-?\d+$/.test(e.key) &&
                        e.key !== 'Backspace' &&
                        !(
                          (e.ctrlKey || e.metaKey) &&
                          (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'x')
                        )
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onChange={(e) => {
                      setDisableRealTimeChanging(false);
                      setValue('target', numberWithCommas(e.target.value));
                      setTarget(e.target.value);
                      setTriggerFirstTime(false);
                    }}
                    sx={{ width: 410 }}
                    label={formatMessage({ ...CampaginPostMessages.target })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img width={28} height={28} src="/icons/dollar coin/24/Outline.svg" alt="deadline" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    onBlur={() => trigger('target')}
                    error={errors.target ? true : false}
                    helperText={
                      !errors.target
                        ? formatMessage({ ...CampaginPostMessages.targetHelper })
                        : errors.target.type === 'required'
                        ? formatMessage({ ...CampaginPostMessages.isRequired }, { value: 'Target' })
                        : errors.target.type === 'validate'
                        ? formatMessage({ ...CampaginPostMessages.targetMinMax })
                        : ''
                    }
                    value={value}
                  />
                )}
                rules={{
                  required: true,
                  validate: (validateTarget) => {
                    const targetNumber = validateTarget ? Number.parseInt(validateTarget.replace(/,/g, '')) : null;
                    if (targetNumber === null) {
                      return true;
                    } else if (targetNumber > 999000000 || targetNumber <= 0) {
                      return false;
                    }
                    return true;
                  },
                }}
              />
            )}
          </Stack>
          <Stack spacing={6} direction="row" flexWrap="wrap">
            {gettingPostLoading ? (
              <Skeleton variant="rectangular" width={410} height={40} />
            ) : (
              <Controller
                name="place"
                control={control}
                render={({ field: { value } }) => (
                  <Autocomplete
                    size="small"
                    loading={gettingPlaceLoading}
                    value={value ?? ''}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        return;
                      } else if (newValue) {
                        createPlaceReq({
                          place: {
                            dto: {
                              id: newValue?.placeId,
                              description: newValue?.description,
                              mainText: newValue?.structuredFormatting?.mainText,
                              secondaryText: newValue?.structuredFormatting?.secondaryText,
                            },
                          },
                        });
                        setValue('place', newValue || null);
                        trigger('place');
                        draftPost();
                      }
                    }}
                    filterOptions={(options) => options || []}
                    selectOnFocus
                    handleHomeEndKeys
                    options={places || []}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') {
                        return option;
                      } else {
                        return option.description;
                      }
                    }}
                    onInputChange={(e, newInputValue) => {
                      if (firstValuingPlace) return;
                      setPlaces([]);
                      setSearchedPlaceText(newInputValue);
                    }}
                    renderOption={(props, option) => <li {...props}>{(option as IPlace).description}</li>}
                    sx={{ flex: 1 }}
                    freeSolo
                    renderInput={(params) => {
                      params.InputProps.startAdornment = (
                        <>
                          <InputAdornment position="start">
                            <img width={24} height={24} src="/icons/location/24/Outline.svg" alt="location" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      );
                      return (
                        <TextField
                          {...params}
                          onChange={() => setFirstValuingPlace(false)}
                          onBlur={() => trigger('place')}
                          error={errors.place ? true : false}
                          helperText={
                            errors?.place
                              ? formatMessage({ ...CampaginPostMessages.isRequired }, { value: 'Location' })
                              : ''
                          }
                          label={formatMessage({ ...CampaginPostMessages.location })}
                        />
                      );
                    }}
                  />
                )}
                rules={{ required: true }}
              />
            )}

            {gettingPostLoading ? (
              <Skeleton variant="rectangular" width={410} height={40} />
            ) : (
              <Controller
                name="category"
                control={control}
                render={({ field: { value } }) => (
                  <FormControl sx={{ flex: 1 }} error={!!errors.category}>
                    <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                    <Select
                      size="small"
                      error={errors.category ? true : false}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={value || ''}
                      label="Categories"
                      onChange={(e) => {
                        setValue('category', e.target.value as any);
                        trigger('category');
                        draftPost();
                      }}
                      onBlur={() => trigger('category')}
                      startAdornment={
                        !value && (
                          <img
                            width={24}
                            height={24}
                            src={'/icons/User Interface/Linear/Catrgories.svg'}
                            alt="category"
                          />
                        )
                      }
                    >
                      {categories?.getCampaignCategoriesQuery?.listDto?.items &&
                        categories?.getCampaignCategoriesQuery?.listDto?.items.map((category) => (
                          <MenuItem key={category!.id!} value={category!.id!}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              {/* <Image width={24} height={24} src={category.icon} alt={category.title} /> */}
                              <Typography variant="body2" color={theme.palette.text.primary}>
                                {category!.title}
                              </Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                      {errors?.category?.type === 'required'
                        ? formatMessage({ ...CampaginPostMessages.isRequired }, { value: 'Category' })
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
                rules={{ required: true }}
              />
            )}
          </Stack>
        </Stack>
      </form>

      <Advanced
        isLoading={gettingPostLoading}
        initializeValue={initializeEditorValue}
        disableDrafting={setDisableRealTimeChanging}
        disableRealTimeChanging={disableRealTimeChanging}
        bodyChanged={(body) => {
          valuingEditorValue({ ...editorValue, body });
          draftPost();
        }}
        returnEditorObjects={handlePublish}
        getValueFlag={getEditorValue}
        fileUploading={setFileUploading}
      />

      {actionLoading && (
        <Stack
          spacing={3}
          sx={{
            flex: 1,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 64,
            bottom: 0,
            zIndex: 1000,
            bgcolor: 'common.white',
            marginTop: '0!important',
          }}
          justifyContent="center"
          alignItems="center"
        >
          <img src="/images/post/campaign-post-posting.svg" width={422} height={378} alt="posting" />
          <Typography variant="body1" sx={{ color: 'text.primary' }}>
            <FormattedMessage {...CampaginPostMessages.posting} />
          </Typography>
        </Stack>
      )}
      <CampaignPostExpireDateDialog
        value={getValues('deadLine') ? new Date(getValues('deadLine')!) : null}
        open={deadlineDialogOpen}
        onClose={(e) => {
          setDeadlineDialogOpen(false);
          if (e instanceof Date) {
            setValue('deadLine', dayjs(e).format('YYYY-MM-DD'));
            trigger('deadLine');
            draftPost();
          }
        }}
      />

      <CampaignPostListDialog
        variant="draft"
        posts={drafts || []}
        open={openDraftDialog}
        onClose={() => setOpenDraftDialog(false)}
        removedPost={removedDraftFromUi}
        loading={draftsLoading}
      />
      <CampaignPostListDialog
        variant="campaign"
        posts={posts || []}
        open={openPostDialog}
        onClose={() => setOpenPostDialog(false)}
        removedPost={removedPostFromUi}
        loading={postsLoading}
      />
      <Dialog maxWidth="sm" fullWidth onClose={() => setOpenPublishDialog(false)} open={openPublishDialog}>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage
                  {...CampaginPostMessages.publishQuestion}
                  values={{ type: processType === 'edit' ? 'changes' : 'post' }}
                />
              </Typography>
            </Box>

            <IconButton onClick={() => setOpenPublishDialog(false)}>
              <Icon name="Close" />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={1} sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
              <img src="/icons/send/Outline.svg" width={24} height={24} alt="send" />
              <Button
                onClick={() => {
                  setGetEditorValue(getEditorValue + 1);
                  setOpenPublishDialog(false);
                }}
              >
                <Typography variant="body2" color={theme.palette.text.primary}>
                  <FormattedMessage {...CampaginPostMessages.publish} />
                </Typography>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
              <img src="/icons/Close/red-outline.svg" width={24} height={24} alt="Cancel" />
              <Button onClick={() => setOpenPublishDialog(false)}>
                <Typography variant="body2" color={theme.palette.error.main}>
                  <FormattedMessage {...CampaginPostMessages.cancel} />
                </Typography>
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default CreateCampaignPost;
