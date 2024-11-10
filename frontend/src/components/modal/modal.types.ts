import type { Component, JSX } from 'solid-js';

export type ModalRootElement = Omit<
  HTMLDivElement,
  | 'show'
  | 'close'
> & {
  show: () => void;
  close: () => void;
};

type ModalAttrs = Omit<
  JSX.HTMLElementTags['div'],
  | 'ref'
> & {
  ref?: ModalRootElement | ((el: ModalRootElement) => void) | undefined;
  /* ------------------------- overwritten attrs ------------------------- */
};

export type ModalFooterButton = {
  type?: string;
  label: string;
  onClick?: () => void;
}

export type ModalProps = {
  /**
   * @description
   * Allow to close modal on background click.
   * @default true
   */
  shouldCloseOnBackgroundClick?: boolean;
  /**
   * @description
   * Show/Hide close button on modal.
   * @default false
   */
  hideCloseButton?: boolean;
  /**
   * @description
   * Callback fired the modal is opened.
   */
  onOpen?: JSX.EventHandlerUnion<ModalRootElement, Event>;
  /**
   * @description
   * Callback fired the modal is closed.
   */
  onClose?: JSX.EventHandlerUnion<ModalRootElement, Event>;
  /**
   * @description
   * List of footer buttons.
   */
  buttons?: ModalFooterButton[] | undefined;
  /**
   * @description
   * Title of the modal.
   */
  title?: string;
};

type ModalCustomAttrs = JSX.CustomAttributes<ModalRootElement>;

export type ModalAttrsAndProps = ModalAttrs & ModalProps & ModalCustomAttrs;

export type ModalComponent = Component<ModalAttrsAndProps>;