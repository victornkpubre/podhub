
import BasicModalContainer from '@ui/BasicModalContainer';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, ScrollView, Pressable, Text} from 'react-native'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { PRIMARY } from '@utils/colors';
import { Playlist } from '@src/@types/audio';


interface ListItemProps {
    title: string;
    icon: ReactNode
    onPress?(): void
}
const ListItem: FC<ListItemProps> = ({title, icon, onPress}) => {
    return (
        <Pressable onPress={onPress} style={styles.listItemContainer}>
            <View style={{justifyContent: 'center'}}>
                {icon}
            </View>
            <Text style={styles.listItemTitle}>
                {title}
            </Text>
        </Pressable>
    )
}

interface Props<T> {
    visible: boolean
    onRequestClose(): void
    list: Playlist[]
    onCreateNewPress(): void
    onPlaylistPress(item: Playlist): void
}

const PlaylistModal = <T extends any>({visible, onRequestClose, onCreateNewPress, onPlaylistPress, list}: Props<T>) => {
    return (
        <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
            <ScrollView>
            {list.map((item) => {
                return (
                    <ListItem
                        onPress={() => onPlaylistPress(item)}
                        key={item.id}
                        title={item.title}
                        icon={
                            <FontAwesome
                                name= {item.visibility==='public'? 'lock': 'globe'}
                                size={16}
                                color={PRIMARY}
                            />
                        }
                    />
                )
            })}
                
            </ScrollView>
            <ListItem
                title='Create New'
                onPress={onCreateNewPress}
                icon={
                    <AntDesign 
                        name='plus'
                        size={16}
                        color={PRIMARY}    
                    />
                }
            />
        </BasicModalContainer>
    )
};

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingVertical: 8
    },
    listItemTitle: {
        fontSize: 16,
        color: PRIMARY,
        marginLeft: 10
    }
});

export default PlaylistModal;