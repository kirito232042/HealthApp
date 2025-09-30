
const STATUS = {
  NORMAL: "Bình thường",
  DANGEROUS: "Nguy hiểm",
};

// Ngưỡng tham khảo (bạn có thể điều chỉnh dựa trên tư vấn y tế)
const thresholds = {
  spo2: { normal: 95, dangerous: 92 }, // Dưới 92% là nguy hiểm
  heart_rate: { normal_min: 60, normal_max: 100, dangerous_min: 50, dangerous_max: 120 }, // Ngoài khoảng 50-120 là nguy hiểm
  blood_pressure: {
    systolic_max: 140, // Tâm thu
    diastolic_max: 90,  // Tâm trương
  },
  // Thêm các ngưỡng khác nếu cần
};

/**
 * Đánh giá một chỉ số đơn lẻ
 * @param {string} type - Loại chỉ số (ví dụ: 'spo2')
 * @param {string | number} value - Giá trị của chỉ số
 * @returns {string} - Trạng thái 'Bình thường' hoặc 'Nguy hiểm'
 */
const getIndividualStatus = (type, value) => {
    console.log(`Evaluating ${type} with value: ${value}`);
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return STATUS.NORMAL;

  switch (type) {
    case "spo2":
      if (numValue < thresholds.spo2.dangerous) return STATUS.DANGEROUS;
      break;
    case "heart_rate":
      if (numValue < thresholds.heart_rate.dangerous_min || numValue > thresholds.heart_rate.dangerous_max) {
        return STATUS.DANGEROUS;
      }
      break;
    case "blood_pressure":
      if (String(value).includes('/')) {
        const [systolic, diastolic] = String(value).split('/').map(Number);
        if (systolic > thresholds.blood_pressure.systolic_max || diastolic > thresholds.blood_pressure.diastolic_max) {
          return STATUS.DANGEROUS;
        }
      }
      break;
    default:
      return STATUS.NORMAL;
  }
  return STATUS.NORMAL;
};


/**
 * Đánh giá trạng thái chung của một nhóm các chỉ số đo được
 * @param {object} types - Object chứa các chỉ số đo được (ví dụ: item.types từ historyProcessor)
 * @returns {object} - { status: 'Bình thường' | 'Nguy hiểm', color: 'green' | 'red' }
 */
export const getOverallStatus = (types) => {
  for (const type in types) {
    const { value } = types[type];
    if (getIndividualStatus(type, value) === STATUS.DANGEROUS) {
      return { status: STATUS.DANGEROUS, color: "#D9534F" }; // Màu đỏ
    }
  }
  return { status: STATUS.NORMAL, color: "green" }; // Màu xanh
};

/**
 * Tạo thông điệp cảnh báo dựa trên các chỉ số nguy hiểm
 * @param {object} measurementsData - Dữ liệu người dùng nhập vào
 * @returns {string | null} - Thông điệp cảnh báo hoặc null
 */
export const getWarningMessage = (measurementsData) => {
    const dangerousReadings = [];

    for (const type in measurementsData) {
        const value = measurementsData[type];
        if (value && getIndividualStatus(type, value) === STATUS.DANGEROUS) {
            dangerousReadings.push(`${typeLabels[type] || type}: ${value}`);
        }
    }

    if (dangerousReadings.length > 0) {
        return `Các chỉ số sau đây ở mức nguy hiểm, bạn nên tham khảo ý kiến bác sĩ:\n- ${dangerousReadings.join('\n- ')}`;
    }

    return null;
};

// Dùng để hiển thị tên chỉ số trong cảnh báo
const typeLabels = {
  weight: "Cân nặng", height: "Chiều cao", blood_pressure: "Huyết áp",
  spo2: "SpO₂", heart_rate: "Nhịp tim", temperature: "Nhiệt độ",
};