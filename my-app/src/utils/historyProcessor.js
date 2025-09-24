export const groupAndSortMeasurements = (measurements, profileId) => {
  if (!measurements || !profileId) return [];

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
    .map((key, idx) => ({
      id: idx + 1, // Tạo ID tạm thời cho FlatList
      createdAt: grouped[key].createdAt,
      types: grouped[key].types,
      ids: grouped[key].ids, // Mảng các ID thực tế để xóa
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return mergedArray;
};