import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {Container, Toast, Root} from 'native-base';
import {StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

var conn;
const PreventBack = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Login'})],
});

const PreventBackToSplash = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Menu'})],
});

class SplashApp extends React.Component{

    GoToLogin = () =>{
        this.props.navigate.dispatch()
    }

    async CheckLogin(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    fetch(this.props.APIIP + 'dcoappapi/login', {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                        username: ResultParsed.username,
                        password: ResultParsed.password 
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                    var status = responseJson.response
                    if(status == '1'){
                        this.props.navigation.dispatch(PreventBackToSplash)
                    }
                    else if(status == '0'){
                        this.props.navigation.dispatch(PreventBack)
                    }
                    }).catch((error) => {
                        console.log(error)
                        Toast.show({
                            text:"tidak terhubung ke jaringan / server bermasalah",
                            buttonText:'Okay',
                            type:'warning',
                            duration:3000
                        })
                    })
                }
                else{
                    this.props.navigation.dispatch(PreventBack)
                }
            })
        }
        catch(error){
            this.props.navigation.dispatch(PreventBack)
            
            Toast.show({
                text:"tidak terhubung ke jaringan / server bermasalah",
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        }
    }

    componentDidMount(){
        conn=setInterval(()=>{
            this.CheckLogin()
        }, 2000)
    }

    componentWillUnmount(){
        clearInterval(conn)
    }

    render(){
        return(
            <Root>
                <Container style={styles.container}>
                    <Image source={require('./src/logo.png')}></Image>
                </Container>
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
})


const MapStateToProps = (state) => {
    return{APIIP:state.reducer.APIIP}
}

const MapDispatchToProps = (dispatch) =>{
    return{
        SelectMenuType : (type) => {
            dispatch({type:'CHANGE_SCREEN_TYPE', payload:type})
        }
    }
}

const SplashRedux = connect(MapStateToProps, MapDispatchToProps)(SplashApp)

export default withNavigation(SplashRedux)