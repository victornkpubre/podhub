
import BasicModalContainer from '@ui/BasicModalContainer';
import { PRIMARY, SECONDARY } from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Pressable, Text} from 'react-native'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'

export interface PlaylistInfo {
    title: string
    private: boolean
}

interface Props {
    visible: boolean
    initialValue?: PlaylistInfo;
    onRequestClose(): void
    onSubmit(value: PlaylistInfo): void
}



const PlaylistForm: FC<Props> = ({visible, initialValue, onSubmit, onRequestClose}) => {
    const [playlistInfo, setPlaylistInfo] = useState({
        title: '',
        private: false
    })

    const handleSubmit = () => {
        onSubmit(playlistInfo)
        setPlaylistInfo({title: '', private: false})
        onRequestClose()
    }

    const handleClose = () => {
        setPlaylistInfo({title: '', private: false})
        onRequestClose()
    }

    useEffect(() => {
        if (initialValue) {
          setPlaylistInfo({...initialValue});
        }
      }, [initialValue]);

    return (
        <BasicModalContainer visible={visible} onRequestClose={handleClose}>
            <View>
                <Text style={styles.title} >Create New Playlist</Text>
                <TextInput 
                    placeholder='Title' 
                    style={styles.input}
                    value={playlistInfo.title}
                    onChangeText={(text) => {
                        setPlaylistInfo({...playlistInfo, title: text})
                    }}
                />
                <Pressable 
                    onPress={() => setPlaylistInfo({...playlistInfo, private: !playlistInfo.private})}
                    style={styles.privateSelector}>
                    {playlistInfo.private?
                        <MaterialIcon name='radiobox-marked' color={PRIMARY}/>:
                        <MaterialIcon name='radiobox-blank' color={PRIMARY}/>
                    }
                    <Text style={styles.privatelabel} >Private</Text>
                </Pressable>

                <Pressable 
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                >
                    <Text>{initialValue? 'Update' : 'Create'}</Text>
                </Pressable>
            </View>
        </BasicModalContainer>
    )
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: PRIMARY,
        fontWeight: '700'
    },
    input: {
        height: 45,
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: PRIMARY,
        color: PRIMARY
    },
    privateSelector: {
        height: 45,
        alignItems: 'center',
        flexDirection: 'row'
    },
    privatelabel: {
        color: PRIMARY,
        marginLeft: 5
    },      
    submitBtn: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: PRIMARY,
        borderRadius: 7
    }
});

export default PlaylistForm;