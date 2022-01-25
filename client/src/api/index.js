import axios from 'axios'
import config from '../config'

function getTokenHeader() {
	return { headers: { 'x-auth-token': localStorage.getItem('id_token') } }
}

export function getUsers(params) {
	return axios.post(`${config.apiUrl}/api/users/list`, params, getTokenHeader())
}

export function deleteUser(user_id) {
	return axios.post(`${config.apiUrl}/api/users/delete`, { user_id }, getTokenHeader())
}

export function updateUser(user) {
	return axios.post(`${config.apiUrl}/api/users/update`, user, getTokenHeader())
}

export function createUser(user) {
	return axios.post(`${config.apiUrl}/api/users/create`, user, getTokenHeader())
}

// ---------------- Account -----------------

export function getAccounts(params) {
	return axios.post(`${config.apiUrl}/api/accounts/list`, params, getTokenHeader())
}

export function deleteAccount(account_id) {
	return axios.post(`${config.apiUrl}/api/accounts/delete`, { account_id }, getTokenHeader())
}

export function updateAccount(account) {
	return axios.post(`${config.apiUrl}/api/accounts/update`, account, getTokenHeader())
}

export function createAccount(account) {
	return axios.post(`${config.apiUrl}/api/accounts/create`, account, getTokenHeader())
}

// ------------------- Team --------------------------

export function getTeams(params) {
	return axios.post(`${config.apiUrl}/api/teams/list`, params, getTokenHeader())
}

export function deleteTeam(team_id) {
	return axios.post(`${config.apiUrl}/api/teams/delete`, { team_id }, getTokenHeader())
}

export function updateTeam(team) {
	return axios.post(`${config.apiUrl}/api/teams/update`, team, getTokenHeader())
}

export function createTeam(team) {
	return axios.post(`${config.apiUrl}/api/teams/create`, team, getTokenHeader())
}