import { AnonymousTypes } from './tables/anonymous'
import { ColoringTypes } from './tables/coloring'
import { MandalaTypes } from './tables/mandala'
import { GalleryTypes } from './tables/gallery'

export interface Tables extends 
  AnonymousTypes,
  ColoringTypes,
  MandalaTypes,
  GalleryTypes {}

export type { Json } from './base'