// This file ensures TypeScript recognizes framer-motion types
declare module "framer-motion" {
    export const motion: any
    export interface Variants {
      [key: string]: any
    }
  }
  
  