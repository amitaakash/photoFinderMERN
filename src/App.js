import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import SignUp from './components/auth/signUp/signup';
import Login from './components/auth/Login/login';
//import Home from './components/home/home';
import Header from './components/header/header';
import Activate from './components/auth/activation/activation';
import AuthContextProvider from './context/authContext';
import Profile from './components/profilePage/profile';
import ProtectedRoute from './components/auth/protecteRoute/protectedRoute';
import Footer from './components/footer/footer';
import Search from './components/search/search';
import ForgotPassword from './components/auth/forgotPassword/forgotPassword';
import ResetPassword from './components/auth/resetPassword/resetPassword';

function App() {
  return (
    <AuthContextProvider>
      <div>
        <Header />
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Search />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/forgotpassword">
              <ForgotPassword />
            </Route>
            <Route path="/activate/:id" exact>
              <Activate />
            </Route>

            <Route path="/resetpassword/:id" exact>
              <ResetPassword />
            </Route>
            <Route path="/photos/:id" exact>
              <Search />
            </Route>

            <Route path="/activate" exact>
              <Activate />
            </Route>

            <ProtectedRoute path="/profile">
              <Profile />
            </ProtectedRoute>

            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </div>
      <Footer />
    </AuthContextProvider>
  );
}

export default App;
