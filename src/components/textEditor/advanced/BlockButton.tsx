import { Button } from '@mui/material';

import { useSlate } from 'slate-react';

import { TEXT_ALIGN_TYPES, isBlockActive, toggleBlock } from './advancedFunctions';

const BlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  const active = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  return (
    <Button
      sx={{
        borderColor: '#ffffff!important',
        ...(active && {
          backgroundColor: (theme) => theme.palette.secondary.light,
        }),
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

export default BlockButton;
