import { Text, Form, Item, Label, Input, Button, Picker, CheckBox, Body, ListItem, Content, Toast, Right, Left, Radio, DatePicker, CardItem, Card} from 'native-base';
import React, { Component } from 'react';
import {Modal, StyleSheet, Dimensions, AsyncStorage, Keyboard, Alert} from 'react-native'; 
import {connect} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

var DateNowYear = new Date().getFullYear();
var DateNowMonth = new Date().getMonth() + 1;
var DateNowDate = new Date().getDate();
var DateFrom = '';

var DateToDate = '';
var DateToMonth = '';
var DateToYear = '';
var DateTo = '';

class AssignSAPRole extends React.Component{
    state={
        SAPUsername:this.props.SAPID,
        SelectedClient:'',
        SAPRole:'',
        Client:[],
        Username:'',
        AppUsername:'',
        Message:'',
        RolePermanent:false,
        RoleOneTime:true,
        RoleCustom:false,
        RoleCustomFrom:'',
        RoleCustomTo:'',
        ButtonText:'Assign Role one Time',
        ClearFlag:true,
        FilePath:'',
        BackToHomeEnabled:false,
        TextValidToAutoComplete:'valid 1 hari',
    }

    async GetKey(){
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

    AssignSAPRole = () => {
        this.setState({Message:'Waiting for result...'});
        if(this.state.RolePermanent === true){
            DateNowYear = new Date().getFullYear().toString();
            DateNowMonth = (new Date().getMonth() + 1).toString();
            DateNowDate = new Date().getDate().toString();

            if(DateNowDate.length === 1){
                DateNowDate = '0'+ DateNowDate;
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            else{
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }

            if(DateNowMonth.length === 1){
                DateNowMonth = '0'+ DateNowMonth;
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            else{
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            DateTo = '99991231'
            this.setState({ClearFlag:true}, () => this.AssignRoleSendData());
        }
        else if(this.state.RoleOneTime === true){
            DateNowYear = new Date().getFullYear().toString();
            DateNowMonth = (new Date().getMonth() + 1).toString();
            DateNowDate = new Date().getDate().toString();

            if(DateNowDate.length === 1){
                DateNowDate = '0'+ DateNowDate;
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            else{
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }

            if(DateNowMonth.length === 1){
                DateNowMonth = '0'+ DateNowMonth;
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            else{
                DateFrom = DateNowYear+DateNowMonth+DateNowDate
            }
            DateTo = DateFrom;
            this.setState({ClearFlag:true}, () => this.AssignRoleSendData());
        }
        else if(this.state.RoleCustom === true && this.state.RoleCustomFrom === '' && this.state.RoleCustomTo === ''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else if(this.state.RoleCustom === true && this.state.RoleCustomFrom === '' && this.state.RoleCustomTo !== ''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else if(this.state.RoleCustom === true && this.state.RoleCustomFrom !== '' && this.state.RoleCustomTo === ''){
            DateFrom=this.DateParseFrom();
            DateTo = '99991231';
            this.setState({ClearFlag:true}, () => this.AssignRoleSendData());
        }
        else if(this.state.RoleCustom === true && this.state.RoleCustomFrom !== '' && this.state.RoleCustomTo !== ''){
            DateFrom=this.DateParseFrom();
            DateTo=this.DateParseTo();
            let DateFromInt = parseInt(DateFrom, 10);
            let DateToInt = parseInt(DateTo,10);

            if(DateFromInt>DateToInt){
                this.setState({Message:'Date From dilarang lebih besar dari date to'});
                this.setState({ClearFlag:false}, () => this.AssignRoleSendData());
            }
            else{
                this.setState({ClearFlag:true}, () => this.AssignRoleSendData());
            }
        }
    }

    AssignRoleSendData = () => {
        if(this.state.SAPUsername === '' || this.state.SAPRole === ''){
            this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
        }
        else if(this.state.ClearFlag === false){
            this.setState({Message:'Date From dilarang lebih besar dari date to'})
        }
        else{
            let AutoTextMustNotEmpty = setInterval(()=>{
                if(this.props.Valid !== '' || this.props.RoleName !== ''){
                    clearInterval(AutoTextMustNotEmpty)

                    Keyboard.dismiss();
                    this.setState({BackToHomeEnabled:true});
                    fetch(this.props.APIIP + 'sapapi/basis/assignSAPRole.php', {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                            username:this.state.SAPUsername.toUpperCase(),
                            SAPclient:this.state.SelectedClient,
                            webUsername:this.state.AppUsername,
                            SAPRole:this.state.SAPRole.toUpperCase(),
                            dateFrom:DateFrom,
                            dateTo:DateTo,
                        }),
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                    var response = responseJson.message;
                    this.setState({Message:response})
                    this.props.ChangeDoneState(true)
                    }).catch((error) => {
                        Toast.show({
                            text:'tidak terhubung ke jaringan / server bermasalah',
                            buttonText:'Okay',
                            type:'warning',
                            duration:3000
                        })
                    })
                }
                else{
                    this.props.ChangeValid(this.state.TextValidToAutoComplete)
                    this.props.ChangeRoleName(this.state.SAPRole)
                }
            }, 500)
        }
    }
    
    DateParseFrom = () => {
        if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Jan'){
            DateNowMonth = '01'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Feb'){
            DateNowMonth = '02'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Mar'){
            DateNowMonth = '03'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Apr'){
            DateNowMonth = '04'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'May'){
            DateNowMonth = '05'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Jun'){
            DateNowMonth = '06'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Jul'){
            DateNowMonth = '07'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Aug'){
            DateNowMonth = '08'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Sep'){
            DateNowMonth = '09'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Oct'){
            DateNowMonth = '10'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Nov'){
            DateNowMonth = '11'
        }
        else if(this.state.RoleCustomFrom.toString().substr(4,3) === 'Dec'){
            DateNowMonth = '12'
        }
        
        DateNowDate = this.state.RoleCustomFrom.toString().substr(8,2);
        DateNowYear = this.state.RoleCustomFrom.toString().substr(11,4);
        return DateNowYear+DateNowMonth+DateNowDate;
    }

    DateParseTo = () => {
        if(this.state.RoleCustomTo.toString().substr(4,3) === 'Jan'){
            DateToMonth = '01'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Feb'){
            DateToMonth = '02'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Mar'){
            DateToMonth = '03'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Apr'){
            DateToMonth = '04'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'May'){
            DateToMonth = '05'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Jun'){
            DateToMonth = '06'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Jul'){
            DateToMonth = '07'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Aug'){
            DateToMonth = '08'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Sep'){
            DateToMonth = '09'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Oct'){
            DateToMonth = '10'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Nov'){
            DateToMonth = '11'
        }
        else if(this.state.RoleCustomTo.toString().substr(4,3) === 'Dec'){
            DateToMonth = '12'
        }

        DateToDate = this.state.RoleCustomTo.toString().substr(8,2);
        DateToYear = this.state.RoleCustomTo.toString().substr(11,4);
        return DateToYear+DateToMonth+DateToDate;
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
        this.setState({Client:[...response]}, () => {
            if(this.props.Client === null || this.props.Client === ''){
                ;
            }
            else{
                this.setState({SelectedClient:this.props.Client})
            }
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
        this.setState({SelectedClient:value});
    }

    HandleOption = (value) => {
        if(value === 'p'){
            this.setState({RoleCustomFrom:'',RoleOneTime:false,RolePermanent:true, DateText:'please select date', 
            ButtonText:'Assign Role Permanent', RoleCustomTo:'', RoleCustom:false, TextValidToAutoComplete:'valid permanent'});
        }
        else if(value === 'o'){
            this.setState({RoleCustomFrom:'',RoleOneTime:true,RolePermanent:false, DateText:'please select date',
            ButtonText:'Assign Role One Time',RoleCustomTo:'', RoleCustom:false, TextValidToAutoComplete:'valid 1 hari'});
        }
        else if(value === 'c'){
            this.setState({RoleCustomFrom:'',RoleOneTime:false,RolePermanent:false, DateText:'please select date',
            ButtonText:'Assign Role Custom',RoleCustomTo:'', RoleCustom:true, TextValidToAutoComplete:'valid from '+DateFrom+' to '+DateTo});
        }
    }

    CustomOption = (flag ,value) => {
        if(flag === 'cf'){
            this.setState({RoleCustomFrom:value, RoleOneTime:false, RolePermanent:false});
        }
        else if(flag === 'ct'){
            this.setState({RoleCustomTo:value, RoleOneTime:false, RolePermanent:false});
        }
    }

    ConfirmBackToHome = () => {
        this.setState({BackToHomeEnabled:false}, ()=>{
            let TimeChangeMenuType = setInterval(() => {
                if(this.props.Valid !== '' || this.props.RoleName !== '' ||  this.props.RequestType == '' || this.props.ResetState == '' || this.props.SAPID == '' || this.props.client == '' || this.props.Request == '' || this.props.ScreenType !== 'HOME' || this.props.ScreenType === '' || this.props.ScreenType === null){
                    clearInterval(TimeChangeMenuType)
                    this.props.SelectMenuType('HOME')
                }
                else{
                    this.props.ChangeValid(this.state.TextValidToAutoComplete)
                    this.props.ChangeRoleName(this.state.SAPRole)
                    this.props.ChangeRequestType('');
                    this.props.ChangeResetState('');
                    this.props.ChangeSAPID('');
                    this.props.ChangeClient('');
                    this.props.MessageSend('');
                }
            }, 500)
        })
    }

    BackToHome = () => {
        if(this.state.BackToHomeEnabled === false){
            this.setState({Message:"You're not doing/change anything"})
        }
        else{
            Alert.alert(
                'Confirmation',
                'Are you sure all of your work is done?',
                [
                    {text:'OK', onPress:() => this.ConfirmBackToHome()},
                    {text:'Cancel', onPress:() => console.log('cancel')}
                ]
            )
        }
    }

    componentDidMount(){
        this.GetClient();
        this.GetKey();
    }

    render(){
        return(
            <Content underline={false}>
                <Form underline={false} style={styles.container}>
                    <Item floatingLabel>
                        <Label>Username</Label>
                        <Input onChangeText={(value) => this.setState({SAPUsername:value})} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Role</Label>
                        <Input onChangeText={(value) => this.setState({SAPRole:value})} />
                    </Item>
                    <Item style={{borderColor: '#ffffff'}}>
                        <Text>Client : </Text>
                        <Picker mode="dropdown" selectedValue={this.state.SelectedClient} onValueChange={(value) => this.HandleChangeValue(value)}>
                            {this.state.Client.map((Client) => <Picker.Item label={Client} value={Client} />)}
                        </Picker>
                    </Item>
                    <Item style={{borderColor: '#ffffff'}}>
                        <Radio selected={this.state.RoleOneTime} onPress={()=>this.HandleOption('o')}/>
                        <Left style={{marginLeft:25}}>
                            <Text>One Time</Text>
                        </Left>
                    </Item>
                    <Item style={{borderColor: '#ffffff'}}>
                        <Radio selected={this.state.RolePermanent} onPress={()=>this.HandleOption('p')}/>
                        <Left style={{marginLeft:25}}>
                            <Text>Permanent</Text>
                        </Left>
                    </Item>
                    <Item style={{borderColor: '#ffffff'}}>
                        <Radio selected={this.state.RoleCustom} onPress={()=>this.HandleOption('c')}/>
                        <Left style={{marginLeft:25}}>
                            <Text>Custom</Text>
                        </Left>
                    </Item>
                    {
                        this.state.RoleCustom ?
                        <Item>
                            <Left>
                                <DatePicker
                                    placeHolderText='Valid From'
                                    onDateChange={(date) => this.CustomOption('cf',date)} 
                                />
                            </Left>
                            <Body>
                                <DatePicker
                                    placeHolderText='Valid To'
                                    onDateChange={(date) => this.CustomOption('ct',date)} 
                                />
                            </Body>
                        </Item>
                        :
                        <Item>

                        </Item>
                    }
                    
                    <Item style={styles.ButtonContainer}>
                        <Button rounded style={styles.ButtonUnlock} onPress={()=> this.AssignSAPRole()}>
                            <Text>{this.state.ButtonText}</Text>
                        </Button>
                    </Item>
                    <Item style={styles.CheckBox}>
                        <Text>{this.state.Message}</Text>
                    </Item>
                </Form>
                <Card>
                    {
                        this.props.Request === '' ?
                        <CardItem bordered header>  
                            <Text>This action is not affiliate to request from ES</Text>
                        </CardItem>
                        :
                        <CardItem bordered button onPress={() => this.BackToHome()} header>  
                            <Text>This action is affiliate to request : {this.props.Link.toString().substr(35,20)} (Click here if you have done your work)</Text>
                        </CardItem>
                    }
                    <CardItem bordered>
                        <Body>
                            <Text accessible={true} selectable={true}>{this.props.Request + " client : " + this.props.Client}</Text>
                        </Body>
                    </CardItem>
                </Card>
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
    return{
        APIIP:state.reducer.APIIP,
        Request:state.reducer.Request,
        Client:state.reducer.Client,
        SAPID:state.reducer.SAPID,
        ResetState:state.reducer.ResetState,
        RequestType:state.reducer.RequestType,
        Link:state.reducer.Link,
        DoneState:state.reducer.DoneState,
        Valid:state.reducer.Valid,
        RoleName:state.reducer.RoleName
    }
}

const MapDispatchToProps = (dispatch) =>{
    return{
        ChangeValid : (valid) => {
            dispatch({type:'CHANGE_VALID_STATE', payload:valid})
        },
        ChangeRoleName : (RoleName) => {
            dispatch({type:'CHANGE_ROLE_NAME_STATE', payload:RoleName})
        },
        SelectMenuType : (type) => {
            dispatch({type:'CHANGE_SCREEN_TYPE', payload:type})
        },
        ChangeDoneState : (DoneState) => {
            dispatch({type:'CHANGE_DONE_STATE', payload:DoneState})
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

const AssignSAPRoleRedux = connect(MapStateToProps, MapDispatchToProps)(AssignSAPRole)

export default AssignSAPRoleRedux;