declare module '@editorjs/header';
declare module '@editorjs/list';
declare module '@editorjs/paragraph';
declare module '@editorjs/image';
declare module '@editorjs/link';
declare module '@editorjs/checklist';
declare module '@editorjs/quote';
declare module '@editorjs/code';
declare module '@editorjs/marker';
declare module '@editorjs/table';
declare module '@editorjs/embed';
declare module '@editorjs/delimiter';
declare module '@editorjs/warning';

// Add more Editor.js plugins as needed

// If you need more specific types, you can define interfaces
declare module '@editorjs/editorjs' {
  export interface OutputData {
    time: number;
    blocks: OutputBlockData[];
    version: string;
  }

  export interface OutputBlockData {
    id?: string;
    type: string;
    data: {
      [key: string]: any;
    };
  }

  export interface API {
    blocks: {
      delete: (blockIndex: number) => void;
      insert: (
        type: string,
        data: object,
        config?: object,
        index?: number,
        needToFocus?: boolean
      ) => void;
      update: (blockIndex: number, data: object) => void;
      getBlockByIndex: (index: number) => any;
      getCurrentBlockIndex: () => number;
      getBlocksCount: () => number;
      stretchBlock: (index: number, status: boolean) => void;
      insertNewBlock: () => void;
      render: (data: OutputData) => Promise<void>;
    };
    caret: {
      setToBlock: (index: number, position?: string) => void;
      setToFirstBlock: () => void;
      setToLastBlock: () => void;
      focus: (atEnd?: boolean) => void;
    };
    events: {
      on: (eventName: string, callback: Function) => void;
      off: (eventName: string, callback: Function) => void;
      emit: (eventName: string, data?: object) => void;
    };
    saver: {
      save: () => Promise<OutputData>;
    };
    toolbar: {
      open: () => void;
      close: () => void;
    };
    [key: string]: any;
  }

  export interface EditorConfig {
    holder?: string | HTMLElement;
    tools?: {
      [toolName: string]: {
        class: any;
        inlineToolbar?: boolean | string[];
        config?: object;
      };
    };
    data?: OutputData;
    placeholder?: string;
    autofocus?: boolean;
    readOnly?: boolean;
    onChange?: (api: API, event: CustomEvent) => void;
    onReady?: () => void;
    minHeight?: number;
    logLevel?: 'VERBOSE' | 'INFO' | 'WARN' | 'ERROR';
    inlineToolbar?: boolean | string[];
    i18n?: object;
  }

  export default class EditorJS {
    constructor(config?: EditorConfig);
    isReady: Promise<boolean>;
    save: () => Promise<OutputData>;
    render: (data: OutputData) => Promise<void>;
    clear: () => void;
    destroy: () => void;
    blocks: {
      render: (data: OutputData) => Promise<void>;
      delete: (blockIndex: number) => void;
      insert: (
        type: string,
        data: object,
        config?: object,
        index?: number,
        needToFocus?: boolean
      ) => void;
      update: (blockIndex: number, data: object) => void;
      getBlockByIndex: (index: number) => any;
      getCurrentBlockIndex: () => number;
      getBlocksCount: () => number;
      stretchBlock: (index: number, status: boolean) => void;
      insertNewBlock: () => void;
    };
  }
}
