import { useState } from 'react';
import { TextInput, Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerRegisterScreen(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
        <Text style={{ fontSize: 16, marginTop: 10 }}>Confirm Password</Text>
        <TextInput
            style={styles.input}
            onChangeText={setPasswordConfirmation}
            value={passwordConfirmation}
            placeholder='Password'
            secureTextEntry={true}
        />

        {
            userName.length !== 0 && password.length === 0 ?
                <Text style={{ color: "crimson" }}>Please enter a password.</Text>
            :
            password !== passwordConfirmation && <Text style={{ color: "crimson" }}>Passwords do not match.</Text>
        }
        
        <Button
            color="crimson"
            title="Signup"
            disabled={password.length === 0 || password !== passwordConfirmation}
            onPress={() => {
                if(userName.length > 64 || password.length > 128) {
                    Alert.alert("Unable to Register", "'Username' must be 64 characters or fewer and 'Password' must be 128 characters or fewer.");
                }
                else {
                    props.handleSignup(userName, password);
                }
            }}
        />
        <Button
            color="grey"
            title="Nevermind!"
            onPress={() => props.setIsRegistering(false)}
        />
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
});

export default BadgerRegisterScreen;