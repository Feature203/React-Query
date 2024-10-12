import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import Skeletent from 'components/Skeletent'
import { Link } from 'react-router-dom'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'

const LIMIT: number = 10

export default function Students() {
  // const [students, setStudents] = useState<TStudent>([])
  // const [isLoading, setIsLoading] = useState<boolean>(true)

  //const [_page] = useSearchParams();
  // useEffect(() => {
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [_page])

  const queryString: { page?: string } = useQueryString()

  const queryClient = useQueryClient()

  const page: number = Number(queryString.page) || 1

  const studentsQuery = useQuery({
    queryKey: ['students', page], //Giá trị page cần được theo dõi để update giống dependencies
    queryFn: () => getStudents(page, LIMIT),
    // staleTime: 60 * 1000,
    // gcTime: 5 * 1000 // cacheTime
    placeholderData: keepPreviousData //keepPreviousData: true // giữ data trước làm cho chuyển sang trang load lại data mượt mà hơn
  })

  console.log(studentsQuery)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => {
      return deleteStudent(id)
    },
    onSuccess: (_, id) => {
      toast.success(`Xoá Thành Công Student ${id}`)

      //TODO:  {
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
      //exact: true làm cho chính xác hơn khi queryKey
      //làm cho queryKey: ['students', page] refresh lại được hiểu
      //TODO : studentsQuery cũ nên update lại làm cho  queryFn: () => getStudents(page, LIMIT) gọi lại
      //End }
    }
  })

  const totalStudentCount = Number(studentsQuery.data?.headers['x-total-count']) || 0

  const totalPage = Math.ceil(totalStudentCount / LIMIT)

  const handleDelete = (id: number | string) => {
    deleteStudentMutation.mutate(id)
  }

  // Prefetching

  const handlePrefetchStudent = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['student', id],
      queryFn: () => getStudent(id),
      staleTime: 10 * 1000
    })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>

      <Link
        type='button'
        className='me-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        to={'/students/add'}
      >
        Add Student
      </Link>

      {studentsQuery.isLoading && <Skeletent />}

      <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='py-3 px-6'>
                #
              </th>
              <th scope='col' className='py-3 px-6'>
                Avatar
              </th>
              <th scope='col' className='py-3 px-6'>
                Name
              </th>
              <th scope='col' className='py-3 px-6'>
                Email
              </th>
              <th scope='col' className='py-3 px-6'>
                <span className='sr-only'>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {studentsQuery.data?.data.map((student) => (
              <tr
                key={student.id}
                className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                onMouseEnter={() => handlePrefetchStudent(student.id)}
              >
                <td className='py-4 px-6'>{student.id}</td>
                <td className='py-4 px-6'>
                  <img src={student.avatar} alt='student' className='h-5 w-5' />
                </td>
                <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                  {student.last_name}
                </th>
                <td className='py-4 px-6'>{student.email}</td>
                <td className='py-4 px-6 text-right'>
                  <Link
                    to={`/students/${student.id}`}
                    className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className='font-medium text-red-600 dark:text-red-500'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-center'>
        <nav aria-label='Page navigation example'>
          <ul className='inline-flex -space-x-px'>
            {/* Previous Page */}
            <li>
              {page === 1 ? (
                <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Previous
                </span>
              ) : (
                <Link
                  to={`/students?page=${page - 1}`}
                  className='cursor-pointer rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Previous
                </Link>
              )}
            </li>
            {Array(totalPage)
              .fill(0)
              .map((_, index) => {
                const pageNumber = index + 1
                const isActive = page === pageNumber
                return (
                  <li key={index}>
                    <Link
                      className={classNames(
                        'border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500  hover:bg-gray-100 hover:text-gray-700',
                        {
                          'bg-gray-100 text-red-700': isActive
                        }
                      )}
                      to={`/students?page=${pageNumber}`}
                    >
                      {pageNumber}
                    </Link>
                  </li>
                )
              })}

            {/* Next page */}
            <li>
              {page === totalPage ? (
                <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Next
                </span>
              ) : (
                <Link
                  to={`/students?page=${page + 1}`}
                  className=' cursor-pointer rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Next
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
