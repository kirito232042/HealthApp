// import { BleManager, LogLevel } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { decode as atob } from 'base-64';

const HEIGHT_AND_TEMP_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const HR_AND_SPO2_SERVICE_UUID = '9f3c7d40-5d0a-4e8c-91b7-2b3c91a7f8d';
const HR_CHAR_UUID = '1a2b3c4d-1234-5678-9abc-def123456789';
const SPO2_CHAR_UUID = 'abcdef01-2345-6789-abcd-ef0123456789';
const HEIGHT_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef1';
const TEMP_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef2';

class BleService {
  constructor() {
    // this.manager = new BleManager();
    this.mB = null;
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
        console.error("Scan error:", error.message);
        return;
      }
      if (device?.name) {
        onDeviceFound(device);
      }
    });
    return () => this.manager.stopDeviceScan();
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId, onDataReceived) {
    const device = await this.manager.connectToDevice(deviceId, { timeout: 15000 });
    await device.discoverAllServicesAndCharacteristics();
    
    const services = await device.services();
    for (const service of services) {
      if (service.uuid.toLowerCase() === HEIGHT_AND_TEMP_SERVICE_UUID) {
        device.monitorCharacteristicForService(service.uuid, HEIGHT_CHAR_UUID, (err, char) => {
          if (char?.value) onDataReceived({ Height: atob(char.value) });
        });
        device.monitorCharacteristicForService(service.uuid, TEMP_CHAR_UUID, (err, char) => {
          if (char?.value) onDataReceived({ Temp: atob(char.value) });
        });
      }
      if (service.uuid.toLowerCase() === HR_AND_SPO2_SERVICE_UUID) {
        device.monitorCharacteristicForService(service.uuid, HR_CHAR_UUID, (err, char) => {
          if (char?.value) onDataReceived({ HR: parseInt(atob(char.value), 10) });
        });
        device.monitorCharacteristicForService(service.uuid, SPO2_CHAR_UUID, (err, char) => {
          if (char?.value) onDataReceived({ SpO2: parseInt(atob(char.value), 10) });
        });
      }
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