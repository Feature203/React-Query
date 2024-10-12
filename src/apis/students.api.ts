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

export const getStudent = (id: string | number) => {
  return http.get<Student>(`/students/${id}`)
}

export const addStudent = (students: Omit<Student, 'id'>) => {
  return http.post<Student>('/students', students)
}

export const updateStudent = (id: number | string, student: Student) => {
  return http.put<Student>(`/students/${id}`, student)
}

export const deleteStudent = (id: number | string) => {
  return http.delete<{}>(`/students/${id}`)
}
