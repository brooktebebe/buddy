import { View, Text, Image, Dimensions } from 'react-native'
import { Link } from 'expo-router';
import React from 'react'
import Colors from './../../constants/Colors';

export default function UserItem({ userInfo }) {
    console.log("this is user");

    console.log(userInfo);

    return (
        <Link href={'/chat?id=' + userInfo?.item?.docId}>
            <View style={{
                width: Dimensions.get('screen').width
            }}>
                <View style={{ marginVertical: 7, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image source={{ uri: userInfo?.item?.imageUrl }} style={{ width: 40, height: 40, borderRadius: 99 }} />
                    <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>{userInfo?.item?.name ?? 'No Name Available'}</Text>
                </View>
                <View style={{ borderWidth: 0.2, marginVertical: 5, borderColor: Colors.GRAY }}></View>
            </View>
        </Link>
    )
}