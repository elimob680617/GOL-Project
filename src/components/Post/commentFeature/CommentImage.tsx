import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { IconButton } from '@mui/material';

import Resumable from 'resumablejs';
import { Icon } from 'src/components/Icon';
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
      'image/*': ['.jpeg', '.png', '.jpg', '.bmp', '.gif'],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!uploadFileFlag) return;
    upload(selectedFile!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumable]);

  return (
    <IconButton {...getRootProps()}>
      {/* <Image src={imageIcon} alt="image" width={29} height={29} /> */}
      <Icon name="image" />
      <input {...getInputProps()} />
    </IconButton>
  );
};

export default CommentImage;
