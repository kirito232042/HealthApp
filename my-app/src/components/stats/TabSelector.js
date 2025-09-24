import { View, Text, TouchableOpacity } from "react-native";
import GradientText from "../GradientText";

export default function TabSelector({ activeTab, setActiveTab, styles }) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "chart" && styles.activeTab]}
        onPress={() => setActiveTab("chart")}
      >
        {activeTab === "chart" ? (
          <GradientText style={[styles.tabText, styles.activeTabText]}>Biểu đồ</GradientText>
        ) : (
          <Text style={styles.tabText}>Biểu đồ</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "measure" && styles.activeTab]}
        onPress={() => setActiveTab("measure")}
      >
        {activeTab === "measure" ? (
          <GradientText style={[styles.tabText, styles.activeTabText]}>Đo lường</GradientText>
        ) : (
          <Text style={styles.tabText}>Đo lường</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}