import React, {useEffect, useState} from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Pressable,
    OpaqueColorValue,
    useWindowDimensions,
} from 'react-native';

import CodePush, {DownloadProgress, LocalPackage} from 'react-native-code-push';
import ModalUpdate from './ModalUpdate';
import {Colors} from './colors';

const App: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [progress, setProgress] = useState<DownloadProgress | undefined>();
    const [progressB, setProgressB] = useState<boolean>(false);
    const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null);

    const {width} = useWindowDimensions();

    useEffect(() => {
        async function load() {
            const localPackages = await CodePush.getUpdateMetadata();
            setLocalPackage(localPackages);
        }

        load();
    }, []);

    function codePushStatusDidChange(syncStatus: CodePush.SyncStatus) {
        setMessage(getMessageState(syncStatus));
    }

    function executeAfter() {
        setProgress(undefined);
        setTimeout(() => {
            setProgressB(false);
        }, 3000);
    }

    function getMessageState(syncStatus: CodePush.SyncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                return 'Verificando atualizações.';
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                return 'Baixando atualizações.';
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                return 'Aguardando ação do usuário.';
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                return 'Instalando atualização.';
            case CodePush.SyncStatus.UP_TO_DATE:
                executeAfter();
                return 'Nenhuma atualização encontrada.';
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                executeAfter();
                return 'Atualização instalada e será aplicada ao reiniciar.';
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                executeAfter();
                return 'Oppps, ocorreu um erro desconhecido.';
        }
        return '';
    }

    function codePushDownloadDidProgress(downloadProgress: DownloadProgress) {
        setProgress(downloadProgress);
    }

    function sync(immediate?: boolean) {
        setProgressB(true);
        CodePush.sync(
            {
                installMode: immediate
                    ? CodePush.InstallMode.IMMEDIATE
                    : undefined,
            },
            codePushStatusDidChange,
            codePushDownloadDidProgress,
        );
    }

    return (
        <>
            <View style={[styles.container, styles.contered]}>
                <StatusBar backgroundColor={Colors.primary} />
                <Pressable
                    style={[styles.button, styles.contered]}
                    onPress={() => sync(false)}
                    android_ripple={{
                        color: OpaqueColorValue,
                        radius: width,
                    }}>
                    <Text style={styles.textButton}>Atualizar</Text>
                </Pressable>
                {/* {localPackage && <Text>{localPackage.packageHash}</Text>} */}
            </View>
            <ModalUpdate
                message={message}
                show={progressB}
                progress={progress}
            />
        </>
    );
};

const styles = StyleSheet.create({
    contered: {
        justifyContent: 'center',
        alignContent: 'center',
    },
    container: {
        flex: 1,
    },
    button: {
        borderRadius: 8,
        padding: 8,
        backgroundColor: Colors.primary,
        height: 46,
        margin: 8,
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
    },
});

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

export default CodePush(codePushOptions)(App);
