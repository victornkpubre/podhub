import { SECONDARY } from '@utils/colors';
import {FC} from 'react';
import Icon from '@expo/vector-icons/Entypo'


interface Props {
    privateIcon: boolean
}

const PasswordVisibilityIcon: FC<Props> = ({privateIcon}) => {
   return privateIcon? <Icon name='eye' color='white' size={16}/>
        : <Icon name='eye-with-line' color={SECONDARY} size={16}/>
};

export default PasswordVisibilityIcon;