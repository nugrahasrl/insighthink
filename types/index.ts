interface RawBook {
    _id: any;
    title: string;
    author: string;
    description?: string;
    createdAt?: Date;
    content?: string;
  }
  
  interface FormattedBook {
    _id: string;
    title: string;
    author: string;
    description: string;
    createdAt: string;
    content: string;
  }