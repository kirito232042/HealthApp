import { useState } from "react";
// Chúng ta vẫn giữ service, hook sẽ gọi vào service để thực thi logic
import { saveManualMeasurements } from "../services/API/measurementsService";

export const useMeasurementSubmit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm này sẽ được gọi từ component
    const submitMeasurements = async (measurementsData, config) => {
        setLoading(true);
        setError(null);
        try {
            // Gọi vào hàm service đã có sẵn
            await saveManualMeasurements(measurementsData, config);
            const warning = getWarningMessage(measurementsData);
            return { success: true, warning };
        } catch (err) {
            setError(err);
            // Ném lỗi ra ngoài để component có thể bắt và xử lý (ví dụ: hiển thị Alert)
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Hook trả về trạng thái và hàm thực thi
    return { submitMeasurements, loading, error };
};