import { Alert, Text, Button } from "react-native";
import BadgerCard from "./BadgerCard"
import * as SecureStore from 'expo-secure-store';

function BadgerChatMessage(props) {

    const dt = new Date(props.created);

    function handleDelete(id) {
        SecureStore.getItemAsync('token').then(token => {
            fetch(`https://cs571.org/api/f23/hw9/messages?id=${id}`, {
                method: "DELETE",
                headers: {
                    "X-CS571-ID": "bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384",
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then(res => {
                if(res.status === 401) {
                    Alert.alert('Unable to Delete Post', 'Not an authenticated user.');
                    throw new Error('Unable to Delete Post');
                }
                if(res.status === 404) {
                    Alert.alert('Unable to Delete Post', 'Message not found');
                    throw new Error('Unable to Delete Post');
                }
                Alert.alert("Alert", "Successfully deleted the post.");
                props.handlePostDelete();
                return res.json();
            })
            .catch((error) => {
                if (error.message !== 'Unable to Delete Post') {
                    Alert.alert('Error Deleting Post', error.message);
                }
            });
        })
        //props.setIsChangingPosts(true);
    }

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {
            props.poster === props.activeUser ? <Button title="Delete" onPress={() => handleDelete(props.id)}/> : <></>
        }
    </BadgerCard>
}

export default BadgerChatMessage;