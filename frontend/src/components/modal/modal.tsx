import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import styles from './modal.module.css';

const AddPersonModal = () => {
  const [isLiving, setIsLiving] = createSignal(true);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <Portal>
      <div class={styles.modalOverlay}>
        <div class={styles.modalContent}>
          <h2 class={styles.title}>Add new person</h2>
          <form onSubmit={handleSubmit} class={styles.form}>
            <div class={styles.formColumn}>
              <h3 class={styles.sectionTitle}>Name</h3>
              <input type="text" name="title" placeholder="Title" class={styles.input} />
              <input type="text" name="firstName" placeholder="First name" class={styles.input} />
              <input type="text" name="lastName" placeholder="Last name" class={styles.input} />
              <input type="text" name="nickname" placeholder="Nickname" class={styles.input} />
              
              <h3 class={styles.sectionTitle}>Gender</h3>
              <select name="gender" class={styles.select}>
                <option value="Unknown">Unknown</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              
              <h3 class={styles.sectionTitle}>Birth data</h3>
              <input type="text" name="birthPlace" placeholder="Birth place" class={styles.input} />
              <div class={styles.dateInputs}>
                <input type="text" name="birthYear" placeholder="Year" class={styles.input} />
                <select name="birthMonth" class={styles.select}>
                  <option value="">Month</option>
                  {/* Add month options */}
                </select>
                <select name="birthDay" class={styles.select}>
                  <option value="">Day</option>
                  {/* Add day options */}
                </select>
              </div>
              
              <label class={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isLiving()}
                  onChange={(e) => setIsLiving(e.target.checked)}
                />
                This person is living
              </label>
              
              <Show when={!isLiving()}>
                <div class={styles.deathData}>
                  <h3 class={styles.sectionTitle}>Death data</h3>
                  <input type="text" name="deathPlace" placeholder="Death place" class={styles.input} />
                  <div class={styles.dateInputs}>
                    <input type="text" name="deathYear" placeholder="Year" class={styles.input} />
                    <select name="deathMonth" class={styles.select}>
                      <option value="">Month</option>
                      {/* Add month options */}
                    </select>
                    <select name="deathDay" class={styles.select}>
                      <option value="">Day</option>
                      {/* Add day options */}
                    </select>
                  </div>
                </div>
              </Show>
            </div>
            
            <div class={styles.formColumn}>
              <h3 class={styles.sectionTitle}>Biography</h3>
              <input type="text" name="profession" placeholder="Profession" class={styles.input} />
              <input type="text" name="company" placeholder="Company" class={styles.input} />
              <textarea name="description" placeholder="Description" rows="3" class={styles.textarea}></textarea>
              
              <h3 class={styles.sectionTitle}>Picture</h3>
              <button type="button" class={styles.uploadButton}>Upload</button>
              
              <h3 class={styles.sectionTitle}>Other documents</h3>
              <button type="button" class={styles.uploadButton}>Upload</button>
              
              <h3 class={styles.sectionTitle}>Set relative</h3>
              <select name="relative" class={styles.select}>
                <option value="">select</option>
                {/* Add relative options */}
              </select>
              
              <label class={styles.checkbox}>
                <input type="checkbox" name="isPrivate" />
                Private
              </label>
            </div>
            
            <div class={styles.formActions}>
              <button type="button" class={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" class={styles.addButton}>Add</button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default AddPersonModal;