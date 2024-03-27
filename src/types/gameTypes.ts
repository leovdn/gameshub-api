import { Filter } from "./filterTypes"

export interface GamesList {
  filters: Filter
  pages: number
  productCount: number
  products: Product[]
}

export interface Product {
  id: string
  slug: string
  features: Feature[]
  screenshots: string[]
  userPreferredLanguage: UserPreferredLanguage
  releaseDate: string
  storeReleaseDate: string
  productType: string
  title: string
  coverHorizontal: string
  coverVertical: string
  developers: string[]
  publishers: string[]
  operatingSystems: string[]
  price: Price
  productState: string
  genres: Genre[]
  tags: Tag[]
  reviewsRating: number
  editions: any[]
  ratings: Rating[]
  storeLink: string
}

export interface Feature {
  name: string
  slug: string
}

export interface UserPreferredLanguage {
  code: string
  inAudio: boolean
  inText: boolean
}

export interface Price {
  final: string
  base: string
  discount: string
  finalMoney: FinalMoney
  baseMoney: BaseMoney
}

export interface FinalMoney {
  amount: string
  currency: string
  discount: string
}

export interface BaseMoney {
  amount: string
  currency: string
}

export interface Genre {
  name: string
  slug: string
}

export interface Tag {
  name: string
  slug: string
}

export interface Rating {
  name: string
  ageRating: string
}
