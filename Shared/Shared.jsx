import { doc,getDoc,setDoc, updateDoc } from "firebase/firestore";
import {db} from './../config/FirebaseConfig';

const getFavList= async (user)=>{
const snapshot =await getDoc(doc(db,'Favorites',user?.primaryEmailAddress?.emailAddress))
if(snapshot?.exists()){
    return snapshot.data();
}else{
    await setDoc(doc(db,'Favorites',user?.primaryEmailAddress?.emailAddress),{
        email:user?.primaryEmailAddress?.emailAddress,
        favorites:[]
    })
}
}
const updateFavorite = async (user,favorites)=>{
    const docRef =doc(db,'Favorites',user?.primaryEmailAddress?.emailAddress);
    try {
        await updateDoc(docRef,{favorites:favorites})
    } catch (error) {
        
    }
}
export default {getFavList,updateFavorite}