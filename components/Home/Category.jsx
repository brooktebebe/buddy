import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from './../../config/FirebaseConfig'
import { FlatList } from 'react-native'
import { StyleSheet } from 'react-native'
import Colors from "./../../constants/Colors"
export default function Category({category}) {
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('dogs')
    useEffect(() => {
        getCategories()
    }, [])
    const getCategories = async () => {
        setCategories([])
        const snapShot = await getDocs(collection(db, 'Categories'));
        snapShot.forEach((category) => {
            setCategories(categories => [...categories, category.data()])
        })
    }
    return (
        <View style={{
            marginTop: 20
        }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 20
            }}>Category</Text>


            <FlatList
                data={categories}
                numColumns={4}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => {
                        setSelectedCategory(item?.name);
                        category(item?.name)
                    }}>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.container]}>
                                <Image source={{ uri: item?.imageUrl }}
                                    style={{ width: 80, height: 60, borderRadius: 5 }}
                                />
                            </View>
                            <Text style={styles.categoryText}></Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 5
    },
    categoryText: {
        display: 'none',
        textAlign: 'center', fontFamily: 'outfit'
    },

})