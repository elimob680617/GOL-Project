import { useCallback, useState } from 'react';

// import { useLocation, useNavigate } from 'react-router-dom';
import { chat, cms, cognito, connection, history, locality, post, postbehavior, profile, search } from 'src/_apis';
import { getUserQuery } from 'src/_graphql/profile/users/queries/getUser';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setUser, userSelector } from 'src/store/slices/auth';
import isValidToken from 'src/utils/isValidToken';

const useAuth = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  const [loading, setLoading] = useState(false);
  const accessToken = window.localStorage.getItem('accessToken');

  const login = useCallback(async (username: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    setLoading(true);
    const urlencoded = new URLSearchParams();
    urlencoded.append('client_id', 'gol_client');
    urlencoded.append('grant_type', 'password');
    urlencoded.append('client_secret', 'b56eaf7d-0f44-48fe-80cc-367aae6aeff3');
    urlencoded.append('username', username);
    urlencoded.append('password', password);
    // urlencoded.append('username', '01geel0rxz@chantellegribbon.com');
    // urlencoded.append('password', 'Mm123456!');
    urlencoded.append('scope', 'offline_access openid profile');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };

    const data = await fetch('https://devids.aws.gardenoflove.co/connect/token?lang=en-US', requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log('error', error));

    setToken(data.access_token);

    const user: any = await getUserQuery();

    setLoading(false);
    dispatch(setUser({ ...user, isAuthenticated: true }));
    return { fullName: user?.fullName, id: user?.id };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setToken = useCallback((accToken: string | null) => {
    let token = '';
    if (accToken) {
      token = `Bearer ${accToken}`;
      localStorage.setItem('accessToken', accToken);
    } else {
      localStorage.removeItem('accessToken');
    }

    post.setHeader('authorization', token);
    cms.setHeader('authorization', token);
    cognito.setHeader('authorization', token);
    profile.setHeader('authorization', token);
    locality.setHeader('authorization', token);
    chat.setHeader('authorization', token);
    postbehavior.setHeader('authorization', token);
    connection.setHeader('authorization', token);
    search.setHeader('authorization', token);
    history.setHeader('authorization', token);
  }, []);

  const initialize = async () => {
    setLoading(true);

    if (accessToken && isValidToken(accessToken)) {
      setToken(accessToken);
      const user = await getUserQuery();
      dispatch(setUser(user));
    }

    setLoading(false);
  };

  const { user } = useAppSelector(userSelector);

  return {
    login,
    setToken,
    user,
    initialize,
    loading,
    logout,
    isAuthenticated: accessToken ? isValidToken(accessToken) : false,
  };
};

export default useAuth;
