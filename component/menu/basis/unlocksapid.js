import { Text, Form, Item, Label, Input, Button, Picker, CheckBox, Body, ListItem, Content, Toast, Card, CardItem} from 'native-base';
import React, { Component } from 'react';
import {StyleSheet, Dimensions, AsyncStorage, Keyboard, Alert, View, BackHandler} from 'react-native'; 
import {connect} from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {WebView} from 'react-native-webview';

const BackToHome = StackActions.pop({
    n:1
})
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

class UnlockSAPID extends React.Component{

    state={
        SAPUsername:this.props.SAPID,
        SelectedClient:'',
        Client:[],
        ResetPasswordFlag:false,
        Username:'',
        AppUsername:'',
        Message:'',
        ResetPasswordMessage:'',
        ButtonUnlock:'UNLOCK',
        UnlockDisabled:true,
        LockDisabled:true,
        ExtendDisabled:true,
        BackToHomeEnabled:false,
        SAPIDNLP:'',
    }

    async GetKey(){
        if(this.props.RequestType === 'UNLOCK' || this.props.RequestType === 'UNLOCKRESET'){
            this.setState({UnlockDisabled:false, LockDisabled:true, ExtendDisabled:true})
        }
        else if(this.props.RequestType === 'EXTEND'){
            this.setState({UnlockDisabled:true, LockDisabled:true, ExtendDisabled:false})
        }
        else{
            this.setState({UnlockDisabled:false, LockDisabled:false, ExtendDisabled:false})
        }

        if(this.props.ResetState === true || this.props.ResetState === 'true'){
            this.setState({ResetPasswordFlag:true, ButtonUnlock:'UNLOCK & RESET'});
        }
        else if(this.props.ResetState === false || this.props.ResetState === 'false'){
            this.setState({ResetPasswordFlag:false, ButtonUnlock:'UNLOCK'});
        }

        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    this.setState({AppUsername:ResultParsed.username})
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

    LockSapId = () => {
        Keyboard.dismiss();
        this.setState({Message:'Waiting for result...', ResetPasswordMessage:''});
        if(this.state.SAPUsername === '' || this.state.SelectedClient === ''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else{
            Keyboard.dismiss();
            this.setState({BackToHomeEnabled:true});
            fetch(this.props.APIIP + 'sapapi/lockUser.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    username:this.state.SAPUsername.trim(),
                    SAPclient:this.state.SelectedClient,
                    webUsername:this.state.AppUsername,
                    resetPasswordFlag:this.state.ResetPasswordFlag
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                var APIresponse = responseJson.message
                this.setState({Message:responseJson.message});
                this.setState({ResetPasswordMessage:''});
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

    ExtendSapId = () => {
        Keyboard.dismiss();
        this.setState({Message:'Waiting for result...', ResetPasswordMessage:''});
        if(this.state.SAPUsername === '' || this.state.SelectedClient ===''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else{
            Keyboard.dismiss();
            this.setState({BackToHomeEnabled:true});
            fetch(this.props.APIIP + 'sapapi/extendUser.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    username:this.state.SAPUsername.trim(),
                    SAPclient:this.state.SelectedClient,
                    webUsername:this.state.AppUsername,
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                var APIresponse = responseJson.message
                let DoneStateMustTrue = setInterval(() => {
                    if(this.props.DoneState === false){
                        this.props.ChangeDoneState(true)
                        console.log(this.props.DoneState)
                    }
                    else{
                        console.log(this.props.DoneState)
                        this.setState({BackToHomeEnabled:true}, () => {
                            this.setState({Message:responseJson.message});
                            this.setState({ResetPasswordMessage:''});
                        });
                        clearInterval(DoneStateMustTrue)
                    }
                }, 500)
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

    UnlockSapId = () => {
        //fungsi ini untuk melakukan unlock pada SAP ID
        Keyboard.dismiss(); //menyembunyikan keybuard
        this.setState({Message:'Waiting for result...', ResetPasswordMessage:''}); //menunggu hasil
        if(this.state.SAPUsername === '' || this.state.SelectedClient === ''){ //cek jika form belum lengkap
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else{
            fetch(this.props.APIIP + 'sapapi/unlockUser.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    username:this.state.SAPUsername.replace(/\s+/g, ''),
                    SAPclient:this.state.SelectedClient,
                    webUsername:this.state.AppUsername,
                    resetPasswordFlag:this.state.ResetPasswordFlag
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                var APIresponse = responseJson.message
                if(this.state.ResetPasswordFlag === true && this.state.Mesage !== 'please register your SAP ID First' && this.state.Message.toString().includes('does not exist') === false){
                    let DoneStateMustTrue = setInterval(() => {
                        if(this.props.DoneState === false){
                            this.props.ChangeDoneState(true)
                        }
                        else{
                            this.setState({BackToHomeEnabled:true}, () => {
                                this.setState({ResetPasswordMessage:'with reset password : initial'})
                                this.setState({Message:responseJson.message});
                            });
                            clearInterval(DoneStateMustTrue)
                        }
                    }, 500)
                }
                else if(this.state.ResetPasswordFlag === false && this.state.Mesage !== 'please register your SAP ID First' && this.state.Message.toString().includes('does not exist') === false){
                    let DoneStateMustTrue = setInterval(() => {
                        if(this.props.DoneState === false){
                            this.props.ChangeDoneState(true)
                        }
                        else{
                            this.setState({BackToHomeEnabled:true}, () => {
                                this.setState({ResetPasswordMessage:'with no password reset'})
                                this.setState({Message:responseJson.message});
                            });
                            clearInterval(DoneStateMustTrue)
                        }
                    }, 500)
                }
                else{
                    this.setState({ResetPasswordMessage:''});
                }
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
        //fungsi ini untuk mendapatkan list client dari server
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
        this.setState({Client:[...response]}, () => {
            this.setState({SelectedClient:this.props.Client})
        })
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
        //funsi ini untuk ganti value dropdown saat diganti
        this.setState({SelectedClient:value})
    }

    HandleCheckBox = () => {
        // fungsi ini untuk cek apakah ingin reset password atau tidak
        if(this.state.ResetPasswordFlag === false){
            this.setState({ResetPasswordFlag:true, ButtonUnlock:'UNLOCK & RESET'});
        }
        else if(this.state.ResetPasswordFlag === true){
            this.setState({ResetPasswordFlag:false, ButtonUnlock:'UNLOCK'});
        }
        
    }

    HandleRedux = () => {
        if(this.props.request === ''){
            ;
        }
    }

    ConfirmBackToHome = () => {
        this.setState({BackToHomeEnabled:false}, ()=>{
            let TimeChangeMenuType = setInterval(() => {
                if(this.props.RequestType === '' || this.props.ResetState === '' || this.props.SAPID === '' || this.props.client === '' || this.props.Request === '' || this.props.ScreenType !== 'HOME' || this.props.ScreenType === '' || this.props.ScreenType === null){
                    clearInterval(TimeChangeMenuType)
                    this.props.SelectMenuType('HOME')
                    this.props.navigation.dispatch(BackToHome);
                }
                else{
                    this.props.ChangeRequestType('');
                    this.props.ChangeResetState('');
                    this.props.ChangeSAPID('');
                    this.props.ChangeClient('');
                    this.props.MessageSend('');
                }
            }, 100)
        })
    }

    AutofillAlert = () => {
        if(this.state.BackToHomeEnabled === false){
            this.setState({Message:"You're not doing/change anything"})
        }
        else{
            Alert.alert(
                'Confirmation',
                'Are you sure all of your work is done?',
                [
                    {text:'OK', onPress:() => this.Autofill()},
                    {text:'Cancel', onPress:() => console.log('cancel')}
                ]
            )
        }
    }

    Autofill = () => {
        if(this.props.RequestType === 'UNLOCKRESET'){
            this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, unlock and reset password : initial';")
        }
        else if(this.props.RequestType === 'UNLOCK'){
            this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, hanya unlock';")
        }
        else if(this.props.RequestType === 'EXTEND'){
            this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, extend';")
        }
        this.webview.injectJavaScript("document.getElementById('Done').click();");
    }

    componentDidMount(){
        this.GetClient();
        this.GetKey();
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

    componentDidUpdate(PrevProps){
        if(this.props.Request === PrevProps.Request){
        }
        else{
            this.setState({UnlockDisabled:false, LockDisabled:false, ExtendDisabled:false})
            console.log("ada perubahan message")
        }
    }

    HandleBackButton = () => {
        this.ConfirmBackToHome()
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    render(){
        return(
            <View style={{flex:1}}>
                <Content underline={false}>
                    <Form underline={false} style={styles.container}>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input value={this.state.SAPUsername} onChangeText={(value) => this.setState({SAPUsername:value})} />
                        </Item>
                        <Item style={{borderColor: '#ffffff'}}>
                            <Text>Client : </Text>
                            <Picker mode="dropdown" selectedValue={this.state.SelectedClient} onValueChange={(value) => this.HandleChangeValue(value)}>
                                {this.state.Client.map((Client) => <Picker.Item label={Client} value={Client} />)}
                            </Picker>
                        </Item>
                        {
                            this.props.RequestType === 'UNLOCK' || this.props.RequestType === 'UNLOCKRESET' ||  this.props.RequestType === ''?
                            <ListItem style={styles.CheckBox}>
                                <CheckBox disabled={false} checked={this.state.ResetPasswordFlag} onPress={() => this.HandleCheckBox()}/>    
                                <Body>
                                    <Text>Reset Password</Text>
                                </Body>
                            </ListItem>
                            :
                            <ListItem style={styles.CheckBox}>
                                <CheckBox disabled={true} checked={this.state.ResetPasswordFlag} onPress={() => this.HandleCheckBox()}/>    
                                <Body>
                                    <Text>Reset Password</Text>
                                </Body>
                            </ListItem>
                        }
                        
                        <Item style={styles.ButtonContainer}>
                            <Button disabled={this.state.UnlockDisabled} rounded style={styles.ButtonUnlock} onPress={()=> this.UnlockSapId()}>
                                <Text>{this.state.ButtonUnlock}</Text>
                            </Button>
                            {
                                this.state.LockDisabled ?
                                <Button disabled={this.state.LockDisabled} rounded style={styles.ButtonLock} onPress={()=> this.LockSapId()}>
                                    <Text>Lock</Text>
                                </Button>
                                :
                                <Button disabled={this.state.LockDisabled} rounded danger style={styles.ButtonLock} onPress={()=> this.LockSapId()}>
                                    <Text>Lock</Text>
                                </Button>
                            }
                        </Item>
                        <Item style={styles.ButtonContainer}>
                            {
                                this.state.ExtendDisabled ?
                                <Button disabled={this.state.ExtendDisabled} rounded style={styles.ButtonExtend} onPress={()=> this.ExtendSapId()}>
                                    <Text>Extend SAP ID</Text>
                                </Button>
                                :
                                <Button disabled={this.state.ExtendDisabled} rounded success style={styles.ButtonExtend} onPress={()=> this.ExtendSapId()}>
                                    <Text>Extend SAP ID</Text>
                                </Button>
                            }
                        </Item>
                        <Item style={styles.CheckBox}>
                            <Text>{this.state.Message + ' ' + this.state.ResetPasswordMessage}</Text>
                        </Item>
                    </Form>
                    <Card>
                        {
                            this.props.Request === '' || this.props.RequestType === '' ?
                            <CardItem bordered header>  
                                <Text>This action is not affiliate to request from ES</Text>
                            </CardItem>
                            :
                            <CardItem bordered button onPress={() => this.AutofillAlert()} header>  
                                <Text>This action is affiliate to request : {this.props.Link} (Click here if you have done your work)</Text>
                            </CardItem>
                        }
                        
                        <CardItem bordered>
                            <Body>
                                <Text accessible={true} selectable={true}>{this.props.Request  + " client : " + this.props.Client}</Text>
                                
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                {
                    this.props.Request === '' || this.props.RequestType === '' ?
                    null
                    :
                    <WebView ref={c => this.webview = c} source={{uri:'https://es.cp.co.id/edco.php?ecsno=' + this.props.Link}} />
                }
            </View>
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
    return{
        APIIP:state.reducer.APIIP,
        Request:state.reducer.Request,
        Client:state.reducer.Client,
        SAPID:state.reducer.SAPID,
        ResetState:state.reducer.ResetState,
        RequestType:state.reducer.RequestType,
        ScreenType:state.reducer.ScreenType,
        Link:state.reducer.Link,
        DoneState:state.reducer.DoneState,
    }
}

const MapDispatchToProps = (dispatch) =>{
    return{
        ChangeDoneState : (DoneState) => {
            dispatch({type:'CHANGE_DONE_STATE', payload:DoneState})
        },
        SelectMenuType : (type) => {
            dispatch({type:'CHANGE_SCREEN_TYPE', payload:type})
        },
        MessageSend : (request) => {
            dispatch({type:'CHANGE_REQUEST', payload:request})
        },
        ChangeRequestType : (request) => {
            dispatch({type:'CHANGE_REQUEST_TYPE', payload:request})
        },
        ChangeClient : (client) => {
            dispatch({type:'CHANGE_CLIENT', payload:client})
        },
        ChangeSAPID : (SAPID) => {
            dispatch({type:'CHANGE_SAP_ID', payload:SAPID})
        },
        ChangeResetState : (ResetState) => {
            dispatch({type:'CHANGE_RESET_STATE', payload:ResetState})
        }
    }
}

const UnlockSAPIDRedux = connect(MapStateToProps, MapDispatchToProps)(UnlockSAPID)

export default withNavigation(UnlockSAPIDRedux)
