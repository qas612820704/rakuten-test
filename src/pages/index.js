import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addRandomUser } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const users = useSelector(
    state => Object.values(state.users)
  );

  useEffect(() => {
    Array(5).fill().forEach(() => {
      dispatch(addRandomUser());
    })
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Phone</th>
          <th>*Email</th>
        </tr>
      </thead>
      <tbody>
      { users.map(user => (
        <tr key={user.name}>
          <td>{user.number}</td>
          <td>{user.name}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
