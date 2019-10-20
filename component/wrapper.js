import { createStackNavigator, createAppContainer } from 'react-navigation';
import React, {Component} from 'react';
import SplashApp from './splash/wrapper.js';
import LoginApp from './login/wrapper.js';
import MenuApp from './menu/wrapper.js'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import { zoomIn } from 'react-navigation-transitions';

class SplashScreen extends React.Component{
    static navigationOptions = {
        title: 'Splash',
        header: null
    };
    render(){
        return (<SplashApp />);
    }
}

class LoginScreen extends React.Component{
    static navigationOptions = {
        title : 'Login',
        header:null
    };
    render(){
        return (<LoginApp />)
    }
}

class MenuScreen extends React.Component{
    static navigationOptions = {
        title : 'Menu',
        header : null,
    }
    render(){
        return(<MenuApp />)
    }
}

const RootStack = createStackNavigator({
    Splash : SplashScreen,
    Login : LoginScreen,
    Menu : MenuScreen,
},
{
    initialRouteName: 'Splash',
    transitionConfig: () => zoomIn(1000),
});

const AppNavigator = createAppContainer(RootStack);
//export default App;

/*export default class App extends React.Component{
    render(){
		return(
            <RootStack />
        );
	}
}*/

export default class App extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        )
    }
}

/*---------------------- Redux Area -----------------------*/

const orderState = {
    ScreenType:'HOME',
    NullValue:'0',
    APIIP:'https://sapweb.cp.co.id/',
    Client:'',
    SAPID:'',
    ResetState:'',
    Request:'',
    RequestType:'',
    Link:'',
    DoneState:false,
    RoleName:'',
    Valid:'',
}

const reducer = (state = orderState, action) => {
    switch(action.type){
        case "CHANGE_ROLE_NAME_STATE":
            state = {
                ...state,
                RoleName:action.payload
            }
        break;
        case "CHANGE_VALID_STATE":
            state = {
                ...state,
                Valid:action.payload
            }
        break;
        case "CHANGE_DONE_STATE":
            state = {
                ...state,
                DoneState:action.payload
            }
        break;
        case "CHANGE_SCREEN_TYPE":
            state = {
                ...state,
                ScreenType:action.payload
            }
        break;
        case "CHANGE_CLIENT":
            state = {
                ...state,
                Client:action.payload
            }
        break;
        case "CHANGE_SAP_ID":
            state = {
                ...state,
                SAPID:action.payload
            }
        break;
        case "CHANGE_RESET_STATE":
            state = {
                ...state,
                ResetState:action.payload
            }
        break;
        case "CHANGE_REQUEST":
            state = {
                ...state,
                Request:action.payload
            }
        break;
        case "CHANGE_REQUEST_TYPE":
            state = {
                ...state,
                RequestType:action.payload
            }
        break;
        case "CHANGE_LINK":
            state = {
                ...state,
                Link:action.payload
            }
        break;
    }

    return state;
}

const store = createStore(combineReducers({reducer}), {}, applyMiddleware(loggers))

const myLogger = (store) => (next) => (action) =>{
    console.log(action);
    next(action)
}

function loggers({getState}){
    return next => action => {
        const returnValue = next(action)

        if(action.type == "CHANGE_SCREEN_TYPE"){
            console.log("yes");
        }

        return returnValue
    }
}