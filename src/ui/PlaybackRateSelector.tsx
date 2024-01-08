
import { FontAwesome5 } from '@expo/vector-icons';
import { CONTRAST, OVERLAY, SECONDARY } from '@utils/colors';
import {FC, useState} from 'react';
import {View, Text,  StyleSheet, Pressable, StyleProp, ViewStyle} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';



interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    activeRate?: string;
    onPress?(rate: number): void;
  }
  
  const speedRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
  const selectorSize = 40;
  
  const PlaybackRateSelector: FC<Props> = ({
    activeRate,
    containerStyle,
    onPress,
  }) => {
    const [showButton, setShowButton] = useState(true);
    const width = useSharedValue(0);
  
    const handleOnPress = () => {
      setShowButton(false);
      width.value = withTiming(selectorSize * speedRates.length, {
        duration: 70,
      });
    };
  
    const widthStyle = useAnimatedStyle(() => ({
      width: width.value,
    }));
  
    return (
      <View style={[styles.container, containerStyle]}>
        {showButton ? (
          <Pressable onPress={handleOnPress}>
            <FontAwesome5 name="running" color={CONTRAST} size={24} />
          </Pressable>
        ) : null}

        {!showButton ? (
          <Animated.View style={[styles.buttons, widthStyle]}>
            {speedRates.map(item => {
              return (
                <Selector
                  value={item}
                  key={item}
                  active={activeRate === item}
                  onPress={() => onPress && onPress(+item)}
                />
              );
            })}
          </Animated.View>
        ) : null}
        
      </View>
    );
  };
  
  interface SelectorProps {
    value: string;
    active?: boolean;
    onPress?(): void;
  }
  
  const Selector: FC<SelectorProps> = ({value, active, onPress}) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.selector,
          active ? {backgroundColor: SECONDARY} : undefined,
        ]}>
        <Text style={styles.selectorText}>{value}</Text>
      </Pressable>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center'
    },
    buttons: {
      flexDirection: 'row',
      backgroundColor: OVERLAY,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    selector: {
      width: selectorSize,
      height: selectorSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectorText: {
      color: CONTRAST,
    },
  });
  
  export default PlaybackRateSelector;
  