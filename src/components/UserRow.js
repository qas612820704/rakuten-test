import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { delUser } from '../redux/users';

export default function User({ name }) {
  const { user, delUser } = useUser(name);

  return (
    <tr key={user.name}>
      <td>{user.number}</td>
      <td>{user.name}</td>
      <td>{user.phone}</td>
      <td>{user.email}</td>
      <td><button onClick={delUser}>delete</button></td>
    </tr>
  );
}

function useUser(name) {
  const user = useSelector(
    state => state.users[name],
    [name],
  );

  const dispatch = useDispatch();

  const handleDelUser = useCallback(
    () => dispatch(delUser(name)),
    [name],
  )

  return {
    user,
    delUser: handleDelUser,
  };
}
