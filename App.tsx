import {View, Text} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import Router from './src/Router/Router';
import {store} from './src/redux/store';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router />
      </Provider>
    </>
  );
};

export default App;
