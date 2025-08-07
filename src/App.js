import React, { useEffect } from 'react'
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import supabase from './utils/supabase';
import { setSession } from './redux/authSlice'; // add this

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      dispatch(setSession(data?.session || null));
    };

    getSession();

    // Listen to future auth state change
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });


    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );

};


const App = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  )
}

export default App;