import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { IconButton } from '@mui/material';

import Resumable from 'resumablejs';
// import imageIcon from 'src/assets/icons/comment/24/input/Image.svg';
import { fileLimitations } from 'src/config';
import { convertToBase64 } from 'src/utils/fileFunctions';
import { v4 as uuidv4 } from 'uuid';

interface ICommentImageProps {
  imagePreviewSelected: (preview: string) => void;
  removeFileFlag: number;
  uploadFileFlag: number;
  uploadedFile: (url: string) => void;
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

const CommentImage: FC<ICommentImageProps> = (props) => {
  const { imagePreviewSelected, removeFileFlag, uploadFileFlag, uploadedFile } = props;
  const [resumable] = useState<Resumable>(new Resumable(config));
  const uploadServiceUrl = process.env.NEXT_UPLOAD_URL;
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.gif'],
    },
    maxFiles: 1,
    maxSize: fileLimitations.image,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      coverImageChoosed(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const coverImageChoosed = async (file: File) => {
    const preview = await convertToBase64(file);
    imagePreviewSelected(preview);
  };

  useEffect(() => {
    if (!removeFileFlag) return;
    setSelectedFile(null);
  }, [removeFileFlag]);

  useEffect(() => {
    if (!uploadFileFlag || !selectedFile) return;
    upload(selectedFile);
  }, [uploadFileFlag]);

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

  useEffect(() => {
    if (resumable) {
      resumable.on('fileSuccess', (file: Resumable.ResumableFile, message: string) => {
        uploadedFile(message.replace(/["']/g, ''));
      });

      //   resumable.on('fileError', (file, message) => {
      //     const uploadingFile = uploadingFilesref.current[0];
      //     if (uploadingFile.id === coverImageId) {
      //       toast.error('Cover image upload has error');
      //       removeCoverImage();
      //     }
      //     removeImage(uploadingFile.id);
      //     const newUploadingFiles = uploadingFilesref.current.splice(0, 0);
      //     uploadingFilesref.current = [...newUploadingFiles];
      //     getNextFile();
      //   });
    }
  }, [resumable]);

  return (
    <IconButton {...getRootProps()}>
      {/* <img src={imageIcon} alt="imageIcon" width={29} height={29} loading="lazy" /> */}
      <input {...getInputProps()} />
    </IconButton>
  );
};

export default CommentImage;
