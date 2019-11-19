import { List, ListItem, Text, Form, Item, Label, Card, CardItem, Input, Button, Picker, Radio, Left, DatePicker, Content, Toast, Body, Spinner, Tabs, Tab, Container, Segment, Row} from 'native-base';
import React, { Component } from 'react';
import {Modal, StyleSheet, Dimensions, AsyncStorage, Keyboard, Alert, View, BackHandler} from 'react-native'; 
import {connect} from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {WebView} from 'react-native-webview';

const BackToHome = StackActions.pop({
    n:1
})

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

class CreateSAPID extends React.Component{
    state={
        SAPUsername:'',
        SelectedClient:'',
        Client:[],
        Username:'',
        AppUsername:'',
        Message:'',
        ButtonCreate:'Create New User',
        FromUser:'',
        FirstName:'',
        LastName:'',
        NIK:'',
        ValidFrom:'',
        ValidTo:'',
        UserGroup:'',
        Title:'',
        Department:'',
        Function:'',
        CreateNew:true,
        CopyNew:false,
        DeleteID:false,
        DeleteTicket:'',
        SAPIDListModalShow:false,
        SAPIDReplaceAvailable:[],
        LoadSAPIDReplacement:true,
        ReadyToReplace:false,
        ExistingSAPID:false,
        ReplaceSAPID:'',
        ReplaceTicket:'',
        ReplaceListModal:false,
        RequestTicket:'',
        ReplaceActiveSAPID:false,
        ActiveUserCheckStatus:'',
        CheckReplaceSAPIDString:'',
        ESTicket:'',
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
    
    HandleChangeValue = (value) => {
        //funsi ini untuk ganti value dropdown saat diganti
        this.setState({SelectedClient:value})
    }

    ValidationCreateNew = () => {
        if(this.state.CopyNew === true){
            console.log('copy ID baru')
            Alert.alert(
                'Replacement Confirmation',
                'This action are replace or create new?',
                [
                    {text:'CANCEL', onPress:() => this.CancelValidation()},
                    {text:'REPLACE', onPress:() => this.ValidationCreateNewStepTwoCopy()},
                    {text:'CREATE NEW', onPress:() => this.CreateSAPID()}
                ]
            )
        }
        else if(this.state.CreateNew === true){
            Alert.alert(
                'Replacement Confirmation',
                'This action are replace or create new?',
                [
                    {text:'CANCEL', onPress:() => this.CancelValidation()},
                    {text:'REPLACE', onPress:() => this.ValidationCreateNewStepTwo()},
                    {text:'CREATE NEW', onPress:() => this.CreateSAPID()}
                ]
            )
        }
        else if(this.state.DeleteID === true){
            this.CreateSAPID();
        }
    }

    ValidationCreateNewStepTwoCopy = () => {
        Alert.alert(
            'Replacement Confirmation Step Two',
            'Do you want to replace existing SAP ID or Other SAP ID?',
            [
                {text:'CANCEL', onPress:() => this.CancelValidation()},
                {text:'EXISTING', onPress:() => this.CopyNewReplaceAlreadyStepOne(this.state.FromUser)},
                {text:'OTHER SAP ID', onPress:() => this.ValidationCreateNewStepTwo()}
            ]
        )
    }

    ValidationCreateNewStepThreeCopy = (SAPID) => {
        Alert.alert(
            'Replacement Confirmation',
            'Are you sure want to replace '+SAPID+' ?',
            [
                {text:'YES', onPress:() => this.ReplaceUserValidation(SAPID)},
                {text:'NO', onPress:() => console.log('cancel')}
            ]
        )
    }

    CopyNewReplaceAlreadyStepOne = (SAPID) => {
        if(this.state.DeleteTicket === ''){
            this.setState({DeleteTicket:'replace'}, () => {
                Alert.alert(
                    'Replacement Confirmation',
                    'Are you sure want to replace '+SAPID+' ?',
                    [
                        {text:'YES', onPress:() => this.CopyNewReplaceAlreadyAction()},
                        {text:'NO', onPress:() => console.log('cancel')}
                    ]
                )
            })
        }
        else{
            Alert.alert(
                'Replacement Confirmation',
                'Are you sure want to replace '+SAPID+' ?',
                [
                    {text:'YES', onPress:() => this.CopyNewReplaceAlreadyAction()},
                    {text:'NO', onPress:() => console.log('cancel')}
                ]
            )
        }
        
    }

    CopyNewReplaceAlreadyAction = () => {
        this.setState({Message:'Waiting for result...'})
        fetch(this.props.APIIP + 'sapapi/basis/replaceSAPID.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                SAPclient:this.state.SelectedClient,
                webUsername:this.state.AppUsername,
                fromUser:this.state.FromUser,
                SAPusername:this.state.SAPUsername,
                firstName:this.state.FirstName,
                lastName:this.state.LastName,
                NIK:this.state.NIK,
                deleteTicket:this.state.DeleteTicket
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var APIresponse = responseJson.message
            this.setState({Message:APIresponse})
        }).catch((error) => {
            console.log(error);
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah saat copy',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    ValidationCreateNewStepTwo = () => {
        this.setState({LoadSAPIDReplacement:true},()=>{
            fetch(this.props.APIIP + 'sapapi/basis/showSAPIDStat.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    SAPclient:this.state.SelectedClient
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                var response = responseJson.message 
                var available = responseJson.available
                if(available === 'true'){
                    this.setState({SAPIDReplaceAvailable:[...response]}, ()=>{
                        this.setState({LoadSAPIDReplacement:false});
                    })
                }
                else if(available === 'false'){
                    this.setState({LoadSAPIDReplacement:false});
                }
            }).catch((error) => {
                Toast.show({
                    text:'tidak terhubung ke jaringan / server bermasalah',
                    buttonText:'Okay',
                    type:'warning',
                    duration:3000
                })
            })
    
            this.setState({ReplaceListModal:true});
        });
    }

    ValidationCreateNewStepThree = (SAPID) => {
        Alert.alert(
            'Replacement Confirmation',
            'Are you sure want to replace '+SAPID+' ?',
            [
                {text:'YES', onPress:() => this.ReplaceUserValidation(SAPID)},
                {text:'NO', onPress:() => console.log('cancel')}
            ]
        )
    }

    CancelValidation = () =>{
        this.setState({ReplaceListModal:false, SAPIDReplaceAvailable:[]});
    }

    ReplaceUserValidationFetchFunction = (SAPID) => {
        fetch(this.props.APIIP + 'sapapi/basis/logReplaceSAPID.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                SAPclient:this.state.SelectedClient,
                IDOld:SAPID,
                IDNew:this.state.SAPUsername,
                TicketReplace: this.state.RequestTicket
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var response = responseJson.message;
            this.CreateSAPID();
        }).catch((error) => {
            console.log(error)
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    ReplaceUserValidation = (SAPID) => {
        if(this.props.Link === '' || this.props.Link === null){
            this.setState({RequestTicket:'null'},() => {
                this.setState({ReplaceListModal:false})
                this.ReplaceUserValidationFetchFunction(SAPID)
            });
        }
        else{
            this.setState({RequestTicket:this.props.Link}, () => {
                this.setState({ReplaceListModal:false})
                this.ReplaceUserValidationFetchFunction(SAPID)
            });
        }
    }

    CreateSAPID = () => {
        Keyboard.dismiss();
        this.setState({Message:'Waiting for result...'});
        if(this.state.CopyNew === true){
            if(this.state.FromUser === '' || this.state.SAPclient === '' || this.state.LastName === '' || this.state.NIK === '' || this.state.SAPUsername === ''){
                this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
            }
            else{
                fetch(this.props.APIIP + 'sapapi/basis/createSAPID.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        copyuser:this.state.CopyNew.toString(),
                        SAPclient:this.state.SelectedClient,
                        webUsername:this.state.AppUsername,
                        fromUser:this.state.FromUser,
                        SAPusername:this.state.SAPUsername,
                        firstName:this.state.FirstName,
                        lastName:this.state.LastName,
                        NIK:this.state.NIK,
                        validFrom:this.DateParseFrom(),
                        validTo:this.DateParseTo(),
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var APIresponse = responseJson.message
                    this.setState({Message:responseJson.message});
                }).catch((error) => {
                    console.log(error);
                    Toast.show({
                        text:'tidak terhubung ke jaringan / server bermasalah saat copy',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                })
            }
        }
        else if(this.state.CreateNew === true){
            if(this.state.Title === '' || this.state.SAPclient === '' || this.state.LastName === '' || this.state.NIK === '' || this.state.SAPUsername === '' || this.state.Department === '' || this.state.Function === ''){
                this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
            }
            else{
                fetch(this.props.APIIP + 'sapapi/basis/createSAPID.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                            copyuser:this.state.CopyNew.toString(),
                            SAPclient:this.state.SelectedClient,
                            webUsername:this.state.AppUsername,
                            SAPusername:this.state.SAPUsername,
                            validFrom:this.DateParseFrom(),
                            validTo:this.DateParseTo(),
                            userGroup:this.state.UserGroup,
                            title:this.state.Title,
                            firstName:this.state.FirstName,
                            lastName:this.state.LastName,
                            departement:this.state.Department,
                            functions:this.state.Function,
                            NIK:this.state.NIK,
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var APIresponse = responseJson.message
                    this.setState({Message:responseJson.message});
                }).catch((error) => {
                    console.log(error);
                    Toast.show({
                        text:'tidak terhubung ke jaringan / server bermasalah saat create',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                })
            }
        }
        else if(this.state.DeleteID === true){
            if(this.props.Link !== ''){
                this.setState({DeleteTicket:this.props.Link})
            }
            else{
                ;
            }

            if(this.state.SAPclient === '' || this.state.SAPUsername === ''){
                this.setState({Message:'Tolong lengkapi formnya, terima kasih'});
            }
            else{
                fetch(this.props.APIIP + 'sapapi/basis/deleteSAPID.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        SAPclient:this.state.SelectedClient,
                        webUsername:this.state.AppUsername,
                        SAPusername:this.state.SAPUsername.toUpperCase(),
                        deleteTicket:this.state.DeleteTicket,
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var APIresponse = responseJson.message
                    this.setState({Message:responseJson.message});
                }).catch((error) => {
                    console.log(error);
                    Toast.show({
                        text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                })
            }
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

    ConfirmBackToHome = () => {
        let TimeChangeMenuType = setInterval(() => {
            if(this.props.ScreenType !== 'HOME' || this.props.ScreenType === '' || this.props.ScreenType === null){
                clearInterval(TimeChangeMenuType)
                this.props.SelectMenuType('HOME')
            }
            else{
                ;
            }
        }, 500)
    }

    BackToHome = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure all of your work is done?',
            [
                {text:'OK', onPress:() => this.ConfirmBackToHome()},
                {text:'Cancel', onPress:() => console.log('cancel')}
            ]
        )
    }

    componentDidMount(){
        this.GetClient();
        this.GetKey();
        if(this.props.Link === '' || this.props.Link === null){
            ;
        }
        else{
            this.setState({DeleteTicket:this.props.Link});
        }
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

    HandleBackButton = () => {
        this.props.navigation.dispatch(BackToHome);
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    componentDidUpdate(PrevProps){
        if(this.props.Request === PrevProps.Request){
        }
        else{
            this.setState({UnlockDisabled:false, LockDisabled:false, ExtendDisabled:false})
            console.log("ada perubahan message")
        }
    }

    HandleOption = (value) => {
        if(value === 'n'){
            this.setState({CreateNew:true, CopyNew:false, DeleteID:false, ButtonCreate:'Create New User'});
        }
        else if(value === 'c'){
            this.setState({CreateNew:false, CopyNew:true, DeleteID:false, ButtonCreate:'Copy New User'});
        }
        else if(value === 'd'){
            this.setState({CreateNew:false, CopyNew:false, DeleteID:true, ButtonCreate:'Delete User ID'});
        }
    }

    DateParseFrom = () => {
        var DateNowMonth = null
        let DateNowYear = null
        let DateNowDate = null
        if(this.state.ValidFrom.toString().substr(4,3) === 'Jan'){
            DateNowMonth = '01'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Feb'){
            DateNowMonth = '02'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Mar'){
            DateNowMonth = '03'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Apr'){
            DateNowMonth = '04'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'May'){
            DateNowMonth = '05'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Jun'){
            DateNowMonth = '06'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Jul'){
            DateNowMonth = '07'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Aug'){
            DateNowMonth = '08'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Sep'){
            DateNowMonth = '09'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Oct'){
            DateNowMonth = '10'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Nov'){
            DateNowMonth = '11'
        }
        else if(this.state.ValidFrom.toString().substr(4,3) === 'Dec'){
            DateNowMonth = '12'
        }
        else if(this.state.ValidFrom.toString() === ''){
            DateNowMonth='00'
        }
        
        if(this.state.ValidFrom.toString() !== ''){
            DateNowDate = this.state.ValidFrom.toString().substr(8,2);
            DateNowYear = this.state.ValidFrom.toString().substr(11,4);
        }
        else{
            DateNowDate = '00';
            DateNowYear = '0000';
        }
        
        return DateNowYear+DateNowMonth+DateNowDate;
    }

    DateParseTo = () => {
        let DateToMonth = null
        let DateToYear = null
        let DateToDate = null
        if(this.state.ValidTo.toString().substr(4,3) === 'Jan'){
            DateToMonth = '01'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Feb'){
            DateToMonth = '02'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Mar'){
            DateToMonth = '03'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Apr'){
            DateToMonth = '04'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'May'){
            DateToMonth = '05'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Jun'){
            DateToMonth = '06'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Jul'){
            DateToMonth = '07'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Aug'){
            DateToMonth = '08'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Sep'){
            DateToMonth = '09'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Oct'){
            DateToMonth = '10'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Nov'){
            DateToMonth = '11'
        }
        else if(this.state.ValidTo.toString().substr(4,3) === 'Dec'){
            DateToMonth = '12'
        }
        else if(this.state.ValidTo.toString() === ''){
            DateToMonth='12'
        }

        if(this.state.ValidTo.toString() !== ''){
            DateToDate = this.state.ValidTo.toString().substr(8,2);
            DateToYear = this.state.ValidTo.toString().substr(11,4);
        }
        else{
            DateToDate = '31';
            DateToYear = '9999';
        }
        return DateToYear+DateToMonth+DateToDate;
    }

    ValidUser = (flag ,value) => {
        if(flag === 'vf'){
            this.setState({ValidFrom:value});
        }
        else if(flag === 'vt'){
            this.setState({ValidTo:value});
        }
    }

    ModalController = () => {
        this.setState({SAPIDReplaceAvailable:[], LoadSAPIDReplacement:true}, () => {
            if(this.state.SAPIDListModalShow === true){
                this.setState({SAPIDListModalShow:false})
            }
            else if(this.state.SAPIDListModalShow === false){
                this.setState({SAPIDListModalShow:true})
                fetch(this.props.APIIP + 'sapapi/basis/showSAPIDStat.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        SAPclient:this.state.SelectedClient
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var response = responseJson.message 
                    var available = responseJson.available
                    if(available === 'true'){
                        this.setState({SAPIDReplaceAvailable:[...response]}, ()=>{
                            console.log(this.state.SAPIDReplaceAvailable)
                            this.setState({LoadSAPIDReplacement:false});
                        })
                    }
                    else if(available === 'false'){
                        this.setState({LoadSAPIDReplacement:false});
                        //this.setState({SAPIDReplaceAvailable:[{'sap_id':response, 'departement':response, 'function':response}]})
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
        });
    }

    HandleReplaceTypeFrom = (flag) =>{
        this.setState({ActiveUserCheckStatus:''});
        if(flag === 'd'){
            this.setState({ReplaceActiveSAPID:false});
        }
        else if(flag === 'a'){
            this.setState({ReplaceActiveSAPID:true})
        }
    }

    CheckIfActiveSAPIDExisting = () => {
        this.setState({ActiveUserCheckStatus:'waiting for result...'});
        fetch(this.props.APIIP + 'sapapi/basis/checkSAPIDAvailable.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                SAPclient:this.state.SelectedClient,
                SAPID:this.state.CheckReplaceSAPIDString.toUpperCase(),
                webUsername:this.state.AppUsername,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var APIresponse = responseJson.message
            if(APIresponse === 'true'){
                this.setState({ActiveUserCheckStatus:''});
                Alert.alert(
                    'Replacement Confirmation',
                    'Are you sure want to replace '+this.state.CheckReplaceSAPIDString.toUpperCase()+' ?',
                    [
                        {text:'YES', onPress:() => this.DeleteSAPIDFromReplace(this.state.SAPUsername.toUpperCase() , this.state.CheckReplaceSAPIDString.toUpperCase())},
                        {text:'NO', onPress:() => console.log('cancel')}
                    ]
                )
            }
            else if(APIresponse === 'false'){
                this.setState({ActiveUserCheckStatus:'SAP ID tidak ada'})
            }
            else{
                this.setState({ActiveUserCheckStatus:APIresponse})
            }
        }).catch((error) => {
            console.log(error);
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    DeleteSAPIDFromReplace = (NewSAPID, OldSAPID) => {
        let ReplaceTicket;
        if(this.props.Link === '' || this.props.Link === null)
        {
            ReplaceTicket = 'null';
        }
        else{
            ReplaceTicket = this.props.Link;
        }
        fetch(this.props.APIIP + 'sapapi/basis/deleteSAPIDFromReplace.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                SAPclient:this.state.SelectedClient,
                webUsername:this.state.AppUsername,
                SAPusername:OldSAPID.toUpperCase(),
                deleteTicket:this.state.DeleteTicket,
                ReplaceSAPID:NewSAPID.toUpperCase(),
                ReplaceTicket:ReplaceTicket,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var APIresponse = responseJson.message
            this.CreateSAPID();
            this.setState({ReplaceListModal:false});
        }).catch((error) => {
            console.log(error);
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    CheckUserExistOrNot = () => {
        Keyboard.dismiss();
        this.setState({Message:''});
        if(this.state.CopyNew === true){
            if(this.state.FromUser === '' || this.state.SAPclient === '' || this.state.LastName === '' || this.state.NIK === '' || this.state.SAPUsername === '' ){
                Alert.alert(
                    'Form not Complete',
                    'Tolong lengkapi formnya, terima kasih',
                    [
                        {text:'OK', onPress:() => console.log('cancel')}
                    ]
                )
            }
            else{
                fetch(this.props.APIIP + 'sapapi/basis/checkSAPIDAvailable.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        SAPclient:this.state.SelectedClient,
                        SAPID:this.state.SAPUsername.toUpperCase(),
                        webUsername:this.state.AppUsername,
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var APIresponse = responseJson.message
                    console.log(APIresponse)
                    if(APIresponse === 'true'){
                        Alert.alert(
                            'SAP ID Exist',
                            'SAP ID Exist, cannot create with same ID',
                            [
                                {text:'OK', onPress:() => console.log('cancel')}
                            ]
                        )
                    }
                    else if(APIresponse === 'false'){
                        this.CopyFromUserCheckAvailability();
                    }
                    else{
                        this.setState({Message:APIresponse})
                    }
                }).catch((error) => {
                    console.log(error);
                    Toast.show({
                        text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                })
            }
        }
        else if(this.state.CreateNew === true){
            if(this.state.Title === '' || this.state.SAPclient === '' || this.state.LastName === '' || this.state.NIK === '' || this.state.SAPUsername === '' || this.state.Department === '' || this.state.Function === ''){
                Alert.alert(
                    'Form not Complete',
                    'Tolong lengkapi formnya, terima kasih',
                    [
                        {text:'OK', onPress:() => console.log('cancel')}
                    ]
                )
            }
            else{
                fetch(this.props.APIIP + 'sapapi/basis/checkSAPIDAvailable.php', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        SAPclient:this.state.SelectedClient,
                        SAPID:this.state.SAPUsername.toUpperCase(),
                        webUsername:this.state.AppUsername,
                    }),
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var APIresponse = responseJson.message
                    console.log(APIresponse)
                    if(APIresponse === 'true'){
                        Alert.alert(
                            'SAP ID Exist',
                            'SAP ID Exist, cannot create with same ID',
                            [
                                {text:'OK', onPress:() => console.log('cancel')}
                            ]
                        )
                    }
                    else if(APIresponse === 'false'){
                        this.ValidationCreateNew();
                    }
                    else{
                        this.setState({Message:APIresponse})
                    }
                }).catch((error) => {
                    console.log(error);
                    Toast.show({
                        text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                })
            }
        }
        else if(this.state.DeleteID === true){
            if(this.state.DeleteTicket === '' || this.state.SAPclient === '' || this.state.SAPUsername === ''){
                Alert.alert(
                    'Form not Complete',
                    'Tolong lengkapi formnya, terima kasih',
                    [
                        {text:'OK', onPress:() => console.log('cancel')}
                    ]
                )
            }
            else{
                this.CreateSAPID();
            }
        }
    }

    CopyFromUserCheckAvailability = () => {
        fetch(this.props.APIIP + 'sapapi/basis/checkSAPIDAvailable.php', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                SAPclient:this.state.SelectedClient,
                SAPID:this.state.SAPUsername.toUpperCase(),
                webUsername:this.state.AppUsername,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var APIresponse = responseJson.message
            console.log(APIresponse)
            if(APIresponse === 'true'){
                Alert.alert(
                    'SAP ID Not Exist',
                    this.state.FromUser+', not exist',
                    [
                        {text:'OK', onPress:() => console.log('cancel')}
                    ]
                )
            }
            else if(APIresponse === 'false'){
                this.ValidationCreateNew();
            }
            else{
                this.setState({Message:APIresponse})
            }
        }).catch((error) => {
            console.log(error);
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah saat delete',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    render(){
        const SAPIDList =() => {
            return(
                <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.SAPIDListModalShow}
                style={{height:250, width:100}}>
                    {
                        this.state.LoadSAPIDReplacement ?
                        <Spinner color='red'/>
                        :
                        <List>
                            {
                                this.state.SAPIDReplaceAvailable.length === 0 ?
                                <ListItem>
                                    <Text>'No SAP ID available for replace</Text>
                                </ListItem>
                                :
                                this.state.SAPIDReplaceAvailable.map((SAPID, index) => 
                                    <ListItem>
                                        <Text>{SAPID['sap_id'] + ' - ' + SAPID['NIK'] + ' - ' + SAPID['departement']}</Text>
                                    </ListItem>
                                )
                            }
                        </List>
                    }
                    <Button onPress={() => {this.ModalController()}}>
                        <Text>Close</Text>
                    </Button>
                </Modal>
            )
        }

        const screen = () => {
            if(this.state.CreateNew === true){
                return(
                    <Item style={{flexDirection:'column'}}>
                        <Item floatingLabel>
                            <Label>Title</Label>
                            <Input onChangeText={(value) => this.setState({Title:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>First Name</Label>
                            <Input onChangeText={(value) => this.setState({FirstName:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Last Name</Label>
                            <Input onChangeText={(value) => this.setState({LastName:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Function</Label>
                            <Input onChangeText={(value) => this.setState({Function:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Departement</Label>
                            <Input onChangeText={(value) => this.setState({Department:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>NIK</Label>
                            <Input onChangeText={(value) => this.setState({NIK:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>User Group</Label>
                            <Input onChangeText={(value) => this.setState({UserGroup:value})} />
                        </Item>
                        
                        <Item>
                            <Left>
                                <DatePicker
                                    placeHolderText='Valid From'
                                    onDateChange={(date) => this.ValidUser('vf',date)} 
                                />
                            </Left>
                            <Body>
                                <DatePicker
                                    placeHolderText='Valid To'
                                    onDateChange={(date) => this.ValidUser('vt',date)} 
                                />
                            </Body>
                        </Item>
                    </Item>
                )
            }
            else if(this.state.CopyNew === true){
                return(
                    <Item style={{flexDirection:'column'}}>
                        <Item floatingLabel>
                            <Label>From Username</Label>
                            <Input maxLength={12} onChangeText={(value) => this.setState({FromUser:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>First Name</Label>
                            <Input onChangeText={(value) => this.setState({FirstName:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Last Name</Label>
                            <Input onChangeText={(value) => this.setState({LastName:value})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>NIK</Label>
                            <Input onChangeText={(value) => this.setState({NIK:value})} />
                        </Item>

                        <Item>
                            <Left>
                                <DatePicker
                                    placeHolderText='Valid From'
                                    onDateChange={(date) => this.ValidUser('vf',date)} 
                                />
                            </Left>
                            <Body>
                                <DatePicker
                                    placeHolderText='Valid To'
                                    onDateChange={(date) => this.ValidUser('vt',date)} 
                                />
                            </Body>
                        </Item>
                    </Item>
                )
            }
            else if(this.state.DeleteID === true){
                return(
                    <Item style={{flexDirection:'column'}}>
                        <Item floatingLabel>
                            <Label>Delete Notes</Label>
                            <Input value={this.state.DeleteTicket} onChangeText={(value) => this.setState({DeleteTicket:value})} />
                        </Item>
                    </Item>
                );
            }
        }
        return(
            <View style={{flex:1}}>
                <Content underline={false}>
                    <Modal
                        transparent={false}
                        visible={this.state.ReplaceListModal}
                        animationType="slide"
                    >
                        {
                            this.state.ReplaceActiveSAPID !== true ?
                            <View style={{flex:1, flexDirection:'column'}}>
                                <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                                    <Text style={{textDecorationLine:'underline'}} onPress={() => this.HandleReplaceTypeFrom('d')}>Deleted</Text>
                                    <Text onPress={() => this.HandleReplaceTypeFrom('a')}>Active User</Text>
                                </View>
                                <View style={{flex:10}}>
                                    {
                                        this.state.LoadSAPIDReplacement ?
                                        <Spinner color='red'/>
                                        :
                                        <List>
                                            {
                                                this.state.SAPIDReplaceAvailable.length === 0 ?
                                                <ListItem>
                                                    <Text>'No SAP ID available for replace</Text>
                                                </ListItem>
                                                :
                                                this.state.SAPIDReplaceAvailable.map((SAPID, index) => 
                                                    <ListItem onPress={()=>{this.ValidationCreateNewStepThree(SAPID['sap_id'])}}>
                                                        <Text>{SAPID['sap_id'] + ' - ' + SAPID['NIK'] + ' - ' + SAPID['departement']}</Text>
                                                    </ListItem>
                                                )
                                            }
                                        </List>
                                    }
                                </View>
                            </View>
                            :
                            <View style={{flex:1, flexDirection:'column'}}>
                                <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                                    <Text onPress={() => this.HandleReplaceTypeFrom('d')}>Deleted</Text>
                                    <Text style={{textDecorationLine:'underline'}} onPress={() => this.HandleReplaceTypeFrom('a')}>Active User</Text>
                                </View>
                                <View style={{flex:10}}>
                                    <Item floatingLabel>
                                        <Label>Username</Label>
                                        <Input onChangeText={(value) => {this.setState({CheckReplaceSAPIDString:value})}}/>
                                    </Item>
                                    <Item  style={{alignItems:'stretch'}}>
                                        <Button onPress={()=>this.CheckIfActiveSAPIDExisting()}>
                                            <Text>Check User</Text>
                                        </Button>
                                    </Item>
                                    <Text style={{color:'red'}}>{this.state.ActiveUserCheckStatus}</Text>
                                </View>
                            </View>
                        }
                        <Button onPress={() => {this.CancelValidation()}}>
                            <Text>Cancel Action</Text>
                        </Button>
                    </Modal>

                    {SAPIDList()}
                    <Form underline={false} style={styles.container}>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input maxLength={12} onChangeText={(value) => this.setState({SAPUsername:value})} />
                        </Item>
                        <Item style={{borderColor: '#ffffff'}}>
                            <Text>Client : </Text>
                            <Picker mode="dropdown" selectedValue={this.state.SelectedClient} onValueChange={(value) => this.HandleChangeValue(value)}>
                                {this.state.Client.map((Client) => <Picker.Item label={Client} value={Client} />)}
                            </Picker>
                        </Item>
                        <Item style={{borderColor: '#ffffff'}}>
                            <Button onPress={() => {this.ModalController()}}>
                                <Text>Replaceable SAP ID List</Text>
                            </Button>
                        </Item>
                        <View style={styles.SelectBoxContainer}>
                            <Item style={{borderColor: '#ffffff', flex:0.5, alignSelf:'center',}}>
                                <Radio selected={this.state.CreateNew} onPress={()=>this.HandleOption('n')}/>
                                <Left style={{marginLeft:10}}>
                                    <Text>Create New</Text>
                                </Left>
                            </Item>

                            <Item style={{borderColor: '#ffffff', flex:0.5, alignSelf:'center',}}>
                                <Radio selected={this.state.CopyNew} onPress={()=>this.HandleOption('c')}/>
                                <Left style={{marginLeft:10}}>
                                    <Text>Copy User</Text>
                                </Left>
                            </Item>

                            <Item style={{borderColor: '#ffffff', flex:0.5, alignSelf:'center',}}>
                                <Radio selected={this.state.DeleteID} onPress={()=>this.HandleOption('d')}/>
                                <Left style={{marginLeft:10}}>
                                    <Text>Delete User</Text>
                                </Left>
                            </Item>
                        </View>
                        {screen()}
                        <Item style={styles.ButtonContainer}>
                            <Button rounded style={styles.ButtonUnlock} onPress={()=> this.CheckUserExistOrNot()}>
                                <Text>{this.state.ButtonCreate}</Text>
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
                                <Text>This action is affiliate to request : {this.props.Link} (Click here if you have done your work)</Text>
                            </CardItem>
                        }
                        <CardItem bordered>
                            <Body>
                                <Text accessible={true} selectable={true}>{this.props.Request + " client : " + this.props.Client}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                {
                    this.props.Request === '' ?
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
    SelectBoxContainer:{
        flexDirection:'row',
        flex:1
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

const CreateSAPIDRedux = connect(MapStateToProps, MapDispatchToProps)(CreateSAPID)

export default withNavigation(CreateSAPIDRedux);
