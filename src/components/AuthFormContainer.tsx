import CircleUI from '@ui/CircleUI';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, Image, Text, Dimensions} from 'react-native'
import { CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';


interface Props {
    children: ReactNode
    heading?: string
    subHeading?: string
}

const AuthFormContainer: FC<Props> = ({heading, subHeading, children}) => {

    return <View style={styles.container}>
        <CircleUI size={300} position='top-left'/>
        <CircleUI size={200} position='top-right'/>
        <CircleUI size={200} position='bottom-left'/>
        <CircleUI size={300} position='bottom-right'/>

        <View style={styles.headerContainer}>
            <Image style={styles.image} source={require('../assets/logo.png')} />
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subHeading}>
                {subHeading}
            </Text>
        </View>
        {children}
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    image: {
        width: Dimensions.get('window').width*0.4,
        height: Dimensions.get('window').width*0.4,
        alignSelf: 'center',
        marginBottom: 25
    },
    heading: {
        color: SECONDARY,
        fontSize: 25,
        fontWeight: 'bold',
        paddingVertical: 5
    },
    subHeading: {color: CONTRAST, fontSize: 16},
    headerContainer: {
        width: '100%',
        marginBottom:20,
        paddingHorizontal: 16,
    }
});

export default AuthFormContainer;