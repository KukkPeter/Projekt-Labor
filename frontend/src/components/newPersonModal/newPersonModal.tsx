import {Component, createSignal, For, Show, JSX, onCleanup} from 'solid-js';
import {Address, Person} from "../canvas/types";

import styles from './newPersonModal.module.css';

export interface PersonFormProps {
  treeId: number;
  onSubmit: (person: Person) => void;
}

const NewPersonModal: Component<PersonFormProps> = (props): JSX.Element => {
  const initialPersonState = (): Person => ({
    id: '',
    firstName: '',
    lastName: '',
    nickName: '',
    title: '',
    gender: null,
    birthDate: '',
    deathDate: null,
    description: '',
    treeId: props.treeId,
    createdAt: '',
    updatedAt: '',
    addresses: []
  } as Person);

  const [person, setPerson] = createSignal<Person>(initialPersonState());
  const [addressCount, setAddressCount] = createSignal(0);

  const resetForm = (): void => {
    setPerson(initialPersonState());
    setAddressCount(0);
  };

  onCleanup((): void => {
    resetForm();
  });

  const handleInputChange = (field: keyof Person, value: any): void => {
    setPerson(prev => ({ ...prev, [field]: value }));
  };

  const addAddress = (): void => {
    setAddressCount(prev => prev + 1);
  };

  const removeAddress = (index: number): void => {
    // Remove the DOM elements manually
    const addressGroup = document.getElementById(`address-group-${index}`);
    if (addressGroup) {
      addressGroup.remove();
    }
    setAddressCount(prev => prev - 1);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // Collect all addresses from the form
    const addresses: Address[] = [];
    const addressGroups = form.querySelectorAll('[id^="address-group-"]');
    
    addressGroups.forEach((group) => {
      const addressType = (group.querySelector('[name="addressType"]') as HTMLSelectElement)?.value;
      const country = (group.querySelector('[name="country"]') as HTMLInputElement)?.value;
      const postalCode = (group.querySelector('[name="postalCode"]') as HTMLInputElement)?.value;
      const city = (group.querySelector('[name="city"]') as HTMLInputElement)?.value;
      const street = (group.querySelector('[name="street"]') as HTMLInputElement)?.value;
      const door = (group.querySelector('[name="door"]') as HTMLInputElement)?.value;

      addresses.push({
        id: 0,
        personId: 0,
        addressType: addressType as 'residence' | 'birth' | 'death',
        country,
        postalCode,
        city,
        street,
        door,
        createdAt: '',
        updatedAt: ''
      });
    });

    const newPerson = {
      ...person(),
      id: `NEW-${Date.now()}`,
      addresses
    };

    props.onSubmit(newPerson);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} class={styles.form}>
      <div class={styles['form-group']}>
        <label class={styles.label}>First Name:*</label>
        <input
          type="text"
          value={person().firstName}
          onInput={(e) => handleInputChange('firstName', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Last Name:*</label>
        <input
          type="text"
          value={person().lastName}
          onInput={(e) => handleInputChange('lastName', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Nickname:</label>
        <input
          type="text"
          value={person().nickName}
          onInput={(e) => handleInputChange('nickName', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Title:</label>
        <input
          type="text"
          value={person().title}
          onInput={(e) => handleInputChange('title', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Gender:*</label>
        <select
          value={person().gender || ''}
          onChange={(e) => handleInputChange('gender', e.currentTarget.value as 'male' | 'female' | null)}
          class={styles.select}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Birth Date:*</label>
        <input
          type="date"
          value={person().birthDate}
          onInput={(e) => handleInputChange('birthDate', e.currentTarget.value)}
          class={styles.input}
          required
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Death Date:</label>
        <input
          type="date"
          value={person().deathDate || ''}
          onInput={(e) => handleInputChange('deathDate', e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles['form-group']}>
        <label class={styles.label}>Description:</label>
        <textarea
          value={person().description}
          onInput={(e) => handleInputChange('description', e.currentTarget.value)}
          class={styles.textarea}
        />
      </div>

      <fieldset class={styles.fieldset}>
        <legend class={styles.legend}>Addresses</legend>
        <For each={Array(addressCount()).fill(0)}>
          {(_, index) => (
            <div id={`address-group-${index()}`} class={styles['address-group']}>
              <div class={styles['form-group']}>
                <label class={styles.label}>Address Type:</label>
                <select
                  name="addressType"
                  class={styles.select}
                >
                  <option value="residence">Residence</option>
                  <option value="birth">Birth</option>
                  <option value="death">Death</option>
                </select>
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Country:</label>
                <input
                  type="text"
                  name="country"
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Postal Code:</label>
                <input
                  type="text"
                  name="postalCode"
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>City:</label>
                <input
                  type="text"
                  name="city"
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Street:</label>
                <input
                  type="text"
                  name="street"
                  class={styles.input}
                />
              </div>

              <div class={styles['form-group']}>
                <label class={styles.label}>Door:</label>
                <input
                  type="text"
                  name="door"
                  class={styles.input}
                />
              </div>

              <button
                type="button"
                onClick={() => removeAddress(index())}
                class={styles['remove-button']}
              >
                Remove Address
              </button>
            </div>
          )}
        </For>
        <button type="button" onClick={addAddress} class={styles['add-button']}>
          Add Address
        </button>
      </fieldset>

      <button type="submit" class={styles['submit-button']}>
        Add new person
      </button>
    </form>
  );
};

export default NewPersonModal;