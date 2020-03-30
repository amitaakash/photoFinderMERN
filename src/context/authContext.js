import React, { createContext, useReducer } from 'react';
import { reducer } from '../reducer';
//import axios from '../axios';

export const AuthContext = createContext();

const AuthContextProvider = props => {
  let user = {};
  const [state, dispatch] = useReducer(reducer, user);
  console.log(state.id ? true : false);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
