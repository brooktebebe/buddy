// import { View, Image, Text, Dimensions, FlatList } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { getDocs, collection } from 'firebase/firestore'
// import { db } from './../../config/FirebaseConfig'
// import { StyleSheet } from 'react-native';
// export default function Slider() {
//     const [sliders, setSliders] = useState([]);
//     useEffect(() => {
//         getSliders()
//     }, [])
//     const getSliders = async () => {
//         setSliders([]);
//         const snapShot = await getDocs(collection(db, 'Slider'));
//         snapShot.forEach((doc) => {
//             console.log("files-==== " + doc.data());
//             setSliders(sliders => [...sliders, doc.data()])
//         })
//     }
//     return (
//         <View style={{marginTop:15}}>
//             <FlatList
//                 data={sliders}
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({item, index}) => (
//                     <View >
//                         <Image source={{ uri: item?.imageUrl }}
//                             style={styles.sliderImage}
//                         />
//                     </View>
//                 )}
//             />
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     sliderImage: {
//         width: Dimensions.get('screen').width * 0.9,
//         height: 170,
//         borderRadius:15,
//         marginRight:15
//     }
// })
import { View, Image, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import { StyleSheet } from 'react-native';

export default function Slider() {
  const [sliders, setSliders] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getSliders();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;

          if (nextIndex === sliders.length) {
            // Smoothly animate to the end, then immediately jump to the start without animation
            flatListRef.current.scrollToIndex({ animated: true, index: prevIndex });
            setTimeout(() => {
              flatListRef.current.scrollToIndex({ animated: false, index: 0 });
            }, 500); // Adjust delay for a smoother transition
            nextIndex = 0;
          } else {
            flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
          }

          return nextIndex;
        });
      }, 5000); // Scroll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [sliders]);

  const getSliders = async () => {
    const snapShot = await getDocs(collection(db, 'Slider'));
    const sliderData = [];
    snapShot.forEach((doc) => {
      sliderData.push(doc.data());
    });
    setSliders(sliderData);
  };

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        ref={flatListRef}
        data={sliders}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        onScrollToIndexFailed={(info) => {
          // In case scrollToIndex fails (e.g., the list isn't rendered yet)
          setTimeout(() => {
            flatListRef.current.scrollToIndex({ index: info.index, animated: false });
          }, 500);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get('screen').width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
  },
});
