import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "./../constants/Colors";
import { Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../config/FirebaseConfig";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
export default function AddNewPet() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    category: "dogs",
    sex: "male",
  });
  const navigation = useNavigation();
  const [gender, setGender] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(null);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
    getCategories();
  }, []);
  const getCategories = async () => {
    setCategories([]);
    const snapShot = await getDocs(collection(db, "Categories"));
    snapShot.forEach((category) => {
      setCategories((categories) => [...categories, category.data()]);
    });
  };
  const handleSubmit = async () => {
    if (Object.keys(formData).length != 8) {
      ToastAndroid.show("Complete the form!", ToastAndroid.SHORT);
      return;
    }
    await uploadImage();
    // console.log(formData);
  };

  const uploadImage = async () => {
    setLoader(true);
    const res = await fetch(image);
    const blob = await res.blob();
    const storageRef = ref(storage, "/buddy/" + Date.now() + ".jpg");
    uploadBytes(storageRef, blob)
      .then((snapShot) => {
        console.log("file upladed");
      })
      .then((res) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          await saveFormData(downloadUrl);
        });
      });
    setLoader(false);
    router.replace('/(tabs)/home')
  };
  const saveFormData = async (url) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      id: docId,
      imageUrl:url,
      user: {
        email: user.primaryEmailAddress.emailAddress,
        imageUrl: user.imageUrl,
        name: user.fullName,
        phone: null,
      },
    });
  };
  const handleTextChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <ScrollView
      style={{
        padding: 20,
      }}
    >
      <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
        Add new pet for adoption.
      </Text>
      <View style={styles.container}>
        <Pressable onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image
              source={require("./../assets/images/login.png")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                borderColor: Colors.GRAY,
                borderWidth: 1,
              }}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category *</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            handleTextChange("category", itemValue);
          }}
        >
          {categories.map((cat, index) => (
            <Picker.Item key={index} label={cat.name} value={cat.name} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleTextChange("name", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <Picker
          style={styles.input}
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            handleTextChange("sex", itemValue);
          }}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleTextChange("breed", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleTextChange("age", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleTextChange("weight", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleTextChange("address", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
          numberOfLines={5}
          multiline={true}
          style={styles.input}
          onChangeText={(value) => handleTextChange("about", value)}
        />
      </View>
      <Pressable
        disabled={loader}
        onPress={() => handleSubmit()}
        style={styles.button}
      >
        {loader ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Add
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    fontFamily: "outfit",
    marginVertical: 5,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    marginTop: 15,
    marginBottom: 50,
    padding: 15,
    borderRadius: 7,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
});
