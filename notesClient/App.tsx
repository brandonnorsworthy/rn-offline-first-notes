/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import TodoList from './src/screens/main';
import {NetworkProvider} from './src/providers/NetworkProvider';

function App(): React.JSX.Element {
  return (
    <NetworkProvider>
      <SafeAreaView style={styles.container}>
        <TodoList />
      </SafeAreaView>
    </NetworkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
