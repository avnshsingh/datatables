import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, FC, useCallback} from 'react';
import axios from 'axios';
import {CONST} from '../Utility/const';
import {useDispatch} from 'react-redux';
import {updateTableId} from '../reducers/tableSlice';
import {useFocusEffect} from '@react-navigation/native';

interface HomeScreenProps {
  navigation: any;
}

interface tableInfo {
  id: number;
  name: string;
  column: string[];
  row: string[];
}

const HomeScreen: FC<HomeScreenProps> = props => {
  const [tableInfo, setTableInfo] = useState<tableInfo[] | null>(null);

  const dispatch = useDispatch();

  const getAllTables = async () => {
    try {
      const {data} = await axios.get(`${CONST.BASE_URL}/api/tables`);
      setTableInfo(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllTables();
    }, []),
  );

  // Loader
  if (!tableInfo) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  return (
    <View style={{paddingHorizontal: 15}}>
      <Text style={[styles.itemName, styles.headerCenter]}>
        All Available Tables
      </Text>

      <TouchableOpacity
        onPress={() => props.navigation.navigate('CreateTable')}>
        <View style={[styles.buttonOuter]}>
          <Text style={styles.buttonText}>Create a New Table</Text>
        </View>
      </TouchableOpacity>

      {tableInfo && tableInfo.length > 0 ? (
        <View style={{marginBottom: 10}}>
          <FlatList
            data={tableInfo}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(updateTableId(item.id));
                  props.navigation.navigate('TableDetail');
                }}>
                <View style={styles.listItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item?.id?.toString() + Math.random() * 100}
          />
        </View>
      ) : (
        <Button
          title="Create New Table"
          onPress={props.navigation.navigate('CreateTable')}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  listItem: {
    backgroundColor: 'skyblue',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 0.5,
  },
  itemName: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonOuter: {
    paddingVertical: 17,
    backgroundColor: 'skyblue',
    borderRadius: 25,
    margin: 5,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerCenter: {textAlign: 'center', marginVertical: 10},
});
