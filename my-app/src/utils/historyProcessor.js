import { getOverallStatus } from './healthStatus';
export const groupAndSortMeasurements = (measurements, profileId) => {
  if (!measurements || !profileId) return [];
  console.log("Grouping measurements for profileId:", profileId);
  // 1. Lọc theo profileId
  const filtered = measurements.filter(item => item.profileId === profileId);

  // 2. Gom nhóm theo createdAt
  const grouped = {};
  filtered.forEach(item => {
    const key = item.createdAt; // Sử dụng timestamp làm key duy nhất
    if (!grouped[key]) {
      grouped[key] = { createdAt: item.createdAt, types: {}, ids: {} };
    }
    grouped[key].types[item.type] = {
      value: item.value,
      unit: item.unit,
      id: item.id,
    };
    // Lưu lại tất cả ID của các measurement trong nhóm này
    grouped[key].ids[item.type] = item.id;
  });

  // 3. Chuyển đổi object thành mảng và sắp xếp
  const mergedArray = Object.keys(grouped)
    .map((key, idx) => {
      const statusInfo = getOverallStatus(grouped[key].types); // <-- Lấy trạng thái
      return {
        id: idx + 1,
        createdAt: grouped[key].createdAt,
        types: grouped[key].types,
        ids: grouped[key].ids,
        status: statusInfo.status, // <-- Thêm trạng thái vào object
        statusColor: statusInfo.color, // <-- Thêm màu vào object
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return mergedArray;
};