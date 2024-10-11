import { AxiosResponse } from 'axios'
import { Student, Students } from 'types/student.type'
import http from 'utils/Http'

export const getStudents = (page: string | number, limit: string | number) => {
  const data: Promise<AxiosResponse<Students, any>> = http.get<Students>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
  return data
}

export const addStudent = (students: Omit<Student, 'id'>) => {
  return http.post<Student>('/students', students)
}
