import AppContainer from "@components/AppContainer"
import AppNavigator from "@src/index"
import store from "@src/store"
import { QueryClient, QueryClientProvider } from "react-query"
import { Provider } from "react-redux"
import { AudioProvider } from "@src/hooks/audioContext.context"

const queryClient = new QueryClient()

const App = () => {

  return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AudioProvider >
            <AppContainer>
              <AppNavigator/>
            </AppContainer>
          </AudioProvider>
        </QueryClientProvider>
      </Provider>
    )
}

export default App