import * as Dialog from '@radix-ui/react-dialog';
import MyButton from '../MyButton';
import PropTypes from 'prop-types';
import { BiX } from 'react-icons/bi';
import './styles.css';
import { useContext } from 'react';
import { MapContext } from '../../contexts/MapContext';

export default function MyModal({
  trigger,
  title,
  description,
  children,
  open,
  setOpen,
}) {
  const { mapRef } = useContext(MapContext);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal
        container={
          mapRef?.current
            ? mapRef?.current?.getMap().getContainer()
            : document.body
        }
      >
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>{title}</Dialog.Title>
          <Dialog.Description className='DialogDescription'>
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <MyButton
              color='mute'
              variant='icon'
              style={{ position: 'absolute', top: 10, right: 10 }}
              aria-label='Close'
            >
              <BiX />
            </MyButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

MyModal.propTypes = {
  trigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  // portalContainer: PropTypes.element,
};
