declare module "react-helmet" {
  import * as React from "react";

  export interface HelmetProps {
    htmlAttributes?: any;
    title?: string;
    titleTemplate?: string;
    defaultTitle?: string;
    titleAttributes?: any;
    base?: any;
    meta?: any[];
    link?: any[];
    script?: any[];
    noscript?: any[];
    style?: any[];
    onChangeClientState?: (
      newState: any,
      addedTags: any,
      removedTags: any
    ) => void;
  }

  export class Helmet extends React.Component<HelmetProps> {}
}
