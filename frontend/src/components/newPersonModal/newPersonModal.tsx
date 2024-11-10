import {Component, createSignal, For, Show, JSX} from 'solid-js';
import {Address, Person} from "../canvas/types";

import styles from './newPersonModal.module.css';

export interface PersonFormProps {
  treeId: number;
  onSubmit: (person: Person) => void;
}

const NewPersonModal: Component<PersonFormProps> = (props): JSX.Element => {
  const [person, setPerson] = createSignal<Person>({} as Person);
  const [addresses, setAddresses] = createSignal<Address[]>([] as Address[]);

  const handleInputChange = (field: keyof Person, value: any) => {
    setPerson({ ...person(), [field]: value });
  };

  const handleAddressChange = (index: number, field: keyof Address, value: any) => {
    const updatedAddresses = addresses().map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setAddresses(updatedAddresses);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses(),
      {
        personId: person().treeId,
        addressType: 'residence',
        country: '',
        postalCode: '',
        city: '',
        street: '',
        door: ''
      } as Address
    ]);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses().filter((_, i) => i !== index));
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();

    handleInputChange('id', `NEW-${Date.now()}`);
    handleInputChange('treeId', props.treeId);

    setTimeout((): void => {
      props.onSubmit({ ...person(), addresses: addresses() });
    });
  };

  // @ts-ignore
  return (
    <form onSubmit={handleSubmit} class={styles.form}>
      <div class={styles['form-group']}>
        <label class={styles.label}>First Name:*</label>
        <input
          type='text'
          onInput={(e) => handleInputChange('firstName', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Last Name:*</label>
        <input
          type='text'
          onInput={(e) => handleInputChange('lastName', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Nickname:</label>
        <input
          type='text'
          onInput={(e) => handleInputChange('nickName', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Title:</label>
        <input
          type='text'
          onInput={(e) => handleInputChange('title', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Gender:*</label>
        <select
          onChange={(e) => handleInputChange('gender', e.currentTarget.value as 'male' | 'female' | null)}
          class={styles.select}
          required
        >
          <option value=''>Select</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Birth Date:*</label>
        <input
          type='date'
          onInput={(e) => handleInputChange('birthDate', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Death Date:</label>
        <input
          type='date'
          onInput={(e) => handleInputChange('deathDate', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Description:</label>
        <textarea
          onInput={(e) => handleInputChange('description', e.currentTarget.value)}
          class={styles.textarea}
        />
      </div>

      <fieldset class={styles.fieldset}>
        <legend class={styles.legend}>Addresses</legend>
        <For each={addresses()}>
          {(address, index) => (
            <div id={`address-${index()}`} class={styles['address-group']}>
              <div class={styles['form-group']}>
                <label class={styles.label}>Address Type:</label>
                <select
                  onChange={(e) => handleAddressChange(index(), 'addressType', e.currentTarget.value as 'residence' | 'birth' | 'death')}
                  class={styles.select}
                >
                  <option value='residence'>Residence</option>
                  <option value='birth'>Birth</option>
                  <option value='death'>Death</option>
                </select>
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Country:</label>
                <input
                  type='text'
                  onInput={(e) => handleAddressChange(index(), 'country', e.currentTarget.value)}
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Postal Code:</label>
                <input
                  type='text'
                  onInput={(e) => handleAddressChange(index(), 'postalCode', e.currentTarget.value)}
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>City:</label>
                <input
                  type='text'
                  onInput={(e) => handleAddressChange(index(), 'city', e.currentTarget.value)}
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Street:</label>
                <input
                  type='text'
                  onInput={(e) => handleAddressChange(index(), 'street', e.currentTarget.value)}
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Door:</label>
                <input
                  type='text'
                  onInput={(e) => handleAddressChange(index(), 'door', e.currentTarget.value)}
                  class={styles.input}
                />
              </div>

              <button type='button' onClick={() => removeAddress(index())} class={styles['remove-button']}>
                Remove Address
              </button>
            </div>
          )}
        </For>
        <button type='button' onClick={addAddress} class={styles['add-button']}>
          Add Address
        </button>
      </fieldset>

      <button type='submit' class={styles['submit-button']}>Add new person</button>
    </form>
  );
};

export default NewPersonModal;