import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Helmet from 'react-helmet';
import { set, omit } from 'lodash';
import Table, { MTableEditField } from 'material-table';

import { addRandomUser, addUser, updateUser, delUser } from '../redux/actions';

const MTableEditFieldWithErrorHandler = props => {
  const { columnDef, rowData, errors } = props;
  const field = columnDef.field;

  const isNewRow = !rowData.id && (errors.id === 'new users');

  const error = ((rowData.id === errors.id) || isNewRow) && errors[field];

  return (
    <div key={rowData.id}>
      { error && (
        <label style={{
          display: 'block',
          color: 'red',
          fontSize: '13px',
        }}>
        { error }
        </label>
      )}
      <MTableEditField {...props} />
    </div>
  );
}

export default () => {
  const dispatch = useDispatch();

  // Material Table will add some property in feeded data
  // that causes input will not close when updated.
  let users = useSelector(
    state => state.users.allIds.map(id => ({ ...state.users.byId[id] })),
  );

  const [formErrors, setFormErrors] = useState({});

  const hasError = Object.keys(formErrors).length > 0;

  users = hasError
    ? users.map(u => (u.id === formErrors.id) ? set(u, 'tableData.editing', 'update') : u)
    : users.map(u => omit(u, ['tableData.editing']));

  useEffect(() => {
    Array(5).fill().forEach(() => {
      dispatch(addRandomUser());
    })
  }, []);

  return (
    <div>
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <Table
        title='Rakuten Front End Test'
        options={{
          pageSize: 10,
        }}
        columns={[
          { title: 'No.', field: 'number', editable: 'never' },
          { title: 'Name', field: 'name' },
          { title: 'Phone', field: 'phone' },
          { title: 'Email', field: 'email' },
        ]}
        data={users}
        editable={{
          onRowAdd: async newUser => {
            setFormErrors({});
            try {
              return dispatch(addUser(newUser));
            } catch (e) {
              setFormErrors({
                id: newUser.id,
                ...e,
              });
              throw e;
            }
          },
          onRowUpdate: async updatedUser => {
            setFormErrors({});
            try {
              return dispatch(updateUser(updatedUser));
            } catch (e) {
              setFormErrors({
                id: 'new user',
                ...e,
              });
              throw e;
            }
          },
          onRowDelete: async user => {
            return dispatch(delUser(user.id));
          },
        }}
        components={{
          EditField: props => <MTableEditFieldWithErrorHandler {...props} errors={formErrors} />
        }}
      />
    </div>
  );
}
