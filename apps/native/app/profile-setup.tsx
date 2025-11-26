import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import type { AgeGroup, Gender, GutHealthType, ProfileData } from "../types/profile";

export default function ProfileSetup() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [gutHealthType, setGutHealthType] = useState<GutHealthType | null>(null);

  const ageGroups: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];
  const genders: Gender[] = ["남성", "여성"];
  const gutHealthTypes: GutHealthType[] = ["건강형", "변비형", "설사형", "가스,복부팽만형"];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const isFormValid = nickname && ageGroup && gender && gutHealthType;

  const handleComplete = () => {
    if (!isFormValid) return;

    const profileData: ProfileData = {
      nickname,
      ageGroup: ageGroup!,
      gender: gender!,
      gutHealthType: gutHealthType!,
      profileImage: profileImage || undefined,
    };

    console.log("프로필 데이터:", profileData);
    Alert.alert("완료", "프로필 설정이 완료되었습니다!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 설정</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="김허브"
              value={nickname}
              onChangeText={setNickname}
              maxLength={10}
            />
            {nickname && (
              <TouchableOpacity onPress={() => setNickname("")} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>연령대</Text>
          <View style={styles.optionsRow}>
            {ageGroups.map((age) => (
              <TouchableOpacity
                key={age}
                style={[styles.optionButton, ageGroup === age && styles.optionButtonSelected]}
                onPress={() => setAgeGroup(age)}
              >
                <Text
                  style={[styles.optionText, ageGroup === age && styles.optionTextSelected]}
                >
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.optionsRow}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.optionButton,
                  styles.optionButtonLarge,
                  gender === g && styles.optionButtonSelected,
                ]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>장건강 유형</Text>
          <View style={styles.optionsRow}>
            {gutHealthTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  gutHealthType === type && styles.optionButtonSelected,
                ]}
                onPress={() => setGutHealthType(type)}
              >
                <Text
                  style={[styles.optionText, gutHealthType === type && styles.optionTextSelected]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.completeButton, !isFormValid && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={styles.completeButtonText}>완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EE8688",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EE8688",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconText: {
    fontSize: 20,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 24,
    color: "#999",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  optionButtonLarge: {
    flex: 1,
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#FFF0F0",
    borderColor: "#EE8688",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "#666",
  },
  optionTextSelected: {
    color: "#EE8688",
    fontFamily: "Pretendard-SemiBold",
  },
  completeButton: {
    height: 52,
    backgroundColor: "#EE8688",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonDisabled: {
    backgroundColor: "#d0d0d0",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: "#fff",
  },
});
