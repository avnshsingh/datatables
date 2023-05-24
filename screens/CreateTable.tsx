import React, {useState, FC} from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {CONST} from '../Utility/const';

interface CreateTableProps {
  navigation: any;
}

const CreateTable: FC<CreateTableProps> = props => {
  const [name, setName] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);

  const addColumn = () => {
    setColumns([...columns, '']);
  };

  const deleteColumn = (index: number): void => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleChangeColumn = (index: number, value: string): void => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    setColumns(updatedColumns);
  };

  const addRow = () => {
    const newRow = columns.map(() => '');
    setRows([...rows, newRow]);
  };

  const deleteRow = (index: number): void => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleChangeRow = (
    rowIndex: number,
    columnIndex: number,
    value: string,
  ): void => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnIndex] = value;
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    const nonEmptyRows = rows.filter(row => row.some(value => value !== ''));
    const payload = {
      name,
      columns,
      rows: nonEmptyRows,
    };
    try {
      await axios.post(`${CONST.BASE_URL}/api/tables/`, payload);
      props.navigation.navigate('HomeScreen');
    } catch (error) {
      console.log('Error while creating table:', error);
    }
  };

  const renderRowInputs = () => {
    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.rowContainer}>
        <FlatList
          data={row}
          horizontal
          renderItem={({item: value, index: columnIndex}) => (
            <TextInput
              key={`${rowIndex}-${columnIndex}`}
              style={styles.input}
              placeholder={`Row ${rowIndex + 1}, Column ${columnIndex + 1}`}
              placeholderTextColor="black"
              value={value}
              onChangeText={text =>
                handleChangeRow(rowIndex, columnIndex, text)
              }
            />
          )}
          keyExtractor={(item, index) => `${rowIndex}-${index}`}
        />

        <TouchableOpacity
          onPress={() => deleteRow(rowIndex)}
          style={{width: '90%', marginBottom: 5}}>
          <View style={styles.buttonOuter}>
            <Text style={styles.buttonText}>Delete Above Row</Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Table Name"
              placeholderTextColor="black"
              value={name}
              onChangeText={setName}
            />
          </View>
          <TouchableOpacity onPress={addColumn}>
            <View style={styles.buttonOuter}>
              <Text style={styles.buttonText}>Add Another Column</Text>
            </View>
          </TouchableOpacity>
          {columns.map((column, index) => (
            <View key={index} style={styles.inputContainer}>
              <TextInput
                style={[styles.input, {width: '60%'}]}
                placeholder={`Column ${index + 1}`}
                placeholderTextColor="black"
                value={column}
                onChangeText={value => handleChangeColumn(index, value)}
              />
              <TouchableOpacity onPress={() => deleteColumn(index)}>
                <View style={[styles.buttonOuter, {width: 100}]}>
                  <Text style={styles.buttonText}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addRow}>
            <View style={styles.buttonOuter}>
              <Text style={styles.buttonText}>Add Another Row</Text>
            </View>
          </TouchableOpacity>
          {renderRowInputs()}
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.buttonOuter}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'skyblue',
    borderRadius: 25,
    borderWidth: 2,
    paddingLeft: 10,
    margin: 2,
    color: 'black',
  },
  buttonOuter: {
    paddingVertical: 17,
    backgroundColor: 'skyblue',
    borderRadius: 25,
    margin: 5,
  },
  buttonText: {color: 'black', textAlign: 'center', fontWeight: 'bold'},
  rowContainer: {
    alignItems: 'center',
    gap: 10,
  },
});

export default CreateTable;
