
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableHighlight } from "react-native";

function BadgerLoginScreen(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text style={{ fontSize: 16, marginTop: 40 }}>Username</Text>
        <TextInput
            style={styles.input}
            onChangeText={setUserName}
            value={userName}
            placeholder='Username'
        />
        <Text style={{ fontSize: 16, marginTop: 10 }}>Password</Text>
        <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder='Password'
            secureTextEntry={true}
        />
        <TouchableHighlight
                style={styles.loginButton}
                onPress={() => {
                    if(userName.length === 0) {
                        Alert.alert("Unable to Login", "Please provide a valid username.");
                    }
                    else if(password.length === 0) {
                        Alert.alert("Unable to Login", "Please provide a valid password.");
                    }
                    else {
                        props.handleLogin(userName, password);
                    }
                }}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold'}}>New Here?</Text>
        <View style={styles.buttonsContainer}>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#DDDDDD"
                onPress={() => props.setIsRegistering(true)}
            >
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#DDDDDD"
                onPress={() => props.setIsBrowsing(true)}
            >
                <Text style={styles.buttonText}>Continue as Guest</Text>
            </TouchableHighlight>
      </View>
        
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        height: 40,
        width: 150,
        margin: 5,
        borderWidth: 1,  // Add border width
        borderColor: 'grey',  // Add border color
        borderRadius: 5,  // Optional: Add border radius for rounded corners
        padding: 10,
        backgroundColor: 'grey',
    },
    loginButton: {
        height: 40,
        width: 150,
        margin: 5,
        borderWidth: 1,  // Add border width
        borderColor: 'crimson',  // Add border color
        borderRadius: 5,  // Optional: Add border radius for rounded corners
        padding: 10,
        backgroundColor: 'crimson',
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 0,
        backgroundColor: 'white',
        alignItems: 'center',
    },
});

export default BadgerLoginScreen;