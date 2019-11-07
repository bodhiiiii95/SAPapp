import { createStackNavigator, createAppContainer } from 'react-navigation';
import React, {Component} from 'react';
import SplashApp from './splash/wrapper.js';
import LoginApp from './login/wrapper.js';
import MenuApp from './menu/wrapper.js'
import UnlockSAPID from './menu/basis/unlocksapid.js'
import AssignSAPRole from './menu/basis/assignsaprole'
import RegisterSAPID from './menu/basis/registersapid.js';
import CreateSAPID from './menu/basis/createsapid.js';
import TransportRole from './menu/basis/transportRole';
import {createStore, combineReducers, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
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

class UnlockSAPIDScreen extends React.Component{
    static navigationOptions = {
        title : 'UnlockSAPID',
        header : null,
    }
    render(){
        return(<UnlockSAPID />)
    }
}

class AssignSAPRoleScreen extends React.Component{
    static navigationOptions = {
        title : 'AssignSAPRole',
        header : null,
    }
    render(){
        return(<AssignSAPRole />)
    }
}

class RegisterSapIDScreen extends React.Component{
    static navigationOptions = {
        title : 'RegisterSAPID',
        header : null,
    }
    render(){
        return(<RegisterSAPID />)
    }
}

class CreateSAPIDScreen extends React.Component{
    static navigationOptions = {
        title : 'CreateSAPID',
        header : null,
    }
    render(){
        return(<CreateSAPID />)
    }
}

class TransportRoleScreen extends React.Component{
    static navigationOptions = {
        title : 'TransportRole',
        header : null,
    }
    render(){
        return(<TransportRole />)
    }
}

const RootStack = createStackNavigator({
    Splash : SplashScreen,
    Login : LoginScreen,
    Menu : MenuScreen,
    UnlockSAPID : UnlockSAPIDScreen,
    AssignSAPRole : AssignSAPRoleScreen,
    RegisterSAPID : RegisterSapIDScreen,
    CreateSAPID : CreateSAPIDScreen,
    TransportRole:TransportRoleScreen,
},
{
    initialRouteName: 'Login',
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
    AppUser:'',
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
        case "CHANGE_APP_USER":
            state = {
                ...state,
                AppUser:action.payload
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