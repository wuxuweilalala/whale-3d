import axios from 'axios'
import { getQueryString, } from '@/utils/utilsMethods';

let token =  getQueryString('token')
let http=axios.create({
	headers:{
		token,
	},
	timeout:180000,
	baseURL:'http://whalehouse_p.24e.co/'
});



/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
	return new Promise((resolve, reject) => {
		http.get(url, {
			params: {
				...params,
				// t: Date.now()
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
	return http.post(url, data)
		.then(response => {
			return Promise.resolve(response.data);
		}, err => {
			return Promise.reject(err);
		});
}
// export function post(url, data = {}) {
// 	return new Promise((resolve, reject) => {
// 		axios.post(url, data)
// 			.then(response => {
// 				resolve(response.data);
// 			}, err => {
// 				reject(err);
// 			});
// 	});
// }

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		http.patch(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			});
	});
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		http.put(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			});
	});
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, data = {data: {}}) {
	return new Promise((resolve, reject) => {
		http.delete(url, { data })
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			});
	});
}
export default{
	install(Vue){
		Vue.prototype.$get=get;
		Vue.prototype.$post=post;
		Vue.prototype.$del=del;
		Vue.prototype.$put=put;
	}
}
