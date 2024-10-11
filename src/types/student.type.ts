export interface Student {
  id: number
  first_name: string
  gender: string
  country: string
  btc_address: string
  avatar: string
  last_name: string
  email: string
}

export type Students = Pick<Student, 'id' | 'email' | 'avatar' | 'last_name'>[]
