import { StaticImageData } from "next/image";

export type User = {
  id?: number;
  fullName: string;
  profileImage: string;
  email: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
  version?: number;
};
