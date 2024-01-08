
import { Entypo } from '@expo/vector-icons';
import { CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image} from 'react-native'

interface Props {
    source?: string
}

const avatarSize = 70

const AvatarField: FC<Props> = ({source}) => {
    return <View>
        {source? 
            <Image source={{uri: source}} style={styles.avatarImage} />:
            <View style={styles.avatarImage}>
                <Entypo name='mic' size={30} color={PRIMARY} />
            </View>
        }
    </View>
};

const styles = StyleSheet.create({
    avatarImage: {
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize/2,
        backgroundColor: SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderStartWidth: 4,
        borderColor: CONTRAST,
        borderWidth: 4
    }
});

export default AvatarField;