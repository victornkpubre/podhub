import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { HistoryAudio } from '@src/@types/audio';
import { getClient } from '@src/api/client';
import { fetchHistory, useFetchHistory } from '@src/api/query';
import AudioListLoader from '@ui/AudioListLoader';
import EmptyRecords from '@ui/EmptyRecords';
import { CONTRAST, INACTIVE_CONTRAST, OVERLAY, SECONDARY } from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Pressable, RefreshControl} from 'react-native'
import { useMutation, useQueryClient } from 'react-query';
import {History} from '@src/@types/audio'
import PaginatedList from '@ui/PaginatedList';

interface Props {}

let pageNo = 0;

const HistoryTab: FC<Props> = props => {
    const {data, isLoading, isFetching} = useFetchHistory()
    const queryClient = useQueryClient()
    const [selectedHistories, setSelectedHistories] = useState<string[]>([])
    const navigation = useNavigation()
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const removeMutate = useMutation({
        mutationFn: async (histories) => removeHistories(histories),
        onMutate: (histories: string[]) => {
            queryClient.setQueryData<History[]>(['histories'], (oldData) => {
                let newData: History[] = []
                if(!oldData) return newData

                for(let data of oldData) {
                    const filteredData = data.audios.filter((item) => {
                        !histories.includes(item.id)
                    })

                    if(filteredData.length) {
                        newData.push({date: data.date, audios: filteredData})
                    }
                }
            })
        }
    })

    const removeHistories = async (histories: string[]) => {
        const client = await getClient()
        await client.delete('/history?histories='+JSON.stringify(histories))
        queryClient.invalidateQueries({queryKey: ['histories']})
    }

    const handleSingleHistoryRemove = async (history: HistoryAudio) => {
        removeMutate.mutate([history.id])
    }

    const handleMultipleHistoryRemove = async () => {
        setSelectedHistories([])
        removeMutate.mutate([...selectedHistories])
    }

    const handleOnLongPress = async(history: HistoryAudio) => {
        setSelectedHistories([history.id])
    }

    const handleOnRefresh = () => {
        queryClient.invalidateQueries({queryKey: ['histories']})
    }

    const handleOnPress = async(history: HistoryAudio) => {
        setSelectedHistories((old) => {
            if(old.includes(history.id)) {
                return old.filter((item) => item !== history.id)
            }
            return [...old, history.id]
        })
    }

    const handleOnEndReached = async () => {
        if (!data || !hasMore || isFetchingMore) return;
    
        setIsFetchingMore(true);
        pageNo += 1;
        const res = await fetchHistory(pageNo);
        if (!res || !res.length) {
          setHasMore(false);
        }
        const newData = [...data, ...res];
        const finalData: History[] = [];
    
        const mergedData = newData.reduce((accumulator, current) => {
          const foundObj = accumulator.find(item => item.date === current.date);
    
          if (foundObj) {
            foundObj.audios = foundObj.audios.concat(current.audios);
          } else {
            accumulator.push(current);
          }
    
          return accumulator;
        }, finalData);
    
        queryClient.setQueryData(['histories'], mergedData);
        setIsFetchingMore(false);
      };



    useEffect(() => {
        const unselectHistories = () => {
            setSelectedHistories([])
        }
        navigation.addListener('blur', unselectHistories)

        return () => {
            navigation.removeListener('blur', unselectHistories)
        }
    }, [])


    if(isLoading) return <AudioListLoader />

    return (<>
        {selectedHistories.length? (
            <Pressable onPress={handleMultipleHistoryRemove} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}> Remove</Text>
            </Pressable>
        ): null}


        <PaginatedList
            data={data}
            renderItem={({item}) => {
            return (
                <View key={item.date}>
                <Text style={styles.date}>{item.date}</Text>
                <View style={styles.listContainer}>
                    {item.audios.map((audio, index) => {
                    return (
                        <Pressable
                        onLongPress={() => handleOnLongPress(audio)}
                        onPress={() => handleOnPress(audio)}
                        key={audio.id + index}
                        style={[
                            styles.history,
                            {
                            backgroundColor: selectedHistories.includes(audio.id)
                                ? INACTIVE_CONTRAST
                                : OVERLAY,
                            },
                        ]}>
                        <Text style={styles.historyTitle}>{audio.title}</Text>
                        <Pressable
                            onPress={() => handleSingleHistoryRemove(audio)}>
                            <AntDesign name="close" color={CONTRAST} />
                        </Pressable>
                        </Pressable>
                    );
                    })}
                </View>
                </View>
            );
            }}
            onEndReached={handleOnEndReached}
            ListEmptyComponent={<EmptyRecords title="There is no history!" />}
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            isFetching={isFetchingMore}
            hasMore={hasMore}
        />

    </>)
};

const styles = StyleSheet.create({
    container: {},
    listContainer: {
        marginTop: 10,
        paddingLeft: 10
    },
    removeBtnText: {
        color: CONTRAST
    },
    removeBtn: {
        padding: 10,
        alignSelf: 'flex-end'
    },
    date: {
        color: SECONDARY
    },
    historyTitle: {
        color: CONTRAST,
        paddingHorizontal: 5,
        fontWeight: '700',
        flex: 1
    },
    history: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: OVERLAY,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    }
});

export default HistoryTab;