export const calculateAge = (dobString) => {
  if (!dobString || dobString.length < 8) return null;
  
  const parts = dobString.includes("/") ? dobString.split("/") : dobString.split("-");
  if (parts.length !== 3) return null;

  let birthDate;
  try {
    if (dobString.includes("/")) {
      // dd/MM/yyyy
      birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      // yyyy-MM-dd
      birthDate = new Date(parts[0], parts[1] - 1, parts[2]);
    }

    // Kiểm tra xem ngày có hợp lệ không
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (error) {
    return null;
  }
};

export const formatDateForAPI = (dobString) => {
  if (!dobString || !dobString.includes("/")) return dobString;
  const [d, m, y] = dobString.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};