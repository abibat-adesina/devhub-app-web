export default {
  
  "session": {
    "maxAge": 604800000,
    "expires": 604800000
  },
  "sso": {
    "grantType": "client_credentials",
    "clientId": "devhub-api",
    "callback": "/v1/auth/callback",
    "authUrl": "https://sso.pathfinder.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/auth",
    "tokenUrl": "https://sso.pathfinder.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/token",
    "certsUrl": "https://sso.pathfinder.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/certs"
  }
}