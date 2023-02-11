import { FC, useEffect, useRef, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface IPostDes {
  title?: string;
  description: string;
  seeMore?: boolean;
}

const PostDesContent = styled(Typography)(({ theme }) => ({
  marginTop: 20,
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  '& .anchor': {
    color: theme.palette.grey[800],
    textDecoration: 'none',
  },
}));

const SeeMore = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  lineHeight: '1.5',
  color: theme.palette.surface.main,
}));

const PostDesMoreMedia: FC<IPostDes> = ({ title, description }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);
  const [showSeeMore, setShowSeeMore] = useState<boolean>(false);
  const [showSeeLess, setShowSeeLess] = useState<boolean>(false);
  const [slicedDescription, setSlicedDescription] = useState<string>('');

  useEffect(() => {
    const height = 140;
    if (description && pRef?.current?.offsetHeight) {
      if (description.length >= height && pRef?.current?.offsetHeight >= 85) {
        setShowSeeMore(true);
        setSlicedDescription(description ? description.slice(0, height) : '');
      }
    }
  }, [description]);

  return (
    <BoxWrapper ref={boxRef}>
      <Box sx={{ paddingRight: showSeeMore ? 2 : null, paddingLeft: showSeeMore ? 2 : null, position: 'relative' }}>
        <Stack sx={{ position: 'relative', height: '120px' }}>
          <Box sx={{ position: 'relative', height: 'auto' }}>
            <PostDesContent
              sx={{
                overflow: showSeeMore ? 'hidden' : ' scroll',
                height: showSeeMore ? '70px' : 'auto',
                maxHeight: '330px',
                minHeight: showSeeLess ? pRef?.current?.offsetHeight : '70px',
                backgroundColor: showSeeMore ? 'unset' : 'surface.onSurface',
                position: showSeeMore ? null : 'absolute',
                zIndex: 22,
                paddingRight: showSeeMore ? null : 2,
                paddingLeft: showSeeMore ? null : 2,
              }}
              variant="body1"
              dangerouslySetInnerHTML={{ __html: showSeeMore ? slicedDescription : description }}
              color="surface.main"
            />
            {showSeeMore && (
              <SeeMore
                onClick={() => {
                  setShowSeeMore(false);
                  setShowSeeLess(true);
                }}
              >
                <Typography variant="button">...see more</Typography>
              </SeeMore>
            )}
            {showSeeLess && (
              <SeeMore
                onClick={() => {
                  setShowSeeMore(true);
                  setShowSeeLess(false);
                }}
                style={{
                  position: 'absolute',
                  top: pRef?.current?.offsetHeight ? pRef?.current?.offsetHeight : 0 + 20,
                  zIndex: 100,
                  backgroundColor: 'surface.onSurface',
                  width: '100%',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="button" sx={{ padding: 2 }}>
                  See Less
                </Typography>{' '}
              </SeeMore>
            )}
          </Box>
          {/* <Typography
            variant="body1"
            color={SURFACE.main}
            sx={{
              height: showSeeMore ? '70px' : 'auto',
              minHeight: '70px',
              backgroundColor: showSeeMore ? null : 'rgba(53, 71, 82, 0.64)',
              position: showSeeMore ? null : 'absolute',
              zIndex: 22,
              paddingRight: showSeeMore ? null : 2,
              paddingLeft: showSeeMore ? null : 2,
            }}
          >
            {showSeeMore ? slicedDescription : description}{' '}
            {showSeeMore ? (
              <SeeMore onClick={() => setShowSeeMore(false)} style={{color:SURFACE.onSurfaceVariantL}}>...see more</SeeMore>
            ) : (
              <SeeLess onClick={() => setShowSeeMore(true)}><Typography variant='button'>See Less</Typography> </SeeLess>
            )}
          </Typography> */}
        </Stack>

        <PostDesContent
          sx={{ visibility: 'hidden', position: 'absolute', zIndex: 0, top: 0 }}
          ref={pRef}
          variant="body1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {/* </ShowMoreText> */}
        {/* )} */}
      </Box>
    </BoxWrapper>
  );
};

export default PostDesMoreMedia;
