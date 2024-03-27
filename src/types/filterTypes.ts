export interface Filter {
  releaseDateRange: ReleaseDateRange
  priceRange: PriceRange
  genres: Genre[]
  languages: Language[]
  systems: System[]
  tags: Tag[]
  discounted: boolean
  features: Feature[]
  releaseStatuses: ReleaseStatuse[]
  types: string[]
  fullGenresList: FullGenresList[]
  fullTagsList: FullTagsList[]
}

export interface ReleaseDateRange {
  min: number
  max: number
}

export interface PriceRange {
  min: number
  max: number
  currency: string
  decimalPlaces: number
}

export interface Genre {
  name: string
  slug: string
}

export interface Language {
  slug: string
  name: string
}

export interface System {
  slug: string
  name: string
}

export interface Tag {
  name: string
  slug: string
}

export interface Feature {
  slug: string
  name: string
}

export interface ReleaseStatuse {
  slug: string
  name: string
}

export interface FullGenresList {
  name: string
  slug: string
  level: number
}

export interface FullTagsList {
  name: string
  slug: string
}
