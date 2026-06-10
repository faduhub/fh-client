export type Paginated<T> = {
  total: number
  currentPage: number
  nextPage: number | null
  prevPage: number | null
  numberOfPages: number
  /** `null` cuando se pidió sin paginar (sin `limit`). */
  limit: number | null
  data: T[]
}
