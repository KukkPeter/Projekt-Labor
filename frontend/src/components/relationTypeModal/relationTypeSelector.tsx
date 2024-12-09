import { Component, createSignal, JSX } from 'solid-js';
import { Modal } from "../modal/modal";
import { ModalRootElement } from "../modal/modal.types";
import { RelationType } from '../canvas/types';
import styles from './relationTypeSelector.module.css';

interface RelationTypeSelectorProps {
  onSelect: (type: RelationType) => void;
  onCancel: () => void;
}

export const RelationTypeSelector: Component<RelationTypeSelectorProps> = (props): JSX.Element => {
  let modalRef!: ModalRootElement;
  const [selectedType, setSelectedType] = createSignal<RelationType>('parent');

  // Show the modal as soon as the component mounts
  setTimeout(() => {
    modalRef.show();
  }, 0);

  return (
    <Modal
      ref={modalRef}
      title="Select Relationship Type"
      hideCloseButton={true}
      shouldCloseOnBackgroundClick={false}
      buttons={[
        {
          label: 'Create Connection',
          type: 'success',
          onClick: () => {
            modalRef.close();
            props.onSelect(selectedType());
          }
        },
        {
          label: 'Cancel',
          type: 'secondary',
          onClick: () => {
            modalRef.close();
            props.onCancel();
          }
        }
      ]}
    >
      <div class={styles.container}>
        <div class={styles['form-group']}>
          <label class={styles.label}>Relationship Type:</label>
          <select
            value={selectedType()}
            onChange={(e) => setSelectedType(e.currentTarget.value as RelationType)}
            class={styles.select}
          >
            <option value="parent">Parent</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default RelationTypeSelector;