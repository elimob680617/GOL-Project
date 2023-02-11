import jwtDecode from 'jwt-decode';

export default function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
}
