import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserRow from '../components/UserRow';
import { addRandomUser, addUser } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const userNames = useSelector(
    state => Object.keys(state.users)
  );

  useEffect(() => {
    Array(5).fill().forEach(() => {
      dispatch(addRandomUser());
    })
  }, []);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(addUser(newUser));
    },
  )

  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Phone</th>
            <th>*Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        { userNames.map(name => <UserRow key={name} name={name} />)}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Add User" />
        <input name="name" type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}/>
        <input name="phone" type="tel" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })}/>
        <input name="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required/>
      </form>
    </div>
  );
}
