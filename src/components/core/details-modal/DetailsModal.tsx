import React, { FC, useState } from 'react';
import UiModal from '../../ui/modal/UiModal';
import styles from './details-modal.module.scss';
import Details from '../details/Details';

interface Props {
  showId?: number;
  showType?: string;
}

const DetailsModal: FC<Props> = ({ showType, showId }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <button className={styles['details-modal__show-btn']} onClick={() => setModalVisible(true)}>
        Подробнее
      </button>

      <UiModal
        title={`О ${showType === 'movie' ? 'фильме' : 'сериале'}`}
        fullWidth
        visible={modalVisible}
        handleVisible={setModalVisible}
      >
        {modalVisible && <Details showType={showType} showId={showId} />}
      </UiModal>
    </div>
  );
};

export default DetailsModal;
