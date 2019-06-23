import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserRow from '../components/UserRow';
import { addRandomUser, addUser } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const userIds = useSelector(
    state => state.users.allIds
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
      <div>
        <div>
          <span>No.</span>
          <span>Name</span>
          <span>Phone</span>
          <span>*Email</span>
          <span>Action</span>
        </div>
        { userIds.map(id => <UserRow key={id} id={id} />)}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Add User" />
        <input name="name" type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}/>
        <input name="phone" type="tel" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })}/>
        <input name="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required/>
      </form>
    </div>
  );
}
