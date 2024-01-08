import { Keys, getFromAsyncStorage } from '@utils/asyncStorage';
import axios, { CreateAxiosDefaults } from 'axios';


const baseURL = 'https://www.podhub.space'
// const baseURL = 'https://localhost:8989'
type headers = CreateAxiosDefaults<any>['headers']

export const getClient = async (headers?: headers) => {
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
    if(!token) return axios.create({baseURL, maxContentLength: Infinity, maxBodyLength: Infinity, })

    const defaultHeaders = {
        Authorization: 'Bearer '+token,
        ...headers
    }
    
    return axios.create({baseURL, maxContentLength: Infinity, maxBodyLength: Infinity, headers: defaultHeaders})
}