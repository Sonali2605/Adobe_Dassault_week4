import axios from 'axios';

async function getRefreshToken() {
  try {
    const urlencoded = new URLSearchParams();
urlencoded.append("client_id", "449923a1-a01c-4bf5-b7c8-2137718d6d04");
urlencoded.append("client_secret", "b1b22c3e-900c-4bd1-b010-daf95c01b968");
urlencoded.append("refresh_token", "cfc9007046dac38146b4eae495192d3c");

    const response = await axios.post(
      'https://learningmanager.adobe.com/oauth/token/refresh',
      urlencoded,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const apis = {
  getRefreshToken
};