import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {Container, Text, Form, Item, Label, Input, Button, Root, Toast, Icon} from 'native-base';
import {StyleSheet, Dimensions, View, ImageBackground, TextInput, Animated, TouchableHighlight, Image, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import Video from 'react-native-video';


var conn;
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
const PreventBack = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Menu'})],
});

class LoginApp extends React.Component{
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            Message:'',
            TextInput:0,
            CardPos:new Animated.Value(0),
            LoginButtonWidth:0,
            LoginButtonHeight:0,
            LogoPos: new Animated.Value(0),
            Enable:false,
            ScreenOpacity:new Animated.Value(1),
            LoginButtonDisabled:true,
        }
    }
    

    async SaveKey(value){
        try{
            await AsyncStorage.setItem('user', value);
        }
        catch(error){
            console.log(error)
        }
    }

    async CheckLogin(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    this.props.ChangeAppUsername(ResultParsed.username)
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
                        this.HandleAllScreenAnimation()
                        clearInterval(conn);
                    }
                    else if(status == '0'){
                        this.HandleFormContainerAnimation();
                        clearInterval(conn);
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
                    this.HandleFormContainerAnimation();
                    clearInterval(conn);
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

    EncryptSendPassword = (value) => {
        var CryptoJS = require('crypto-js');
        var hashedkey = CryptoJS.SHA256("KUNCIUNTUKMASUKES69#").toString();
        var hashediv = CryptoJS.SHA256("99%GARAMASINBUATES").toString().substr(0,16);
        var key = CryptoJS.enc.Hex.parse(hashedkey);
        var iv = CryptoJS.enc.Hex.parse(hashediv);
        var AESchiper = CryptoJS.AES.encrypt(value, key, {iv:iv, padding:CryptoJS.pad.Pkcs7});
        return AESchiper.toString();
    }

    Login = () => {
        var CryptoJS = require('crypto-js');
        var HashPassword = CryptoJS.MD5(this.state.password).toString()
        if(this.state.username == '' || this.state.password == ''){
            Toast.show({
                text:'Tolong isi semua kolom',
                buttonText:'Okay',
                type:'warning'
            })
        }
        else{
            fetch(this.props.APIIP + 'dcoappapi/login', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                username: this.state.username,
                password: HashPassword 
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
            var status = responseJson.response
            if(status == '1'){
                let LoginData = {username:this.state.username, password:HashPassword, espassword:this.EncryptSendPassword(this.state.password)}
                this.SaveKey(JSON.stringify(LoginData));
                this.HandleAllScreenAnimation()
            }
            else if(status == '0'){
                Toast.show({
                    text : "Username atau Password salah",
                    buttonText: "Okay",
                    type:"danger"
                })
            }
            }).catch((error) => {
                Toast.show({
                    text:error,
                    buttonText:'Okay',
                    type:'warning',
                    duration:3000
                })
            })
        }
    }

    HandleFormContainerAnimation = () => {
        Animated.sequence([
            Animated.decay(this.state.LogoPos,{
                velocity:-0.5,
                deceleration:0.996,
            }),
            Animated.timing(this.state.CardPos,
            {
                duration:1000,
                toValue:1
            })
        ]).start(() => {
            if(this._isMounted){
                this.setState({Enable:true, LoginButtonDisabled:false})
            }
            else{
                ;
            }
        });
    }

    HandleAllScreenAnimation = () => {
        Animated.timing(this.state.ScreenOpacity,{
            toValue:0,
            duration:750,
        }).start(() => this.props.navigation.dispatch(PreventBack))
    }

    componentDidMount(){
        this._isMounted = true;
        

        conn = setInterval(() => {
            this.CheckLogin();
        }, 1600);
    }

    render(){
        return(
            <Root>
                <Animated.View style={{flex:1, opacity:this.state.ScreenOpacity}}>
                    <StatusBar backgroundColor='grey' />
                    <ImageBackground source={require("./src/bg.jpg")} style={styles.container}>
                        <Animated.View style={{position:'absolute', transform:[{translateY:this.state.LogoPos}] }}>
                            <Image source={require('./src/logo.png')} />
                        </Animated.View>

                        <Animated.View style={{backgroundColor:'transparent', borderRadius:15, position:'absolute', width:width-20, height:height/2, flex:1, justifyContent:'center', alignItems:'center', opacity:this.state.CardPos , transform:[{translateY:180}]}} >
                            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20}} onLayout={(heights) => {this.setState({TextInput:heights.nativeEvent.layout.height/2})}}>
                                <View style={{flex:1}}>
                                    <Icon name="person" size={30}  style={{color:'white'}}/>
                                </View>

                                <View style={styles.TextInput}>
                                    <TextInput editable={this.state.Enable} onChangeText={(user) => this.setState({username:user})} style={{height:this.state.TextInput, color:'white'}} placeholderTextColor='white' placeholder="username"/>
                                </View>
                            </View>

                            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20}}>
                                <View style={{flex:1}}>
                                    <Icon name="lock" size={30} style={{color:'white'}}/>
                                </View>

                                <View style={styles.TextInput}>
                                    <TextInput editable={this.state.Enable} onChangeText={(pass) => {this.setState({password:pass})}} style={{height:this.state.TextInput, color:'white'}} placeholder="password" secureTextEntry={true} placeholderTextColor='white'/>
                                </View>
                            </View>

                            <View style={{flex:2, marginLeft:20, marginRight:20, justifyContent:'center', alignItems:'center'}} >
                                <TouchableHighlight disabled={this.state.LoginButtonDisabled} style={{backgroundColor:'transparent', height:height/15, width:width-50, justifyContent:'center', alignItems:'center', borderRadius:100, borderColor:'white', borderWidth:3, marginBottom:height/12}} onPress={()=>this.Login()}>
                                    <Text style={{color:'white', fontWeight:'bold'}}>login</Text>
                                </TouchableHighlight>
                            </View>
                            
                        </Animated.View>
                    </ImageBackground>
                </Animated.View>
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
    ButtonLogin:{
        width:width/2,
        justifyContent:'center',
    },
    TextInput:{
        flex:10,
        borderColor:'white',
        borderBottomWidth:1,
        backgroundColor:'transparent',
    }
})


const MapStateToProps = (state) => {
    return{
        APIIP:state.reducer.APIIP,
        AppUser:state.reducer.AppUser
    }
}

const MapDispatchToProps = (dispatch) =>{
    return{
        SelectMenuType : (type) => {
            dispatch({type:'CHANGE_SCREEN_TYPE', payload:type})
        },
        ChangeAppUsername : (Username) => {
            dispatch({type:'CHANGE_APP_USER', payload:Username})
        }
    }
}

const LoginRedux = connect(MapStateToProps, MapDispatchToProps)(LoginApp)

export default withNavigation(LoginRedux)