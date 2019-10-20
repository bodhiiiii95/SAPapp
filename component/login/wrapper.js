import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {Container, Text, Form, Item, Label, Input, Button, Root, Toast} from 'native-base';
import {StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';


var conn;
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
const PreventBack = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Menu'})],
});

class LoginApp extends React.Component{
    state={
        username:'',
        password:'',
        Message:'',
    }

    async SaveKey(value){
        try{
            await AsyncStorage.setItem('user', value);
        }
        catch(error){
            console.log(error)
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
                this.props.navigation.dispatch(PreventBack)
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

    componentDidMount(){
    }

    componentWillUnmount(){

    }

    render(){
        return(
            <Root>
                <Container>
                    <Form style={styles.container}>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input onChangeText={(value) => this.setState({username:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input secureTextEntry={true} onChangeText={(value) => this.setState({password:value})} />
                        </Item>
                        <Item style={{marginTop:10, borderColor: '#ffffff'}}>
                            <Button rounded style={styles.ButtonLogin} onPress={() => this.Login()} >
                                <Text>Login</Text>
                            </Button>
                        </Item>
                        <Item style={{marginTop:10, borderColor: '#ffffff'}}>
                            <Text>{this.state.Message}</Text>
                        </Item>
                    </Form>
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
    ButtonLogin:{
        width:width/2,
        justifyContent:'center',
    }
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

const LoginRedux = connect(MapStateToProps, MapDispatchToProps)(LoginApp)

export default withNavigation(LoginRedux)