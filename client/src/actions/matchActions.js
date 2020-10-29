import { SET_MATCH_LOADING } from './Types';
const factory = require('./actionsFactory');

// Get all users matches

export const getMatches = () =>
  factory.get('/api/v1/crushes/matches', 'GET_MATCHES', 'MATCH_ERROR');

// Set Crush Loading
export const setLoading = () => ({ type: SET_MATCH_LOADING });
