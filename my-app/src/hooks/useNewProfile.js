import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { calculateAge, formatDateForAPI } from '../utils/dateProcessor';
import { createProfile } from '../services/API/userInforService';
import { getTokenAndUserId } from '../services/API/authService';

export const useNewProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dùng useMemo để tính toán lại tuổi chỉ khi `dob` thay đổi
  const age = useMemo(() => calculateAge(dob), [dob]);

  const handleCreate = async () => {
    const dobFormatted = formatDateForAPI(dob);

    if (!firstName || !lastName || !dobFormatted) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return null;
    }
    
    setIsLoading(true);
    try {
      const { userId } = await getTokenAndUserId();
      if (!userId) {
        console.log("User ID not found");
        throw new Error("User not logged in");
      }
      const profileData = {
        firstName,
        lastName,
        dob: dobFormatted,
        profile: false, 
      };
      
      const newProfile = await createProfile(userId, profileData);
      setIsLoading(false);
      return newProfile; 
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Lỗi", err.message || "Không thể tạo hồ sơ mới");
      return null;
    }
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    dob, setDob,
    age,
    isLoading,
    handleCreate,
  };
};