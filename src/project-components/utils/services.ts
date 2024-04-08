import axios from 'axios';
// import { getToken, isLogin } from './Auth';
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../../AppConfig"
 
export async function jwtInterceptor () {
    const client_id = clientId;
    const client_secret = clientSecreat;
    const refresh_token = refreshToken;

    const params = new URLSearchParams({
      client_id,
      client_secret,
      refresh_token
    });
    const url = `${base_adobe_url}/oauth/token/refresh`;
    const responseToken = await axios.post(
      `${url}`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const tokenData = responseToken.data;
axios.defaults.headers.common = {'Authorization': `Bearer ${tokenData.access_token}`}
}