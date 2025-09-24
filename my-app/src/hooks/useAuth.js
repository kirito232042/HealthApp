import { useState } from 'react';
import { Alert } from 'react-native';
import { login as loginService } from '../services/API/authService';
import { register as registerService } from '../services/API/authService';
import { createProfile } from '../services/API/userInforService';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
      return null;
    }
    
    setIsLoading(true);
    try {
      const data = await loginService(email, password);
      setIsLoading(false);
      return data; 
    } catch (error) {
      setIsLoading(false);
      Alert.alert("❌ Lỗi", error.message);
      return null; 
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ thông tin.");
      return null;
    }
    
    setIsLoading(true);
    try {
      // Bước 1: Đăng ký tài khoản, lấy về userId
      const newUser = await registerService(email, password);
      const userId = newUser?.id;

      if (!userId) {
        throw new Error("Không nhận được ID người dùng sau khi đăng ký.");
      }

      // Bước 2: Dùng userId để tạo profile
      await createProfile(userId, { firstName, lastName, profile: true });
      
      setIsLoading(false);
      return { success: true }; // Trả về tín hiệu thành công
    } catch (error) {
      setIsLoading(false);
      Alert.alert("❌ Lỗi", error.message);
      return null;
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isLoading,
    handleLogin,
    handleRegister, // Export hàm mới
  };
};
