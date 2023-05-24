import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TableDetail from './screens/TableDetail';
import CreateTable from './screens/CreateTable';
import UpdateTable from './screens/UpdateTable';
import {Provider} from 'react-redux';
import store from './store';

type Props = {};

const Stack = createNativeStackNavigator();

const App = (props: Props) => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
              contentStyle: {backgroundColor: 'white'},
            }}
          />
          <Stack.Screen
            name="TableDetail"
            component={TableDetail}
            options={{
              contentStyle: {backgroundColor: '#fff'},
            }}
          />
          <Stack.Screen
            name="CreateTable"
            component={CreateTable}
            options={{
              contentStyle: {backgroundColor: '#fff'},
            }}
          />
          <Stack.Screen
            name="UpdateTable"
            component={UpdateTable}
            options={{
              contentStyle: {backgroundColor: '#fff'},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
