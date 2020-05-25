import axios from 'axios'

export default () => {
    //
    //const  __API__ = 'http://localhost:5000';
    const  __API__ = '';
    return axios.create({baseURL: __API__})
}
