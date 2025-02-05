import ReactDOM from "react-dom";
import "index.scss";
import App from "App";
import * as serviceWorker from "serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { QueryProvider } from "query";
import { ReactQueryDevtools } from "react-query/devtools";
import config from "config";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "theme";
import { UserProvider, ApiProvider } from "hooks/authHooks";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

Amplify.configure({
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
});

// LaunchDarkly Configuration
const ldClientId = process.env.REACT_APP_LD_SDK_CLIENT;
(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: ldClientId!,
    options: {
      baseUrl: "https://clientsdk.launchdarkly.us",
      streamUrl: "https://clientstream.launchdarkly.us",
      eventsUrl: "https://events.launchdarkly.us",
    },
    deferInitialization: false,
  });

  ReactDOM.render(
    <Router>
      <UserProvider>
        <ApiProvider>
          <QueryProvider>
            <ChakraProvider theme={theme}>
              <LDProvider>
                <App />
              </LDProvider>
            </ChakraProvider>
            <ReactQueryDevtools />
          </QueryProvider>
        </ApiProvider>
      </UserProvider>
    </Router>,
    document.getElementById("root")
  );
})().catch((e) => {
  throw e;
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
