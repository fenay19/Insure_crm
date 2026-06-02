import { useState } from 'react';

const useHandleModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const openModalClick = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return [openModal, openModalClick, closeModal];
};

export default useHandleModal;
