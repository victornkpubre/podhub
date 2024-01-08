import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

type NotificationType = 'error' | 'success'

interface Notification {
    message: string;
    type: NotificationType
}

const initialState: Notification = {
    message: '',
    type: 'error'
}

const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        updateNotification(notificationState, {payload}:PayloadAction<Notification>) {
            console.log("Updating Notification")
            notificationState.message = payload.message
            notificationState.type = payload.type
        }
    }
})

export const getNotificationState = createSelector(
    (state: RootState) => state.notification,
    state => state
)

export const {updateNotification} = slice.actions
export default slice.reducer