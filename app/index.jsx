// import { View } from "react-native";
// import { Redirect, useRootNavigationState } from "expo-router";
// import { useUser } from "@clerk/clerk-expo";
// import { useEffect } from "react";
// export default function Index() {
//   const { user, isLoaded } = useUser();
//   const rootNavigationState = useRootNavigationState();

//   useEffect(() => {
//     checkNavigationLoaded();
//   }, [rootNavigationState]);

//   const checkNavigationLoaded = () => {
//     if (!rootNavigationState.key) {
//       return null;
//     }
//   };

//   // If user data is not loaded yet, return null or show a loading indicator

//   if (user) {
//   // User object exists
//   console.log("User exists:", user);
// } else {
//   // User object is null or undefined
//   console.log("User does not exist");
// }
//   return (
//     <View
//       style={{
//         flex: 1,
//       }}
//     >
//       {user ? <Redirect href={"/(tabs)/home"} /> : <Redirect href={"/login"} />}
//     </View>
//   );
// }
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export default function Index() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        setShouldRedirect(true);
      } else {
        setShouldRedirect(true);
      }
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (shouldRedirect) {
    return isSignedIn && user ? (
      <Redirect href={'/(tabs)/home'} />
    ) : (
      <Redirect href={'/login'} />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Checking Authentication...</Text>
    </View>
  );
}

