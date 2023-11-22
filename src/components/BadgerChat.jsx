import { useEffect, useState } from 'react';
import { Alert } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [isRegistering, setIsRegistering] = useState(false);
	const [isBrowsing, setIsBrowsing] = useState(false);
  	const [chatrooms, setChatrooms] = useState([]);
	const [activeUser, setActiveUser] = useState('');


	useEffect(() => {
		fetch('https://cs571.org/api/f23/hw6/chatrooms', {
			headers: {
				"X-CS571-ID": 'bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384',
				//"Authorization": `Bearer ${token}`,
			}
		})
		.then(res => res.json())
		.then(json => {
			setChatrooms(json)
		})
	}, []);

  function handleLogin(username, password) {
    fetch('https://cs571.org/api/f23/hw9/login', {
		method: "POST",
		headers: {
			"X-CS571-ID": 'bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384',
			"Content-Type": "application/json"
      	},
      	body: JSON.stringify({
        	username: username,
        	password: password
      	})
    	})
		.then(res => {
			if(res.status === 401) {
				Alert.alert('Incorrect Login', 'Incorrect username or password.');
				throw new Error('Incorrect Login');
			}
			if(res.status === 400) {
				Alert.alert('Incorrect Login', 'Username or password not provided.');
				throw new Error('Missing Credentials');
			}
			//console.log('Successful Login');
			setIsLoggedIn(true);
			setActiveUser(username);
			return res.json();
		})
		.then(data => {
			SecureStore.setItemAsync('token', data.token)
			.then(() => {
				//console.log('Token stored successfully');
			})
			.catch((error) => {
				console.error('Error storing token', error);
			});
		})
		.catch((error) => {
			if (error.message !== 'Incorrect Login' && error.message !== 'Missing Credentials') {
				Alert.alert('Error Logging In', error.message);
			}
		});
	}
	
	/*SecureStore.getItemAsync('token').then(result => {
		if(result) {
			console.log(result);
		}
		else {
			console.log("No Value Present");
		}
	});*/

  function handleSignup(username, password) {
    fetch('https://cs571.org/api/f23/hw9/register', {
		method: "POST",
		headers: {
			"X-CS571-ID": 'bid_b12898bda46ac66e7703c0762de9def4c784a66f024e5b5de19d6da1de871384',
			"Content-Type": "application/json"
      	},
      	body: JSON.stringify({
        	username: username,
        	password: password
      	})
    	})
		.then(res => {
			if(res.status === 400) {
				Alert.alert('Unable to Register', 'Username or password not provided.');
				throw new Error('Unable to Register');
			}
			if(res.status === 409) {
				Alert.alert('Unable to Register', 'User already exists!');
				throw new Error('Unable to Register');
			}
			else if(res.status === 413) {
				Alert.alert('Unable to Register', "'Username' must be 64 characters or fewer and 'Password' must be 128 characters or fewer.")
				throw new Error('Incorrect Credentials');
			}
			//console.log('Successful Login');
			setActiveUser(username);
			setIsLoggedIn(true);
			return res.json();
		})
		.then(data => {
			SecureStore.setItemAsync('token', data.token)
			.then(() => {
				//console.log('Token stored successfully');
			})
			.catch((error) => {
				console.error('Error storing token', error);
			});
		})
		.catch((error) => {
			if (error.message !== 'Unable to Register' && error.message !== 'Incorrect Credentials') {
				Alert.alert('Error Logging In', error.message);
			}
		});
	}

	//console.log(activeUser);

  if (isLoggedIn || isBrowsing) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
			<ChatDrawer.Screen name="Landing">
            	{(props) => <BadgerLandingScreen {...props} activeUser={activeUser} setActiveUser={setActiveUser} />}
          	</ChatDrawer.Screen>
          	{
			  	chatrooms.map((chatroom) => (
					<ChatDrawer.Screen key={chatroom} name={chatroom}>
						{(props) => <BadgerChatroomScreen {...props} name={chatroom} activeUser={activeUser} setActiveUser={setActiveUser} />}
					</ChatDrawer.Screen>
          	))}
			<ChatDrawer.Screen name="Logout">
            	{(props) => <BadgerLogoutScreen {...props} activeUser={activeUser} setActiveUser={setActiveUser} setIsBrowsing={setIsBrowsing} setIsLoggedIn={setIsLoggedIn} setIsRegistering={setIsRegistering} isLoggedIn={isLoggedIn}/>}
          	</ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsLoggedIn={setIsLoggedIn} setIsBrowsing={setIsBrowsing}/>
  }
}