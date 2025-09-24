import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { calculateAge, formatDateForAPI } from '../utils/dateProcessor';
import { updateProfileDetails } from '../services/API/userInforService';

export const useProfileDetail = (initialProfile) => {
  const [firstName, setFirstName] = useState(initialProfile?.firstName || '');
  const [lastName, setLastName] = useState(initialProfile?.lastName || '');
  const [dob, setDob] = useState(initialProfile?.dob || '');
  const [isLoading, setIsLoading] = useState(false);

  const age = useMemo(() => calculateAge(dob), [dob]);

  const handleUpdate = async () => {
    const dobFormatted = formatDateForAPI(dob);

    if (!firstName || !lastName || !dobFormatted) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return null;
    }

    setIsLoading(true);
    try {
      const payload = {
        profileId: initialProfile.id,
        firstName,
        lastName,
        dob: dobFormatted,
      };
      const updatedProfile = await updateProfileDetails(payload);
      setIsLoading(false);
      return updatedProfile;
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Lỗi", err.message);
      return null;
    }
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    dob, setDob,
    age,
    isLoading,
    handleUpdate,
  };
};