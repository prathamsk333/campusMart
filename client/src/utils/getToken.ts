import Cookies from 'js-cookie';
export default function getToken() {
  const token = Cookies.get('jwt');
  // console.log(token);
  return token;
}