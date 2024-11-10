import { Accessor, For, onCleanup, onMount, Show, splitProps } from 'solid-js';
import type {
  ModalComponent,
  ModalRootElement,
  ModalAttrsAndProps,
  ModalFooterButton,
} from './modal.types';

import styles from './modal.module.css';
import { Portal } from 'solid-js/web';

import XMark from './x-mark.svg';

export const Modal: ModalComponent = (attrsAndProps) => {
  const { 0: props, 1: attrs } = splitProps(attrsAndProps, [
    'shouldCloseOnBackgroundClick',
    'hideCloseButton',
    'onOpen',
    'onClose',
    'buttons',
    'title'
  ]);

  const isArray = Array.isArray;

  const shouldCloseOnBackgroundClick = () => props?.shouldCloseOnBackgroundClick == null ? true : props.shouldCloseOnBackgroundClick;
  const btnCloseHidden = () => props?.hideCloseButton == null ? false : props.hideCloseButton;

  let ref: ModalRootElement = attrs?.ref as ModalRootElement;
  let overlayRef!: HTMLDivElement; 

  const openEvent = new CustomEvent('open');
  const closeEvent = new CustomEvent('close');

  const onOpen: EventListenerOrEventListenerObject = function (
    this: Element,
    event
  ) {
    if (props?.onOpen != null) {
      if (typeof props.onOpen === 'function') {
        props.onOpen(
          event as Event & {
            currentTarget: ModalRootElement;
            target: Element;
          }
        );
      }

      if (isArray(props.onOpen)) {
        // handler(data, event);
        props.onOpen[0](props.onOpen[1], event);
      }
    }
  };

  const onClose: EventListenerOrEventListenerObject = function (
    this: Element,
    event
  ) {
    if (props?.onClose != null) {
      if (typeof props.onClose === 'function') {
        props.onClose(
          event as Event & {
            currentTarget: ModalRootElement;
            target: Element;
          }
        );
      }

      if (isArray(props.onClose)) {
        // handler(data, event);
        props.onClose[0](props.onClose[1], event);
      }
    }
  };

  const onClick: ModalAttrsAndProps['onClick'] = (event) => {
    if (attrs?.onClick != null) {
      if (typeof attrs.onClick === 'function') {
        attrs.onClick(event);
      }

      if (isArray(attrs.onClick)) {
        // handler(data, event);
        attrs.onClick[0](attrs.onClick[1], event);
      }
    }
  };

  const onBackdropClick = (event: MouseEvent): void => {
    if (shouldCloseOnBackgroundClick()) {
        ref.close();
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
  }

  const openModal = (): void => {
    ref.classList.remove(styles.hide);

    ref.dispatchEvent(openEvent);

    setTimeout((): void => {
        ref.classList.add(styles.active);
        overlayRef.classList.add(styles.active);
    }, 100);
  }

  const closeModal = (): void => {
    ref.classList.remove(styles.active);

    ref.dispatchEvent(closeEvent);

    setTimeout((): void => {
        overlayRef.classList.remove(styles.active);
        ref.classList.add(styles.hide);
    }, 200);
  }

  onMount(() => {
    ref.show = openModal;
    ref.close = closeModal;

    ref.addEventListener('open', onOpen);
    ref.addEventListener('close', onClose);
  });

  onCleanup(() => {
    ref.removeEventListener('open', onOpen);
    ref.removeEventListener('close', onClose);
  });

  return (
    <Portal mount={document.getElementById('modal-container')!}>
      <div
        {...attrs}
        ref={(el: HTMLDivElement) => (ref = el as ModalRootElement)}
        class={`${attrs?.class || ''} shadow-2xl ${styles.modal} ${styles.hide}`}
        role={attrs?.role || 'dialog'}
        aria-modal={attrs?.['aria-modal'] || true}
        onClick={(event) => onClick(event)}
        style={`justify-content: ${props.buttons && props.buttons.length > 0 ? 'space-between!important' : 'flex-start!important'};`}
      >
          <Show when={props.title && props.title.length > 0}>
              <div class={styles.modalHeader}>
                  <h2>{props.title}</h2>
                  <Show when={!btnCloseHidden()}>
                      <div class={styles.closeButton} onClick={closeModal}>
                          <XMark />
                      </div>
                  </Show>
              </div>
          </Show>
          <Show when={(!props.title || props.title.length === 0) && !btnCloseHidden()}>
              <div class={styles.noHeaderCloseButton} onClick={closeModal}>
                  <XMark />
              </div>
          </Show>
          <div class={styles.modalBody}>{attrs.children}</div>
          <Show when={props.buttons && props.buttons.length > 0}>
              <div class={styles.modalFooter}>
                  <For each={props.buttons}>
                      {(button: ModalFooterButton, index: Accessor<number>) => {
                          return <>
                              <button type={'button'} class={`${styles.button} ${button.type ? button.type : 'primary'}`} onClick={button.onClick}>{button.label}</button>
                          </>;
                      }}
                  </For>
              </div>
          </Show>
      </div>
      <div ref={overlayRef} class={styles.overlay} onClick={onBackdropClick}></div>
    </Portal>
  );
};