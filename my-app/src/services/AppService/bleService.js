import { BleManager, LogLevel } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { decode as atob } from 'base-64';

const HEIGHT_AND_TEMP_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const HR_AND_SPO2_AND_SYS_AND_DIA_SERVICE_UUID = '9f3c7d40-5d0a-4e8c-91b7-2b3c91a7f8d1';
const WEIGHT_SERVICE_UUID = 'c0de0000-7e0b-4a0a-9d6c-00000000b1c1';

const SYS_CHAR_UUID = '11111111-2222-3333-4444-555555555555';
const DIA_CHAR_UUID = '66666666-7777-8888-9999-AAAAAAAAAAAA';
const HR_CHAR_UUID = '1a2b3c4d-1234-5678-9abc-def123456789';
const SPO2_CHAR_UUID = 'abcdef01-2345-6789-abcd-ef0123456789';
const HEIGHT_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef1';
const WEIGHT_CHAR_UUID = 'c0de0001-7e0b-4a0a-9d6c-00000000b1c1';


class BleService {
  constructor() {
    this.manager = new BleManager();
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí',
            message: 'Ứng dụng cần quyền truy cập vị trí để quét Bluetooth.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
          result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }
    return true;
  }

  scanForDevices(onDeviceFound) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(1)
        console.error("Scan error:", error.message);
        return;
      }
      if (device?.name) {
        console.log("Found device:", device.name, device.id);
        onDeviceFound(device);
      }
    });
    return () => this.manager.stopDeviceScan();
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId, onDataReceived) {
    console.log("Connecting to device:", deviceId);
    const device = await this.manager.connectToDevice(deviceId, { timeout: 15000 });
    await device.discoverAllServicesAndCharacteristics();
    
    const services = await device.services();
    const serviceUUID = services[2]?.uuid;
    console.log("Discovered services:", services);
    console.log("Using service UUID:", serviceUUID);
    const characteristics = await device.characteristicsForService(services[2].uuid);
    console.log("Discovered characteristics:", characteristics);
    if (serviceUUID === HEIGHT_AND_TEMP_SERVICE_UUID) {
      console.log("Subscribing to Height and Temp characteristics");
      device.monitorCharacteristicForService(serviceUUID, HEIGHT_CHAR_UUID, (err, char) => {
        if (char?.value) onDataReceived({ Height: atob(char.value) });
      });
      // device.monitorCharacteristicForService(serviceUUID, TEMP_CHAR_UUID, (err, char) => {
      //   if (char?.value) onDataReceived({ Temp: atob(char.value) });
      // });
    }
    if (serviceUUID === HR_AND_SPO2_AND_SYS_AND_DIA_SERVICE_UUID) {
      console.log("Subscribing to HR and SpO2 characteristics");
      device.monitorCharacteristicForService(serviceUUID, HR_CHAR_UUID, (err, char) => {

        if (char?.value){
          console.log("Received HR data:", atob(char.value));
          onDataReceived({ HR: parseInt(atob(char.value), 10) });
        } 
      });
      device.monitorCharacteristicForService(serviceUUID, SPO2_CHAR_UUID, (err, char) => {
        if (char?.value) onDataReceived({ SpO2: parseInt(atob(char.value), 10) });
      });
      device.monitorCharacteristicForService(serviceUUID, SYS_CHAR_UUID, (err, char) => {
        if (char?.value) onDataReceived({ Sys: parseInt(atob(char.value), 10) });
      });
      device.monitorCharacteristicForService(serviceUUID, DIA_CHAR_UUID, (err, char) => {
        if (char?.value) onDataReceived({ Dia: parseInt(atob(char.value), 10) });
      });
    }
    if( serviceUUID === WEIGHT_SERVICE_UUID) {
      console.log("Subscribing to Weight characteristic");

      device.monitorCharacteristicForService(serviceUUID, WEIGHT_CHAR_UUID, (err, char) => {
        console.log(1);
        if (char?.value) onDataReceived({ Weight: atob(char.value) });
      });
    }
    return device;
  }

  async disconnectDevice(deviceId) {
    if (deviceId) {
      await this.manager.cancelDeviceConnection(deviceId);
    }
  }
}

export default new BleService();