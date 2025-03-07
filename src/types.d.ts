export interface IRoomPhotoPhoto {
  pk: string;
  file: string;
  description: string;
}
export interface IRoomList {
  pk: number;
  name: string;
  country: string;
  city: string;
  price: number;
  rating: number;
  is_owner: boolean;
  photos: IRoomPhotoPhoto[];
}
export interface IRoomOwner {
  name: string;
  avatar: string;
  username: string;
}
export interface IAmenity {
  pk: number;
  name: string;
  description: string;
}
export interface ICategory {
  pk: number;
  name: string;
  kind: string;
}
export interface IRoomDetail extends IRoomList {
  id: number;
  created_at: string;
  updated_at: string;
  rooms: number;
  toilets: number;
  description: string;
  address: string;
  pet_friendly: true;
  // pet_friendly: boolean;
  kind: string;
  is_owner: boolean;
  is_liked: boolean;
  category: ICategory;
  owner: IRoomOwner;
  amenities: IAmenity[];
}

export interface IReview {
  payload: string;
  rating: number;
  user: IRoomOwner;
}
