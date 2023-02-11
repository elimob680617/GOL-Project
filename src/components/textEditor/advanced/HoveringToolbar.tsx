import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button, ClickAwayListener, IconButton, Stack, TextField, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';

import { IAddMediaPosition } from './Advanced';

const ButtonStyle = styled(Button)(({ theme }) => ({
  //   backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}));

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  border: `1px dashed ${theme.palette.grey[300]}`,
  //   '&:hover': { opacity: 0.72, cursor: 'pointer' },
  cursor: 'pointer',
  flex: 1,
}));

interface IHoveringToolbarProps {
  fileSelected: (file: File) => void;
  videoUrlSelected: (url: string) => void;
  snippetSelected: () => void;
  mediaPosition: IAddMediaPosition;
}

const HoveringToolbar: FC<IHoveringToolbarProps> = (props) => {
  const { fileSelected, videoUrlSelected, snippetSelected, mediaPosition } = props;
  const [show, setShow] = useState<boolean>(false);
  const [showImageUploader, setShowImageUploader] = useState<boolean>(false);
  const [showVideoLinker, setShowVideoLinker] = useState<boolean>(false);
  const [videoUrl, setVideoURl] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.bmp', '.gif'],
    },
  });

  const removeHoveringToolbar = () => {
    setShow(false);
    setShowImageUploader(false);
    setShowVideoLinker(false);
  };

  useEffect(() => {
    if (acceptedFiles[0]) {
      removeHoveringToolbar();
      fileSelected(acceptedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        removeHoveringToolbar();
      }}
    >
      <Stack
        sx={{ padding: 1, position: 'absolute', left: 0, ...(show && { right: 0 }), top: mediaPosition.top, zIndex: 2 }}
        spacing={3}
        direction="row"
        alignItems="flex-start"
      >
        <IconButton
          onClick={() => {
            setShow(!show);
            setShowImageUploader(false);
            setShowVideoLinker(false);
          }}
        >
          <img
            src={!show && !showImageUploader ? '/icons/line symbol/24/Outline.svg' : '/icons/Close/24/close.svg'}
            width={24}
            height={24}
            alt="add-media"
          />
        </IconButton>
        {show && !showImageUploader && !showVideoLinker && (
          <Stack
            spacing={6}
            sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}
            direction="row"
            alignItems="center"
          >
            <ButtonStyle
              onClick={() => {
                setShowImageUploader(true);
              }}
            >
              <Stack spacing={1} direction="row" alignItems="center">
                <Icon name="upload-image" size={24} />
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Image
                </Typography>
              </Stack>
            </ButtonStyle>
            <ButtonStyle
              onClick={() => {
                setShowVideoLinker(true);
              }}
            >
              <Stack spacing={1} direction="row" alignItems="center">
                <Icon name="Video" size={48} />

                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Video
                </Typography>
              </Stack>
            </ButtonStyle>
            <ButtonStyle
              onClick={() => {
                snippetSelected();
                removeHoveringToolbar();
              }}
            >
              <Stack spacing={1} direction="row" alignItems="center">
                <Icon name="Snippet" size={24} />

                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Snippet
                </Typography>
              </Stack>
            </ButtonStyle>

            <ButtonStyle>
              <Stack spacing={1} direction="row" alignItems="center">
                <Icon name="Link" size={24} />

                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Link
                </Typography>
              </Stack>
            </ButtonStyle>
          </Stack>
        )}

        {showImageUploader && (
          <DropZoneStyle
            {...getRootProps()}
            sx={{
              ...(isDragActive && { opacity: 0.72 }),
            }}
          >
            <input {...getInputProps()} />

            <Stack spacing={3} alignItems="center">
              <Icon name="upload-image" size={48} />
              <Stack direction="row">
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Drag an image here or
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'primary.main',
                    margin: '0 5px',
                  }}
                >
                  upload from computer
                </Typography>
              </Stack>
            </Stack>
          </DropZoneStyle>
        )}

        {showVideoLinker && (
          <DropZoneStyle>
            <Stack spacing={3} alignItems="center">
              <Icon name="upload-image" size={48} />
              <Stack alignItems="center" direction="row" spacing={1}>
                <TextField
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      if (videoUrl) {
                        removeHoveringToolbar();
                        videoUrlSelected(videoUrl);
                        setVideoURl('');
                      }
                    }
                  }}
                  value={videoUrl}
                  onChange={(event) => setVideoURl(event.target.value)}
                  id="video-link"
                  variant="outlined"
                  placeholder="Video link"
                  sx={{ '& input': { textAlign: 'center' } }}
                  size="small"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    removeHoveringToolbar();
                    videoUrlSelected(videoUrl);
                    setVideoURl('');
                  }}
                >
                  Add
                </Button>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Youtube and more
              </Typography>
            </Stack>
          </DropZoneStyle>
        )}
      </Stack>
    </ClickAwayListener>
  );
};

export default HoveringToolbar;
