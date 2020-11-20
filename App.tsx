import React, {useEffect} from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import codePush from 'react-native-code-push';

const App: React.FC = () => {
    useEffect(() => {
        async function checkVersions() {
            const remote = await codePush.checkForUpdate();
            const currentMetada = await codePush.getUpdateMetadata();

            console.log(remote);
            console.log(currentMetada);
        }
        checkVersions();
    }, []);
    async function onButtonPress() {
        try {
            await codePush.sync({
                updateDialog: {title: 'Update'},
                installMode: codePush.InstallMode.IMMEDIATE,
            });
        } catch (error) {
            console.warn(error);
        }
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={style.full}>
                <View>
                    <Text style={style.text}>
                        João Henrique da Silva Maciel
                    </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={onButtonPress}>
                        <Text style={style.btn}>Check Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const style = StyleSheet.create({
    text: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 5,
    },
    btn: {
        backgroundColor: 'blue',
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
    },
    full: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
export default codePush({checkFrequency: codePush.CheckFrequency.MANUAL})(App);
