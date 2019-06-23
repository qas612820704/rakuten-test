import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { delUser, updateUser } from '../redux/users';

export default function User({ id }) {
  const { user, updateUser, delUser } = useUser(id);
  const [isEditing, enableEiditing] = useState(false);
  const [modifiedUser, setModifiedUser] = useState(user);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      enableEiditing(false);
      updateUser(modifiedUser);
    }
  )

  return (
    <div onDoubleClick={() => enableEiditing(true)} onMouseLeave={() => enableEiditing(false)}>
      {!isEditing && (
        <>
          <span>{user.number}</span>
          <span>{user.name}</span>
          <span>{user.phone}</span>
          <span>{user.email}</span>
        </>
      )}
      { isEditing && (
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" value={modifiedUser.name} onChange={e => setModifiedUser({ ...modifiedUser, name: e.target.value })}/>
          <input name="phone" type="tel" value={modifiedUser.phone} onChange={e => setModifiedUser({ ...modifiedUser, phone: e.target.value })}/>
          <input name="email" type="email" value={modifiedUser.email} onChange={e => setModifiedUser({ ...modifiedUser, email: e.target.value })} required/>
          <input type="submit" value="Modify User" />
        </form>
      )}
      <button onClick={delUser}>delete</button>
    </div>
  );
}

function useUser(id) {
  const user = useSelector(
    state => state.users.byId[id],
    [id],
  );

  const dispatch = useDispatch();

  return {
    user,
    updateUser: useCallback(
      modifiedUser => dispatch(updateUser(modifiedUser)),
      [],
    ),
    delUser: useCallback(
      () => dispatch(delUser(id)),
      [id],
    ),
  };
}
