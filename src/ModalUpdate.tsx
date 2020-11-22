import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    useWindowDimensions,
    StatusBar,
} from 'react-native';
import Lottie from 'lottie-react-native';
import rocket from './assets/rocket-launch.json';
import packa from './assets/package-delivery.json';
import {DownloadProgress} from 'react-native-code-push';
import {Colors} from './colors';

interface ModalUpdateProps {
    message: string;
    show: boolean;
    progress?: DownloadProgress;
}

function formatToKByte(qtdBytes: number) {
    return (qtdBytes / 1000).toFixed(1).replace('.', ',');
}

const ModalUpdate: React.FC<ModalUpdateProps> = ({message, show, progress}) => {
    const {height} = useWindowDimensions();
    const [state] = useState({
        opacity: new Animated.Value(0),
        container: new Animated.Value(height),
        modal: new Animated.Value(height),
    });

    const openModal = useCallback(() => {
        Animated.sequence([
            Animated.timing(state.container, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(state.opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(state.modal, {
                toValue: 0,
                bounciness: 5,
                useNativeDriver: true,
            })!,
        ]).start();
    }, [state]);

    const closeModal = useCallback(() => {
        Animated.sequence([
            Animated.timing(state.modal, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(state.opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(state.container, {
                toValue: height,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [state, height]);

    useEffect(() => {
        if (show) {
            openModal();
        } else {
            closeModal();
        }
    }, [show, closeModal, openModal]);

    return (
        <>
            {show && <StatusBar backgroundColor={Colors.backgroundOpacity} />}
            <Animated.View
                style={[
                    style.container,
                    {
                        opacity: state.opacity,
                        transform: [{translateY: state.container}],
                    },
                ]}>
                <Animated.View
                    style={[
                        style.card,
                        {transform: [{translateY: state.modal}]},
                    ]}>
                    <View style={style.indicator} />
                    <View style={style.centered}>
                        <Lottie
                            source={rocket}
                            autoPlay
                            loop
                            style={style.w150}
                        />
                        <Text style={style.message}>{message}</Text>
                        {progress && (
                            <Text style={style.message}>
                                <Text style={style.strong}>
                                    {formatToKByte(progress.receivedBytes)}
                                </Text>
                                {'/'}
                                <Text style={style.strong}>
                                    {formatToKByte(progress.totalBytes)} kb's
                                </Text>
                                recebidos.
                            </Text>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        zIndex: 999,
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundOpacity,
        justifyContent: 'flex-end',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    card: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        height: 300,
        justifyContent: undefined,
    },
    w150: {
        width: 150,
    },
    message: {
        marginTop: 8,
        fontSize: 16,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    strong: {
        fontWeight: 'bold',
    },
    indicator: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 15,
    },
});

export default ModalUpdate;
