import React from "react";
import { Button, StatusBar, Text, Image, TextInput, TouchableOpacity, View, Modal } from 'react-native';

// shows the users email in the top right corner
const AccountInfo = (props: { email: string }) => {
    return(
        <View>
            <Text>{props.email}</Text>
            <Image
                source={require('../resources/account.png')}
                resizeMode="contain"
                style={{ width: 25 }}
            />
        </View>
    );
}

export default AccountInfo;