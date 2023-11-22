import { StyleSheet, Text, View, ScrollView, Button, Modal, Pressable, TextInput, Alert } from "react-native";
import { useEffect, useState } from 'react';

import BadgerChatMessage from "../helper/BadgerChatMessage";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [pageNumber, setActivePage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    useEffect(() => {
        if(!isCreatingPost) {
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${pageNumber}`, {
            headers: {
                "X-CS571-ID": 'bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384',
            },
            })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages)
            })
        }
    }, [props, pageNumber, isCreatingPost, isDeletingPost])

    // Clears Modal Input for Future Posts
    function clearInput() {
        setTitle('');
        setBody('');
    }

    function handlePostDelete() {
        setIsDeletingPost(!isDeletingPost);
    }

    function handlePost() {
        setIsCreatingPost(true);
        SecureStore.getItemAsync('token').then(token => {
            //console.log(token)
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    content: body,
                }),
            })
            .then(res => {
                if(res.status === 400) {
                    Alert.alert('Unable to Create Post', 'Incorrect data provided.');
                    throw new Error('Unable to Create Post');
                }
                if(res.status === 401) {
                    Alert.alert('Unable to Create Post', 'You must be logged in to do that!');
                    throw new Error('Unable to Create Post');
                }
                if(res.status === 404) {
                    Alert.alert('Unable to Create Post', 'Classroom Not Found.');
                    throw new Error('Unable to Create Post');
                }
                if(res.status === 413) {
                    Alert.alert('Unable to Create Post', "'Title' must be 128 characters or fewer and 'Content' must be 1024 characters or fewer");
                    throw new Error('Unable to Create Post');
                }

                Alert.alert("Successfully Posted!", "Message successfully posted to chatroom.");
                return res.json(); // This line ensures the response JSON is returned for the next `then` block
            })
            .catch((error) => {
                if (error.message !== 'Unable to Create Post') {
                    Alert.alert('Error Creating Post', error.message);
                }
            })
            .finally(() => {
                setIsCreatingPost(false);
            });
        })
        clearInput();
        setActivePage(1);
    }

    return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            {
                messages.map(message => {
                    return <BadgerChatMessage
                        key={message.id}
                        activeUser={props.activeUser}
                        handlePostDelete={handlePostDelete}
                        {...message}
                    />
                })
            }
        </ScrollView>

        <View style={styles.textContainer}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }} >Page {pageNumber} of 4</Text>
        </View>

        <View style={styles.buttonsContainer}>
            <Button 
                title="Previous"
                disabled={pageNumber === 1}
                onPress={() => setActivePage(pageNumber - 1)}
                style={{ flex: 1 }}
            />
            <Button 
                title="Next    "
                disabled={pageNumber === 4}
                onPress={() => setActivePage(pageNumber + 1)}
                style={{ flex: 1 }}
            />
        </View>

        <View style={styles.createPostContainer}>
            <Modal
                animationType="fade"
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create a Post</Text>
                        <Text style={{ fontSize: 18, marginTop: 10 }}>Title</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTitle}
                            value={title}
                            placeholder='Your Title'
                            placeholderTextColor="gray"
                        />
                        <Text style={{ fontSize: 18, marginTop: 10 }}>Body</Text>
                        <TextInput
                            style={[styles.input, styles.bodyInput]}
                            onChangeText={setBody}
                            value={body}
                            multiline
                            placeholder='Begin typing here...'
                            placeholderTextColor="gray"
                        />
                        <View style={styles.buttonsContainer}>
                            <Button
                                title="CREATE POST"
                                disabled={title.length === 0 || body.length === 0}
                                onPress={() => {
                                    if(title.length > 128 || body.length > 1024) {
                                        Alert.alert('Unable to Create Post', "'Title' must be 128 characters or fewer and 'Content' must be 1024 characters or fewer");
                                    }
                                    else {
                                        setModalVisible(!modalVisible);
                                        handlePost();
                                    }
                                }}
                            />
                            <Button
                                title="CANCEL"
                                onPress={() => {
                                    clearInput();
                                    setModalVisible(!modalVisible);
                                }}
                            />
                        </View>
                        
                    </View>
                </View>
            </Modal>
    <Button
        //style={[styles.button, styles.buttonOpen]}
        color="crimson"
        onPress={() => setModalVisible(true)}
        title="CREATE POST"
    />
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        padding: 10,
        backgroundColor: "white",
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 0,
        backgroundColor: "white",
        alignItems: 'center',
    },
    createPostContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
        backgroundColor: "white",
        alignItems: 'center',
    },
    // Imported modal styling from https://reactnative.dev/docs/modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 25,
        marginBottom: 15,
        textAlign: 'right',
    },
    input: {
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    bodyInput: {
        height: 100,
    },
});

export default BadgerChatroomScreen;