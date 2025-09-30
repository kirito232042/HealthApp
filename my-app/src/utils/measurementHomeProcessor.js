export const processMeasurements = (allMeasurements, mainProfileId, selectedDate, weeks) => {
  // Cập nhật emptyState để phản ánh cấu trúc mới của summaryBP
  const emptyState = {
    currentWeight: null, summaryWeight: { avg: null, min: null, max: null },
    currentHeight: null, summaryHeight: { avg: null, min: null, max: null },
    currentBP: null, summaryBP: { sys: { avg: null, min: null, max: null }, dia: { avg: null, min: null, max: null } },
    currentHeartRate: null, summaryHeartRate: { avg: null, min: null, max: null },
    currentSpO2: null, summarySpO2: { avg: null, min: null, max: null },
    currentTemperature: null, summaryTemperature: { avg: null, min: null, max: null },
    currentBMI: null,
  };
  
  if (!allMeasurements || allMeasurements.length === 0 || !mainProfileId) {
    return emptyState;
  }

  // --- PHẠM VI NGÀY CHO TÓM TẮT (VÍ DỤ: 7 NGÀY GẦN NHẤT) ---
  const summaryEndDate = new Date(selectedDate);
  summaryEndDate.setHours(23, 59, 59, 999);
  
  const summaryStartDate = new Date(summaryEndDate);
  // Lấy dữ liệu trong `weeks * 7` ngày tính đến ngày đã chọn
  summaryStartDate.setDate(summaryStartDate.getDate() - (weeks * 7 - 1));
  summaryStartDate.setHours(0, 0, 0, 0);

  // --- PHẠM VI NGÀY CHO CHỈ SỐ "HIỆN TẠI" (CHỈ NGÀY ĐÃ CHỌN) ---
  const dailyStartDate = new Date(selectedDate);
  dailyStartDate.setHours(0, 0, 0, 0);
  
  const dailyEndDate = new Date(selectedDate);
  dailyEndDate.setHours(23, 59, 59, 999);

  // Lọc dữ liệu cho tóm tắt tuần
  const weeklyFiltered = allMeasurements.filter(m => {
    const mDate = new Date(m.createdAt);
    return m.profileId === mainProfileId && mDate >= summaryStartDate && mDate <= summaryEndDate;
  });
  
  // Lọc dữ liệu chỉ cho ngày đã chọn
  const dailyFiltered = allMeasurements.filter(m => {
    const mDate = new Date(m.createdAt);
    return m.profileId === mainProfileId && mDate >= dailyStartDate && mDate <= dailyEndDate;
  });

  // Hàm tính toán summary cho các giá trị số thông thường
  const calcSummary = (list) => {
    if (!list.length) return { avg: null, min: null, max: null };
    const values = list.map(m => parseFloat(m.value)).filter(v => !isNaN(v));
    if (!values.length) return { avg: null, min: null, max: null };
    return {
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      min: Math.min(...values).toFixed(1),
      max: Math.max(...values).toFixed(1),
    };
  };

  // HÀM MỚI: Tính toán summary dành riêng cho huyết áp
  const calcBPSummary = (list) => {
    if (!list.length) return { sys: { avg: null, min: null, max: null }, dia: { avg: null, min: null, max: null } };
    
    const sysValues = [];
    const diaValues = [];

    list.forEach(m => {
      if (typeof m.value === 'string' && m.value.includes('/')) {
        const parts = m.value.split('/');
        const sys = parseFloat(parts[0]);
        const dia = parseFloat(parts[1]);
        if (!isNaN(sys)) sysValues.push(sys);
        if (!isNaN(dia)) diaValues.push(dia);
      }
    });

    const calc = (values) => {
        if (!values.length) return { avg: null, min: null, max: null };
        return {
            avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(0),
            min: Math.min(...values).toFixed(0),
            max: Math.max(...values).toFixed(0),
        };
    };

    return { sys: calc(sysValues), dia: calc(diaValues) };
  };
  
  const getLatestValue = (list) => list.length ? list.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b).value : null;

  // TÍNH TOÁN DỰA TRÊN CÁC BỘ DỮ LIỆU ĐÃ LỌC RIÊNG
  
  // Tính summary từ dữ liệu CẢ TUẦN
  const summaryWeight = calcSummary(weeklyFiltered.filter(m => m.type === "weight"));
  const summaryHeight = calcSummary(weeklyFiltered.filter(m => m.type === "height"));
  const summaryBP = calcBPSummary(weeklyFiltered.filter(m => m.type === "blood_pressure"));
  const summaryHeartRate = calcSummary(weeklyFiltered.filter(m => m.type === "heart_rate"));
  const summarySpO2 = calcSummary(weeklyFiltered.filter(m => m.type === "spo2"));
  const summaryTemperature = calcSummary(weeklyFiltered.filter(m => m.type === "temperature"));

  // Lấy giá trị mới nhất từ dữ liệu CỦA NGÀY ĐÃ CHỌN
  const latestWeight = getLatestValue(dailyFiltered.filter(m => m.type === "weight"));
  const latestHeight = getLatestValue(dailyFiltered.filter(m => m.type === "height"));
  const latestBP = getLatestValue(dailyFiltered.filter(m => m.type === "blood_pressure"));
  const latestHeartRate = getLatestValue(dailyFiltered.filter(m => m.type === "heart_rate"));
  const latestSpO2 = getLatestValue(dailyFiltered.filter(m => m.type === "spo2"));
  const latestTemperature = getLatestValue(dailyFiltered.filter(m => m.type === "temperature"));

  let currentBMI = null;
  if (latestWeight && latestHeight) {
    const heightM = parseFloat(latestHeight) / 100;
    currentBMI = (parseFloat(latestWeight) / (heightM * heightM)).toFixed(1);
  }

  return {
    currentWeight: latestWeight,
    summaryWeight,
    currentHeight: latestHeight,
    summaryHeight,
    currentBP: latestBP,
    summaryBP,
    currentHeartRate: latestHeartRate,
    summaryHeartRate,
    currentSpO2: latestSpO2,
    summarySpO2,
    currentTemperature: latestTemperature,
    summaryTemperature,
    currentBMI,
  };
};