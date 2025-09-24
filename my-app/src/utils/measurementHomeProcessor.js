export const processMeasurements = (allMeasurements, mainProfileId, selectedDate, weeks) => {
  // Trả về trạng thái rỗng nếu không có dữ liệu cần thiết
  const emptyState = {
    currentWeight: null, summaryWeight: { avg: null, min: null, max: null },
    currentHeight: null, summaryHeight: { avg: null, min: null, max: null },
    currentBP: null, summaryBP: { avg: null, min: null, max: null },
    currentHeartRate: null, summaryHeartRate: { avg: null, min: null, max: null },
    currentSpO2: null, summarySpO2: { avg: null, min: null, max: null },
    currentTemperature: null, summaryTemperature: { avg: null, min: null, max: null },
    currentBMI: null,
  };
  
  if (!allMeasurements || allMeasurements.length === 0 || !mainProfileId) {
    return emptyState;
  }

  const endDate = new Date(selectedDate);
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (weeks * 7));

  const filtered = allMeasurements.filter(m => {
    const mDate = new Date(m.createdAt);
    return m.profileId === mainProfileId && mDate >= startDate && mDate <= endDate;
  });

  const calcSummary = (list) => {
    if (!list.length) return { avg: null, min: null, max: null };
    const values = list.map(m => parseFloat(m.value));
    return {
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      min: Math.min(...values).toFixed(1),
      max: Math.max(...values).toFixed(1),
    };
  };
  
  const getLatestValue = (list) => list.length ? list.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b).value : null;

  // Tính toán cho từng loại
  const weightList = filtered.filter(m => m.type === "weight");
  const heightList = filtered.filter(m => m.type === "height");
  const bpList = filtered.filter(m => m.type === "blood_pressure");
  const hrList = filtered.filter(m => m.type === "heart_rate");
  const spo2List = filtered.filter(m => m.type === "spo2");
  const tempList = filtered.filter(m => m.type === "temperature");

  const latestWeight = getLatestValue(weightList);
  const latestHeight = getLatestValue(heightList);

  let currentBMI = null;
  if (latestWeight && latestHeight) {
    const heightM = parseFloat(latestHeight) / 100;
    currentBMI = (parseFloat(latestWeight) / (heightM * heightM)).toFixed(1);
  }

  return {
    currentWeight: latestWeight, summaryWeight: calcSummary(weightList),
    currentHeight: latestHeight, summaryHeight: calcSummary(heightList),
    currentBP: getLatestValue(bpList), summaryBP: calcSummary(bpList),
    currentHeartRate: getLatestValue(hrList), summaryHeartRate: calcSummary(hrList),
    currentSpO2: getLatestValue(spo2List), summarySpO2: calcSummary(spo2List),
    currentTemperature: getLatestValue(tempList), summaryTemperature: calcSummary(tempList),
    currentBMI,
  };
};