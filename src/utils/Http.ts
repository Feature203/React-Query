import axios, { AxiosInstance } from 'axios'

class Http {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public getInstance() {
    return this.instance
  }

  public static cusTom() {
    axios.get('http://localhost:4000', {
      params: {
        page: 1,
        limit: 10
      },
      headers: {
        'x-api-key': 'asgd7asd5afsadasd'
      }
    })
  }
}

const http = new Http().getInstance()

export default http
