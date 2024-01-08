
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CONTRAST, PRIMARY } from '@utils/colors';
import {FC} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native'

interface Props {
    title: string
}

const AppHeader: FC<Props> = ({title}) => {
    const {goBack, canGoBack} = useNavigation()

    if(!canGoBack) return null
    
    return <View style={styles.container}>
        <Pressable onPress={goBack}>
            <AntDesign name='arrowleft' size={24} color={CONTRAST} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: PRIMARY,
        height: 45
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: CONTRAST,
        paddingVertical: 10,
    },
});

export default AppHeader;