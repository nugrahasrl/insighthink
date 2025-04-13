declare module "react-quill" {
  import * as React from "react";

  export interface ReactQuillProps {
    value: string;
    onChange: (content: string, delta: any, source: string, editor: any) => void;
    placeholder?: string;
    className?: string;
    theme?: string;
    // Tambahkan modules
    modules?: any; // atau bisa didefinisikan lebih spesifik jika diinginkan
    // Tambahkan properti lain jika diperlukan (mis. formats, bounds, dsb.)
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
