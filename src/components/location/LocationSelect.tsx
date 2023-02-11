import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Stack, Typography, styled } from '@mui/material';

import { useCreatePlaceMutation } from 'src/_graphql/post/mutations/createPlace.generated';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { setLocation } from 'src/store/slices/post/createSocialPost';
import { basicSharePostSelector, setSharedPostLocation } from 'src/store/slices/post/sharePost';

type Location = 'company' | 'home' | 'shop';
type locationType = 'social' | 'share';
export interface ILocationSelect {
  variant: Location;
  name: string;
  address: string;
  id: string;
  secondaryText: string;
  locationType?: locationType;
  // postId?: string;
}

interface IComponentProps extends ILocationSelect {
  createPostLoadingChange: (loading: boolean) => void;
}

const RowWrapper = styled(Stack)(() => ({}));

const LocationSelect: FC<IComponentProps> = (props) => {
  const { variant, name, address, id, secondaryText, createPostLoadingChange, locationType = 'social' } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postShared = useSelector(basicSharePostSelector);
  const [createPlaceReq] = useCreatePlaceMutation();
  const location = useLocation();
  const isPostDetails = location.pathname.includes('post-details');

  const createPostFunction = () => {
    createPostLoadingChange(true);
    createPlaceReq({ place: { dto: { id: id, description: address, mainText: name, secondaryText } } })
      .unwrap()
      .then((res) => {
        createPostLoadingChange(false);
        if (locationType === 'social') {
          dispatch(setLocation({ address, id, name, variant, secondaryText }));
          navigate(PATH_APP.post.createPost.socialPost.index, { replace: true });
        } else if (locationType === 'share') {
          dispatch(setSharedPostLocation({ address, id, name, variant, secondaryText, locationType }));
          navigate(`${PATH_APP.post.sharePost.index}`, { replace: true });
          if (isPostDetails) {
            navigate(`${PATH_APP.post.postDetails.index}/${postShared?.id}/share/${postShared?.postType}`, {
              replace: true,
            });
          } else {
            navigate(PATH_APP.post.sharePost.index, { replace: true });
          }
        }
      })
      .catch((err) => {
        createPostLoadingChange(false);
        toast.error(err.message);
      });
  };

  return (
    <RowWrapper
      onClick={() => {
        createPostFunction();
      }}
      spacing={2}
      direction="row"
      sx={{ cursor: 'pointer' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: '20px', color: 'text.primary' }}>
          {name}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 400, lineHeight: '17.5px', color: 'text.secondary' }}>
          {address}
        </Typography>
      </Stack>
    </RowWrapper>
  );
};

export default LocationSelect;
