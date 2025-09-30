import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BleService from '../services/AppService/bleService';
import { useMeasurementSubmit } from '../hooks/useMeasurementSubmit';
import { MEASUREMENT_CONFIG } from '../config/measurementConfig';

const BleMeasureScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [status, setStatus] = useState('Đang yêu cầu quyền...');
  const [data, setData] = useState({});
  const [hasSaved, setHasSaved] = useState(false);

  const { submitMeasurements, loading: isSaving } = useMeasurementSubmit();

  const dataRef = useRef(data);
  const hasSavedRef = useRef(hasSaved);
  const connectedDeviceRef = useRef(connectedDevice);

  useEffect(() => {
    dataRef.current = data;
    hasSavedRef.current = hasSaved;
    connectedDeviceRef.current = connectedDevice;
  }, [data, hasSaved, connectedDevice]);


  useEffect(() => {
    startScan();

    return () => {
      BleService.stopScan();
      const deviceToDisconnect = connectedDeviceRef.current;
      if (deviceToDisconnect) {
        BleService.disconnectDevice(deviceToDisconnect.id);
      }

      if (Object.keys(dataRef.current).length > 0 && !hasSavedRef.current) {
        console.log("Tự động lưu dữ liệu khi thoát...");
        handleSave(true);
      }
    };
  }, []);

  const startScan = async () => {
    const hasPermissions = await BleService.requestPermissions();
    if (!hasPermissions) {
      Alert.alert("Lỗi", "Vui lòng cấp quyền vị trí và Bluetooth để tiếp tục.");
      setStatus('Thiếu quyền truy cập');
      return;
    }
    setIsScanning(true);
    setStatus('Đang quét các thiết bị...');
    setDevices([]);
    BleService.scanForDevices(device => {
      setDevices(prevDevices => {
        if (!prevDevices.find(d => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });
    setTimeout(() => {
        setIsScanning(false);
        setStatus('Chọn một thiết bị để kết nối');
        BleService.stopScan();
    }, 10000);
  };

  const connectToDevice = async (device) => {
    BleService.stopScan();
    setIsScanning(false);
    setStatus(`Đang kết nối tới ${device.name}...`);
    try {
      await BleService.connectToDevice(device.id, (receivedData) => {
        setData(prevData => ({ ...prevData, ...receivedData }));
        console.log("Received data:", receivedData);
      });
      setConnectedDevice(device);
      setStatus(`Đã kết nối: ${device.name}`);
    } catch (error) {
      Alert.alert("Lỗi kết nối", error.message);
      setStatus('Kết nối thất bại');
    }
  };
  
  // ✅ HÀM ĐÃ ĐƯỢC SỬA LỖI
  const handleSave = async (isAutoSave = false) => {
    const currentData = dataRef.current; // Luôn lấy dữ liệu mới nhất từ ref

    // Sử dụng các key dạng snake_case để khớp với file config
    const formattedData = {};
    if (currentData.HR) formattedData.heart_rate = currentData.HR;
    if (currentData.SpO2) formattedData.spo2 = currentData.SpO2;
    if (currentData.Height) formattedData.height = currentData.Height;
    if (currentData.Weight) formattedData.weight = currentData.Weight;
    if (currentData.Sys && currentData.Dia) {
      formattedData.blood_pressure = `${currentData.Sys}/${currentData.Dia}`;
    }

    try {
      await submitMeasurements(formattedData, MEASUREMENT_CONFIG);
      setHasSaved(true);

      if (!isAutoSave) {
        Alert.alert("Thành công", "Đã lưu các chỉ số đo được!");
        navigation.goBack();
      }
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      if (!isAutoSave) {
        Alert.alert("Lỗi", err.message || "Không thể lưu chỉ số");
      }
    }
  };

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!connectedDevice ? (
        <>
          <Text style={styles.status}>{status}</Text>
          {isScanning && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}
          <FlatList
            data={devices}
            renderItem={renderDeviceItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text style={styles.centerText}>Không tìm thấy thiết bị nào</Text>}
          />
        </>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.status}>Đang nhận dữ liệu từ {connectedDevice.name}</Text>
          <Text style={styles.dataText}>Nhịp tim: {data.HR || '--'} bpm</Text>
          <Text style={styles.dataText}>SpO₂: {data.SpO2 || '--'} %</Text>
          <Text style={styles.dataText}>Chiều cao: {data.Height || '--'} cm</Text>
          <Text style={styles.dataText}>Cân nặng: {data.Weight || '--'} kg</Text>
          <Text style={styles.dataText}>Huyết áp: {data.Sys || '--'}/{data.Dia || '--'} mmHg</Text>
          {/* <Text style={styles.dataText}>Nhiệt độ: {data.Temp || '--'} °C</Text> */}
          <View style={styles.buttonContainer}>
            <Button 
              title={isSaving ? "Đang lưu..." : "Lưu kết quả"} 
              onPress={() => handleSave(false)}
              disabled={isSaving} 
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  status: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  deviceItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deviceName: { fontSize: 16 },
  deviceId: { fontSize: 12, color: 'gray' },
  centerText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  dataContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dataText: { fontSize: 20, marginBottom: 10 },
  buttonContainer: { marginTop: 30 },
});

export default BleMeasureScreen;
