import { FC, PropsWithChildren } from 'react';
import { animated, useSpring } from 'react-spring';

import { Backdrop, useTheme } from '@mui/material';

interface ISliderProps {
  open: boolean;
  onDismiss: () => void;
}

const Drawer: FC<PropsWithChildren<ISliderProps>> = (props) => {
  const { open, onDismiss } = props;
  const { left } = useSpring({ left: open ? 0 : -300 });
  const theme = useTheme();
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (backdropTheme) => backdropTheme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => onDismiss()}
      />
      <animated.div
        style={{
          position: 'fixed',
          width: 300,
          maxWidth: '90%',
          top: 0,
          left: left,
          bottom: 0,
          padding: 0,
          margin: 0,
          backgroundColor: 'white',
          zIndex: theme.zIndex.drawer + 10,
        }}
      >
        {props.children}
      </animated.div>
    </>
  );
};

export default Drawer;
