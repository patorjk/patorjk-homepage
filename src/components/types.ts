import type {JSX} from "react";

export interface ContentItem {
  title: string;
  description: string | JSX.Element;
  descriptionMobile?: string | JSX.Element;
  link: string;
  desktop?: boolean;
}
