import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState, useMemo } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ranges = ["1D", "1W", "1M", "1Y", "All", "Tùy chỉnh"];

// --- CÁC HÀM HELPER ---

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const getDisplayDate = (range, customDateRange) => {
    const today = new Date();
    switch (range) {
        case "1D": return `Hôm nay, ${formatDate(today)}`;
        case "1W": {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 6);
            return `${formatDate(oneWeekAgo)} - ${formatDate(today)}`;
        }
        case "1M": {
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(today.getDate() - 29);
            return `${formatDate(oneMonthAgo)} - ${formatDate(today)}`;
        }
        case "1Y": {
             const oneYearAgo = new Date();
             oneYearAgo.setMonth(today.getMonth() - 11);
             const startMonth = `${(oneYearAgo.getMonth() + 1).toString().padStart(2, "0")}/${oneYearAgo.getFullYear()}`;
             const endMonth = `${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
             return `Tháng ${startMonth} - ${endMonth}`;
        }
        case "All": return "Toàn bộ thời gian";
        case "Tùy chỉnh": {
            if (customDateRange) {
                return `${formatDate(customDateRange.startDate)} - ${formatDate(customDateRange.endDate)}`;
            }
            return "Khoảng tùy chỉnh";
        }
        default: return formatDate(today);
    }
};

const getLabels = (activeRange, customDateRange) => {
    const today = new Date();
    let days;
    switch (activeRange) {
        case "1D": days = 1; break;
        case "1W": days = 7; break;
        case "1M": days = 30; break;
        case "1Y":
            return Array.from({ length: 12 }, (_, i) => {
                const d = new Date();
                d.setMonth(today.getMonth() - (11 - i));
                return `${(d.getMonth() + 1).toString().padStart(2, "0")}`; // Chỉ lấy tháng
            });
        case "Tùy chỉnh": {
            if (!customDateRange) return [];
            const labels = [];
            let currentDate = new Date(customDateRange.startDate);
            const endDate = new Date(customDateRange.endDate);
            while (currentDate <= endDate) {
                labels.push(currentDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return labels.length > 7 ? labels.filter((_, i) => i % Math.floor(labels.length / 7) === 0) : labels; // Rút gọn label nếu quá dài
        }
        case "All": return ["Data"]; // Trả về label đơn giản cho 'All'
        default: days = 7;
    }
    
    return Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (days - 1 - i));
        return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    });
};

const getChartValues = (labels, data, activeRange) => {
    if (activeRange === "All") {
        return data.map(item => Number(item.value) || 0);
    }

    return labels.map((label) => {
        const found = data.find((m) => {
            const mDate = new Date(m.createdAt);
            if (activeRange === "1Y") {
                const dateLabel = `${(mDate.getMonth() + 1).toString().padStart(2, "0")}`;
                return dateLabel === label;
            }
            const dateLabel = mDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
            return dateLabel === label;
        });

        let val = found?.value;
        if (found?.type === "blood_pressure" && typeof val === "string" && val.includes("/")) {
            val = Number(val.split("/")[0]);
        }
        return Number(val) || 0;
    });
};


export default function ChartCard({
    title, unit, initialData, color, styles,
    // Chỉ nhận 2 props này từ StatScreen cho chức năng tùy chỉnh
    onCustomRangePress, 
    customDateRange
}) {
    // 1. Mỗi Card tự quản lý activeRange của riêng nó
    const [activeRange, setActiveRange] = useState("1W");

    // 2. Tự động chuyển sang 'Tùy chỉnh' khi người dùng chọn ngày từ modal chung
    useEffect(() => {
        if (customDateRange && customDateRange.startDate && customDateRange.endDate) {
            setActiveRange("Tùy chỉnh");
        }
    }, [customDateRange]);

    // 3. Lọc dữ liệu bên trong Card bằng useMemo
    const filteredData = useMemo(() => {
        if (!initialData || initialData.length === 0) return [];
        
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        return initialData.filter(item => {
            const itemDate = new Date(item.createdAt);
            switch (activeRange) {
                case "1D": {
                    const startOfDay = new Date();
                    startOfDay.setHours(0, 0, 0, 0);
                    return itemDate >= startOfDay && itemDate <= today;
                }
                case "1W": {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(today.getDate() - 6);
                    oneWeekAgo.setHours(0, 0, 0, 0);
                    return itemDate >= oneWeekAgo && itemDate <= today;
                }
                case "1M": {
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setDate(today.getDate() - 29);
                    oneMonthAgo.setHours(0, 0, 0, 0);
                    return itemDate >= oneMonthAgo && itemDate <= today;
                }
                case "1Y": {
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(today.getFullYear() - 1);
                    oneYearAgo.setHours(0, 0, 0, 0);
                    return itemDate >= oneYearAgo && itemDate <= today;
                }
                case "Tùy chỉnh": {
                    if (!customDateRange || !customDateRange.startDate || !customDateRange.endDate) return false;
                    const startDate = new Date(customDateRange.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(customDateRange.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    return itemDate >= startDate && itemDate <= endDate;
                }
                case "All": default: return true;
            }
        });
    }, [initialData, activeRange, customDateRange]);


    // Các tính toán còn lại giờ sẽ dùng `filteredData`
    const displayDate = getDisplayDate(activeRange, customDateRange);
    const labels = getLabels(activeRange, customDateRange);
    const values = getChartValues(labels, filteredData, activeRange);

    const chartData = {
        labels: labels.length > 0 ? labels : [" "],
        datasets: [{ data: values.length > 0 ? values : [0], color: () => color, strokeWidth: 2 }],
    };

    return (
        <View style={styles.chartCard}>
            <View style={styles.headerRow}>
                <Text style={styles.chartTitle}>{title}</Text>
                <Text style={styles.chartDate}>{displayDate}</Text>
            </View>
            <Text style={styles.chartUnit}>{unit}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                {ranges.map((range) => (
                    <TouchableOpacity
                        key={range}
                        style={[styles.rangeButton, activeRange === range && styles.activeRange]}
                        onPress={() => range === 'Tùy chỉnh' ? onCustomRangePress() : setActiveRange(range)}
                    >
                        <Text style={[styles.rangeText, activeRange === range && styles.activeRangeText]}>{range}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {filteredData.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Không có dữ liệu trong khoảng thời gian này</Text>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                    <LineChart
                        data={chartData}
                        width={Math.max(SCREEN_WIDTH * 0.8, labels.length * 60)}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#fff", backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff", decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: { r: "4", strokeWidth: "2", stroke: color },
                        }}
                        bezier fromZero withVerticalLabels segments={5}
                    />
                </ScrollView>
            )}
        </View>
    );
}