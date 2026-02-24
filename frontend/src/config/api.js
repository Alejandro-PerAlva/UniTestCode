// src/config/api.js

/**
 * En el servidor de la ULL:
 * La URL base es https://codetest.iaas.ull.es/tfgapa/
 * Por lo tanto, la API debe apuntar a /tfgapa/api
 */

const API_URL = import.meta.env.VITE_API_URL || '/tfgapa/api';

export default API_URL;