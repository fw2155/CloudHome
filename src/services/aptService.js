import axios from "../axios";

export const aptService = {
    uploadSublease: (data, headers) => {
        return axios.post(`/upload`, data, headers); // baseUrl + '/' + 'courses'  34.x.x.x:8080/courses
    },
    getApt: (query, headers) => {
        return axios.get(`/searchhouse?q=${query}`, headers)
    },
    notifyLandlord: (data, headers) => {
        return axios.post(`/searchhouse`, data, headers);
    }
    // getPhotos: (query) => {
    //     return axios.get(`/search?q=${query}`)
    // },
    // sendPhoto: (bucket, imageName, formData, headers) => {
    //     return axios.put(`/upload/${bucket}/${imageName}`, formData, headers); // baseUrl + '/' + 'courses'  34.x.x.x:8080/courses
    // }
}