import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'

export default function PetAbout({ pet }) {
    const [readMore, setReadMore] = useState(true)
    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>About {pet?.name}</Text>
            <Text numberOfLines={readMore ? 3 : 200} style={{ fontFamily: 'outfit', fontSize: 16, color: Colors.GRAY }}>
                {pet?.about}
            </Text>
            {pet?.about?.length > 10 && (
                <Pressable onPress={() => setReadMore(!readMore)}>
                    <Text
                        style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 14,
                            color: Colors.SECONDARY,
                        }}
                    >
                        {readMore ? 'Read More' : 'Read Less'}
                    </Text>
                </Pressable>
            )}
        </View>

    )
}