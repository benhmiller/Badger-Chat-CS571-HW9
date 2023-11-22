import { Alert, Button, StyleSheet, Text, View } from "react-native";

import * as SecureStore from 'expo-secure-store';

function BadgerLogoutScreen(props) {
    function handleLogout() {
        SecureStore.deleteItemAsync('token').then(() => {
            props.setActiveUser('');
            props.setIsLoggedIn(false);
            props.setIsRegistering(false);
        });
    }
    if (props.isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
                <Text>Come back soon!</Text>
                <Text/>
                <Button
                    title="Logout"
                    color="darkred"
                    onPress={() => {
                        handleLogout();
                        Alert.alert("Successfully Logged Out", "Please visit again soon.");
                    }}    
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 24, marginTop: -100}}>Ready to signup?</Text>
                <Text>Join BadgerChat to be able to make posts!</Text>
                <Text/>
                <Button
                    title="SIGNUP!"
                    color="darkred"
                    onPress={() => {
                        props.setIsBrowsing(false);
                        props.setIsRegistering(true);
                    }}    
                />
            </View>
            

        );
    }
    
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
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default BadgerLogoutScreen;