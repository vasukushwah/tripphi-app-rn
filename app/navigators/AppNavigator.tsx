/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models" // @demo remove-current-line
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator" // @demo remove-current-line
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { GENERAL_SCREENS, PRIVATE_SCREENS, PUBLIC_SCREENS } from "./navigation.types"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  Demo: NavigatorScreenParams<DemoTabParamList> // @demo remove-current-line
  [GENERAL_SCREENS.INITIAL]: undefined
  [GENERAL_SCREENS.ONBOARDING]: undefined
  [GENERAL_SCREENS.WELCOME]: undefined
  [PUBLIC_SCREENS.SIGN_IN]: undefined
  [PUBLIC_SCREENS.SIGN_UP]: undefined
  [PUBLIC_SCREENS.FORGOT_PASSWORD]: undefined
  [PUBLIC_SCREENS.SET_NEW_PASSWORD]: undefined
  [PRIVATE_SCREENS.ChangePassword]: undefined

  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  // @demo remove-block-end
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={GENERAL_SCREENS.ONBOARDING} // @demo remove-current-line
      // initialRouteName={isAuthenticated ? "Welcome" : "Login"} // @demo remove-current-line
    >
      {/* @demo remove-block-start */}
      {isAuthenticated ? (
        <>
          {/* @demo remove-block-end */}
          {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
          {/* @demo remove-block-start */}
          <Stack.Screen name="Demo" component={DemoNavigator} />
          <Stack.Screen
            name={PRIVATE_SCREENS.ChangePassword}
            component={Screens.ChangePasswordScreen}
          />
        </>
      ) : (
        <>
          {/* <Stack.Screen name="Login" component={Screens.LoginScreen} /> */}
          <Stack.Screen name={GENERAL_SCREENS.ONBOARDING} component={Screens.OnBoardingScreen} />
          <Stack.Screen name={GENERAL_SCREENS.WELCOME} component={Screens.WelcomeScreen} />
          <Stack.Screen name={PUBLIC_SCREENS.SIGN_UP} component={Screens.SignUpScreen} />
          <Stack.Screen name={PUBLIC_SCREENS.SIGN_IN} component={Screens.SignInScreen} />
          <Stack.Screen
            name={PUBLIC_SCREENS.FORGOT_PASSWORD}
            component={Screens.ForgotPasswordScreen}
          />
          <Stack.Screen
            name={PUBLIC_SCREENS.SET_NEW_PASSWORD}
            component={Screens.SetNewPasswordScreen}
          />
        </>
      )}
      {/* @demo remove-block-end */}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
