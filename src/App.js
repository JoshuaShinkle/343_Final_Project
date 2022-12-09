import React from "react";
import Main from "./Main";
import MainNav from "./components/MainNav";
import { NextUIProvider, Text } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";
import { Switch, useTheme } from "@nextui-org/react";

function App() {
    // 2. Call `createTheme` and pass your custom values
    const lightTheme = createTheme({
        type: "light",
    });

    const darkTheme = createTheme({
        type: "dark",
    });

    // 3. Apply light or dark theme depending on useDarkMode value
    // App.jsx entry point of your app

    const darkMode = useDarkMode(false);

    // 2. Use at the root of your app
    return (
        <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
            <MainNav />
            <AppWrapper />
        </NextUIProvider>
    );
}

const AppWrapper = () => {
    const darkMode = useDarkMode(false);
    const { type, isDark } = useTheme();

    return (
        <div>
            The current theme is: {type}
            <Switch
                checked={darkMode.value}
                onChange={() => darkMode.toggle()}
            />
        </div>
    );
};

export default App;
