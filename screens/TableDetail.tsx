import React, {useState, useEffect, FC, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios, {Axios} from 'axios';
import {CONST} from '../Utility/const';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store';
import {useFocusEffect} from '@react-navigation/native';

interface TableDetailProps {
  navigation: any;
}

const TableDetail: FC<TableDetailProps> = props => {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);

  const tableId = useSelector((state: RootState) => state.tableId.id);

  useFocusEffect(
    useCallback(() => {
      fetchTableData();
    }, []),
  );

  const fetchTableData = async () => {
    try {
      const {data} = await axios.get(`${CONST.BASE_URL}/api/tables/${tableId}`);
      setColumns(data.columns);
      setRows(data.rows);
    } catch (error) {
      console.log('Error while fetching table data', error);
    }
  };

  const deleteTable = async () => {
    try {
      await axios.delete(`${CONST.BASE_URL}/api/tables/${tableId}`);
      props.navigation.navigate('HomeScreen');
    } catch (error) {
      console.log('Error while Deleting the table', error);
    }
  };

  if (!columns || !rows) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {columns.map((item, i) => (
          <View key={i} style={styles.cell}>
            <Text style={styles.columnText}>{item}</Text>
          </View>
        ))}
      </View>
      {rows?.map((row, i) => (
        <View key={i} style={styles.row}>
          {row?.map((data, ind) => (
            <View key={ind} style={styles.cell}>
              <Text style={styles.cellText}>{data}</Text>
            </View>
          ))}
        </View>
      ))}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('UpdateTable');
          }}
          style={{width: '45%', marginBottom: 5}}>
          <View style={styles.buttonOuter}>
            <Text style={styles.buttonText}>Update Table</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteTable}
          style={{width: '45%', marginBottom: 5}}>
          <View style={styles.buttonOuter}>
            <Text style={styles.buttonText}>Delete Table</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  columnText: {
    fontSize: 14,
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  cellText: {
    fontSize: 14,
    color: 'black',
  },
  buttonOuter: {
    paddingVertical: 17,
    backgroundColor: 'skyblue',
    borderRadius: 25,
    margin: 5,
  },
  buttonText: {color: 'black', textAlign: 'center', fontWeight: 'bold'},
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default TableDetail;
