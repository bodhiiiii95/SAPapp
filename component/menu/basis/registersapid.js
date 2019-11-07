import { Text, Form, Item, Label, Input, Button, Picker, CheckBox, Body, ListItem, Content, Toast} from 'native-base';
import React, { Component } from 'react';
import {StyleSheet, Dimensions, AsyncStorage, Keyboard, BackHandler} from 'react-native'; 
import {connect} from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';

const BackToHome = StackActions.pop({
    n:1
})

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

class RegisterSAPID extends React.Component{
    state={
        SAPUsername:'',
        SelectedClient:'',
        SAPPassword:'',
        Client:[],
        ResetPasswordFlag:false,
        Username:'',
        AppUsername:'',
        Message:'',
        ResetPasswordMessage:'',
        ButtonUnlock:'UNLOCK',
        Secret:''
    }

    async GetKey(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    this.setState({AppUsername:ResultParsed.username})
                    console.log("aaa" + ResultParsed.username)
                }
                else{
                    console.log("error")
                }
            })
        }
        catch(error){
            console.log(error)
        }
    }

    EncryptSendPassword = (value) => {
        var CryptoJS = require('crypto-js');
        var hashedkey = CryptoJS.MD5("kunciajaib100%").toString();
        var hashediv = CryptoJS.MD5("tepunggaram999*").toString();
        var key = CryptoJS.enc.Hex.parse(hashedkey);
        var iv = CryptoJS.enc.Hex.parse(hashediv);
        var AESchiper = CryptoJS.AES.encrypt(value, key, {iv:iv, padding:CryptoJS.pad.ZeroPadding});
        return AESchiper.toString()
    }

    RegisterSapId = () => {
        Keyboard.dismiss();
        this.setState({Message:'Waiting for result...'});
        if(this.state.SAPPassword === '' || this.state.SAPUsername ===''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else{
            Keyboard.dismiss();
            var encryptedPassword = this.EncryptSendPassword(this.state.SAPPassword);
            fetch(this.props.APIIP + 'sapapi/registerSAPID.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    username:this.state.AppUsername,
                    SAPusername:this.state.SAPUsername,
                    SAPpassword:encryptedPassword,
                    SAPclient:this.state.SelectedClient
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
            var response = responseJson.message;
            this.setState({Message:response}) 
            console.log(encryptedPassword);
            }).catch((error) => {
                Toast.show({
                    text:'tidak terhubung ke jaringan / server bermasalah',
                    buttonText:'Okay',
                    type:'warning',
                    duration:3000
                })
            })
        }
    }

    GetClient = () =>{
        fetch(this.props.APIIP + 'sapapi/showClient.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
        var response = responseJson.client 
        this.setState({Client:[...response]})
        console.log(this.state.client)
        }).catch((error) => {
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    HandleChangeValue = (value) => {
        this.setState({SelectedClient:value})
    }

    componentDidMount(){
        this.GetClient();
        this.GetKey();
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

    HandleBackButton = () => {
        this.props.navigation.dispatch(BackToHome);
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    render(){
        return(
            <Content underline={false}>
                <Form underline={false} style={styles.container}>
                    <Item floatingLabel>
                        <Label>SAP Username</Label>
                        <Input onChangeText={(value) => this.setState({SAPUsername:value})} />
                    </Item>
                    <Item floatingLabel>
                        <Label>SAP Password</Label>
                        <Input secureTextEntry={true} onChangeText={(value) => this.setState({SAPPassword:value})} />
                    </Item>
                    <Item style={{borderColor: '#ffffff'}}>
                        <Text>Client : </Text>
                        <Picker mode="dropdown" selectedValue={this.state.SelectedClient} onValueChange={(value) => this.HandleChangeValue(value)}>
                            {this.state.Client.map((Client) => <Picker.Item label={Client} value={Client} />)}
                        </Picker>
                    </Item>
                    <Item style={styles.ButtonContainer}>
                        <Button rounded style={styles.ButtonUnlock} onPress={()=> this.RegisterSapId()}>
                            <Text>Register</Text>
                        </Button>
                    </Item>
                    <Item style={styles.CheckBox}>
                        <Text>{this.state.Message}</Text>
                    </Item>
                </Form>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    ButtonContainer:{
        marginTop : 25,
        justifyContent:'center',
        borderColor: '#ffffff',
    },
    ButtonUnlock:{
        width:width/3,
        justifyContent:'center',
    },
    ButtonLock:{
        marginLeft : 25,
        width:width/3,
        justifyContent:'center',
    },
    ButtonExtend:{
        width:width/2,
        justifyContent:'center',
    },
    CheckBox:{
        alignSelf:'flex-start',
        marginTop:25,
        flexDirection:'row',
        borderColor: '#ffffff',
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

const RegisterSAPIDRedux = connect(MapStateToProps, MapDispatchToProps)(RegisterSAPID)

export default withNavigation(RegisterSAPIDRedux);