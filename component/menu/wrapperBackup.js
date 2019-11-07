import React, {Component} from 'react';
import { withNavigation } from 'react-navigation';
import {Container, Text, Card, Spinner, Drawer, Button, Header, Left, Icon, Toast, Body, View, Right, Root, Content, CardItem, Switch, Input} from 'native-base';
import {StyleSheet, RefreshControl, Dimensions, BackHandler, Animated, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import SideBar from './drawer.js';
import {connect} from 'react-redux';
import UnlockSAPID from './basis/unlocksapid.js';
import RegisterSAPID from './basis/registersapid.js';
import AssignSAPRole from './basis/assignsaprole.js';
import CreateSAPID from './basis/createsapid.js';

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
let AlwaysGrabRequest;

const JSScriptConstValue = "window.ReactNativeWebView.postMessage(document.getElementById('content_edco').innerHTML);";

class MenuApp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ScreenType:'',
            SAPUsername:'',
            test:'',
            HTML:'',
            HTMLParser:null,
            RequestNumber:[],
            ListKosong:true,
            WebViewSize: new Animated.Value(2),
            CardSize:new Animated.Value(0),
            WebViewMode:true,
            JSScriptState:JSScriptConstValue,
            RequestHTMLParser:null,
            JSParameter:'',
            SAPClientHTMLParser:null,
            WebLink:'https://es.cp.co.id/mybox.php',
            DoneValue:'',
            AutofillState:'',
            loading:false,
            refreshing:false,
            EsPassword:'',
            AppUsername:'',
            DoneRequestButtonDisabled:true,
            DoneRequestButtonVisible:true,
            LinkNow:'',
            CardClicked:null,
            CardClickValue:'',
            CardClickRequest:'',
            LoadDone:false,
            ConvertToList:false,
        }
    }

    CloseDrawer = () => {
        this.drawer._root.close()
    }

    OpenDrawer = () => {
        this.drawer._root.open()
    }

    DecryptSendPassword = (value) => {
        var CryptoJS = require('crypto-js');
        var hashedkey = CryptoJS.SHA256("KUNCIUNTUKMASUKES69#").toString();
        var hashediv = CryptoJS.SHA256("99%GARAMASINBUATES").toString().substr(0,16);
        var key = CryptoJS.enc.Hex.parse(hashedkey);
        var iv = CryptoJS.enc.Hex.parse(hashediv);
        var AESdecrypt = CryptoJS.AES.decrypt(value, key, {iv:iv, padding:CryptoJS.pad.Pkcs7});
        return AESdecrypt.toString(CryptoJS.enc.Utf8);
    }

    async GetKey(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    this.setState({AppUsername:ResultParsed.username})
                    this.setState({EsPassword:this.DecryptSendPassword(ResultParsed.espassword)})
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

    Loadweb = (value) =>{
        if(this.state.LoadDone === true && this.state.ConvertToList === true){
            const HTMLParser = require('fast-html-parser');
            var root = HTMLParser.parse(value);
            if(this.state.JSScriptState === JSScriptConstValue){
                if(root.querySelector('.general_table') === '' || root.querySelector('.general_table') === null){
                    if(this.state.ListKosong === false){
                        //this.setState({ListKosong:true});
                    }
                    else{
                        //this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('content_ur').innerHTML);"});
                        ;
                    }
                }
                else{   
                    if(this.state.HTMLParser === null || this.state.HTMLParser === ''){
                        ;
                        this.setState({HTMLParser:root.querySelector('.general_table'), ListKosong:false})
                    }
                    else{
                        ;
                    }
                }
            }
            else{
                //console.log(root.querySelector('.general_table'));
            }
        }
        else{
            ;//console.log('loading belum beres');
        }
    }

    LoadRequest = (value) =>{
        const HTMLParser = require('fast-html-parser');

        var root = HTMLParser.parse(value);

        this.setState({RequestHTMLParser:root.querySelector('#content_form')})
    }

    GetSAPClient = (value) => {
        this.setState({SAPClientHTMLParser:value}, () => {
            if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"){
                if(value.toString().length > 3){
                    ;
                }
                else{
                    this.props.ChangeClient(value)
                }
            }
            else if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID1').value);"){
                if(value.toString().length > 12){
                    ;
                }
                else{
                    var regex = /(\b[A-z.])\w+/g;
                    if(regex.test(value) === false){
                        ;
                    }
                    else{
                        this.props.ChangeSAPID(value)
                    }
                }
            }
            else if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID').value);"){
                if(value.toString().length > 12){
                    ;
                }
                else{
                    var regex = /([A-z.])\w+/
                    if(regex.test(value) === false){
                        ;
                    }
                    else{
                        this.props.ChangeSAPID(value)
                    }
                }
            }
            else if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('cbReset').checked);"){
                if(value === true || value.toString() === 'true'){
                    this.props.ChangeResetState(value)
                }
                else if(value === false || value.toString() === 'false'){
                    this.props.ChangeResetState(value)
                }
                else{
                    //console.log(value);
                }
            }
            else{
                ;//console.log(value);
            }
        })
    }

    GetLink = (value) => {
        if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(window.location.href)"){
            if(value === '' || value === null){
                ;
            }
            else{
                this.setState({LinkNow:value})
            }
        }
        else{
            ;
        }
    }

    GetHTML = (value, JSScript) => {
        this.webview.injectJavaScript(JSScript);
        this.setState({HTML:value}, () => {
            this.Loadweb(this.state.HTML);
            this.LoadRequest(this.state.HTML);
            this.GetSAPClient(this.state.HTML);
            this.GetLink(this.state.HTML);
        });
    }

    OnChangeSwitch = () => {
        this.setState({refreshing:true});
        this.webview.injectJavaScript("location.replace('https://es.cp.co.id/mybox.php')");
        let ClearRequestMessage = setInterval(() => {
            if(this.props.Request !== '' || this.props.Link !== 'https://es.cp.co.id/mybox.php'){
                this.props.MessageSend('');
                this.props.ChangeLink('https://es.cp.co.id/mybox.php');
            }
            else{
                clearInterval(ClearRequestMessage)
                let ClearRequestType = setInterval(() => {
                    if(this.props.RequestType !== '' || this.props.SAPID !== '' || this.props.Client !== '' || this.props.ResetState !== ''){
                        this.props.ChangeRequestType('');
                        this.props.ChangeSAPID('');
                        this.props.ChangeClient('');
                        this.props.ChangeResetState('');
                    }
                    else{
                        clearInterval(ClearRequestType)
                        this.setState({JSScriptState:JSScriptConstValue, RequestNumber:[], ConvertToList:true}, () => {
                            if(this.state.WebViewMode === true){
                                this.setState({WebViewMode:false, DoneRequestButtonVisible:false}, () => {
                                    let RequestNumberMustEmpty = setInterval(()=>{
                                        if(this.state.RequestNumber.length !== 0){
                                            this.setState({RequestNumber:[]});
                                        }
                                        else{
                                            clearInterval(RequestNumberMustEmpty);
                                            Animated.timing(this.state.WebViewSize,{
                                                toValue:0,
                                                duration:500
                                            }).start();
                                            Animated.timing(this.state.CardSize,{
                                                toValue:2,
                                                duration:500
                                            }).start();
                                        }
                                    }, 500);
                                    this.RefreshRequest();
                                })
                            }
                            else{
                                this.setState({WebViewMode:true, DoneRequestButtonVisible:true, RequestNumber:[], ConvertToList:false}, () => {
                                    Animated.timing(this.state.WebViewSize,{
                                        toValue:2,
                                        duration:500
                                    }).start();
                                    Animated.timing(this.state.CardSize,{
                                        toValue:0,
                                        duration:500
                                    }).start();
                                    this.setState({refreshing:false})
                                })
                            }
                        });
                    }
                },500)
            }
        },500)
    }

    RefreshRequest = () => {
        this.webview.injectJavaScript("location.reload()");
        if(this.state.refreshing === true && this.state.SAPClientHTMLParser === null){
            ;
        }
        else{
            this.setState({refreshing:true, SAPClientHTMLParser:null, RequestNumber:[]}, ()=>{
                this.GetRequestFunction();
            });
        }
    }

    GetRequestFunction = () =>{
        clearInterval(AlwaysGrabRequest);
        this.setState({JSScriptState:JSScriptConstValue}, () => {
            AlwaysGrabRequest = setInterval(() => {
                if(this.state.HTMLParser === null || this.state.HTMLParser === ''){
                    ;//this.setState({loading:true});
                    if(this.state.ListKosong === false){
                        this.setState({ListKosong:true})
                    }
                    else{
                        ;
                    }
                }
                else{
                    clearInterval(AlwaysGrabRequest);
                    try{
                        var TotalRequest = this.state.HTMLParser['childNodes'][1]['childNodes'].length - 4;
                
                        let append = [];
                        for(let i = 0; i < TotalRequest; i++){
                            let j = i + 4;
                            append.push(this.state.HTMLParser['childNodes'][1]['childNodes'][j])
                        }
                        
                        if(append.length === 0){
                            this.setState({ListKosong:true, loading:false, refreshing:false, HTMLParser:''});
                            append.length = 0;
                        }
                        else{
                            this.setState({RequestNumber:[...append]}, () => {
                                append.length = 0;
                                this.setState({HTMLParser:'', ListKosong:false, loading:false, refreshing:false});
                            });
                        }
    
                    }
                    catch(e){
                        this.OnChangeSwitch();
                    }
                }
            }, 500)
        });
    }

    CardClickStatus = (value, request) =>{
        this.setState({loading:true, DoneRequestButtonVisible:true, CardClickValue:value, CardClickRequest:request, CardClicked:true}, ()=> {
            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('page_title').innerHTML);"}, ()=>{
                this.webview.injectJavaScript("window.ReactNativeWebView.postMessage(window.location.replace('https://es.cp.co.id/edco.php?ecsno="+value+"'));");
            })
        });
    }   

    CardClick = (value, request) => {
        this.setState({CardClicked:false})
        let Get;
        this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('page_title').innerHTML);"}, () =>{
            Get = setInterval(()=>{
                if(this.state.RequestHTMLParser === null || this.state.RequestHTMLParser === ''){
                    ;
                }
                else{
                    clearInterval(Get);
                    let RequestValue = this.state.RequestHTMLParser['childNodes'][1]['childNodes'][1]['childNodes'][1]['childNodes'][16]['rawAttrs'].toString();
                    if(RequestValue.includes("DA105")){
                        let GetClientInterval = setInterval(() => {
                            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"},() => {
                                if(this.props.Client === null || this.props.Client == ''){
                                    ;
                                }
                                else{
                                    this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID1').value);"}, () =>{
                                        let GetSAPID = setInterval(() => {
                                            if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID1').value);"){
                                                if(this.props.SAPID === '' || this.props.SAPID === null){
                                                }
                                                else{
                                                    this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('cbReset').checked);"}, () => {
                                                        let GetResetState = setInterval(() => {
                                                            if(this.state.JSScriptState !== "window.ReactNativeWebView.postMessage(document.getElementById('cbReset').checked);"){
                                                            }
                                                            else{
                                                                if(this.props.ResetState === '' | this.props.ResetState === null){
                                                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                                                }
                                                                else{
                                                                    if(this.props.ResetState === true || this.props.ResetState === 'true'){
                                                                        this.props.ChangeRequestType("UNLOCKRESET");
                                                                    }
                                                                    else if(this.props.ResetState === false || this.props.ResetState === 'false'){
                                                                        this.props.ChangeRequestType("UNLOCK")
                                                                    }
                                                                    clearInterval(GetResetState);
                                                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                                                    this.props.SelectMenuType("UNLOCKSAPID");
                                                                    this.setState({loading:false});
                                                                    this.setState({WebViewMode:true}, () => {
                                                                        this.setState({JSScriptState:JSScriptConstValue});
                                                                        Animated.timing(this.state.WebViewSize,{
                                                                            toValue:2,
                                                                            duration:500
                                                                        }).start();
                                                                        Animated.timing(this.state.CardSize,{
                                                                            toValue:0,
                                                                            duration:500
                                                                        }).start();
                                                                    })
                                                                }
                                                            }
                                                        }, 500);
                                                    })
                                                    clearInterval(GetSAPID);
                                                }
                                            }
                                            else{
                                                ;
                                            }
                                        }, 500);
                                    })
                                    clearInterval(GetClientInterval);
                                }
                            })
                        }, 500)
                    }
                    else if(RequestValue.includes("DA104")){
                        let GetClientInterval = setInterval(() => {
                            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"}, () => {
                                if(this.props.Client === null || this.props.Client === ''){
                                    ;
                                }
                                else{
                                    clearInterval(GetClientInterval);
                                    let GETSAPID = setInterval(() => {
                                        this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID').value);"},() => {
                                            if(this.state.JSScriptState === "window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID').value);"){
                                                if(this.props.SAPID === '' || this.props.SAPID === null){
                                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                                }
                                                else{
                                                    clearInterval(GETSAPID)
                                                    this.props.SelectMenuType("UNLOCKSAPID");
                                                    this.setState({loading:false});
                                                    this.props.ChangeRequestType("UNLOCKRESET");
                                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                                    this.props.ChangeResetState("true")
                                                    this.setState({WebViewMode:true}, () => {
                                                        this.setState({JSScriptState:JSScriptConstValue});
                                                        Animated.timing(this.state.WebViewSize,{
                                                            toValue:2,
                                                            duration:500
                                                        }).start();
                                                        Animated.timing(this.state.CardSize,{
                                                            toValue:0,
                                                            duration:500
                                                        }).start();
                                                    })
                                                }
                                            }
                                            else{
                                                ;
                                            }
                                        })
                                    },500)
                                }
                            })
                        }, 500)
                    }
                    else if(RequestValue.includes("DA106")){
                        let GetClientInterval = setInterval(() => {
                            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"}, () => {
                                if(this.props.Client === null || this.props.Client === ''){
                                    ;
                                }
                                else{
                                    clearInterval(Get);
                                    this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPID1').value);"}, () => {
                                        if(this.props.Client === null || this.props.Client == '' || this.props.SAPID == '' || this.props.SAPID == null){
                                            console.log(this.props.SAPID)
                                            this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                        }
                                        else{
                                            clearInterval(GetClientInterval);
                                            this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                            this.props.SelectMenuType("UNLOCKSAPID");
                                            this.setState({loading:false});
                                            this.props.ChangeRequestType("EXTEND");
                                            this.setState({WebViewMode:true}, () => {
                                                this.setState({JSScriptState:JSScriptConstValue});
                                                Animated.timing(this.state.WebViewSize,{
                                                    toValue:2,
                                                    duration:500
                                                }).start();
                                                Animated.timing(this.state.CardSize,{
                                                    toValue:0,
                                                    duration:500
                                                }).start();
                                            })
                                        }
                                    })
                                }
                            })
                        }, 500)
                    }
                    else if(RequestValue.includes("DA204")){
                        clearInterval(Get);
                        let GetClientInterval = setInterval(() => {
                            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"}, () => {
                                if(this.props.Client === null || this.props.Client === ''){
                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                }
                                else{
                                    clearInterval(GetClientInterval);
                                    this.props.SelectMenuType("ASSIGNSAPROLE");
                                    this.setState({loading:false});
                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                    this.props.ChangeRequestType("ASSIGNROLE");
                                    this.setState({WebViewMode:true}, () => {
                                        this.setState({JSScriptState:JSScriptConstValue});
                                        Animated.timing(this.state.WebViewSize,{
                                            toValue:2,
                                            duration:500
                                        }).start();
                                        Animated.timing(this.state.CardSize,{
                                            toValue:0,
                                            duration:500
                                        }).start();
                                    })
                                }
                            })
                        }, 500)
                    }
                    else if(RequestValue.includes("DA101")){
                        clearInterval(Get);
                        let GetClientInterval = setInterval(() => {
                            this.setState({JSScriptState:"window.ReactNativeWebView.postMessage(document.getElementById('txtSAPClient').value);"}, () => {
                                if(this.props.Client === null || this.props.Client === ''){
                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                }
                                else{
                                    clearInterval(GetClientInterval);
                                    this.props.SelectMenuType("CREATESAPID");
                                    this.setState({loading:false});
                                    this.props.ChangeLink("https://es.cp.co.id/edco.php?ecsno="+value);
                                    this.setState({WebViewMode:true}, () => {
                                        this.setState({JSScriptState:JSScriptConstValue});
                                        Animated.timing(this.state.WebViewSize,{
                                            toValue:2,
                                            duration:500
                                        }).start();
                                        Animated.timing(this.state.CardSize,{
                                            toValue:0,
                                            duration:500
                                        }).start();
                                    })
                                }
                            })
                        }, 500)
                    }
                    else{
                        clearInterval(Get);
                        let ClearAllProps = setInterval(() => {
                            if(this.props.Request !== '' || this.props.Client != '' || this.props.SAPID !== '' || this.props.ResetState !== '' || this.props.RequestType !== '' || this.props.Link !== ''){
                                this.props.ChangeRequestType('');
                                this.props.ChangeResetState('');
                                this.props.ChangeSAPID('');
                                this.props.ChangeClient('');
                                this.props.MessageSend('');
                                this.props.ChangeLink('');
                            }
                            else{
                                clearInterval(ClearAllProps)
                                this.setState({loading:false, DoneRequestButtonVisible:false});
                                Toast.show({
                                    text:'Request belum didukung / crawling tidak sempurna',
                                    buttonText:'Okay',
                                    type:'warning',
                                    duration:3000
                                })
                            }
                        }, 500)
                    }
                }
                this.props.MessageSend(request)
            }, 500)
        });
    }

    InjectAutoFill = () => {
        if(this.props.RequestType === 'UNLOCK' && this.props.DoneState === true){
            let DoneStateMustFalse =  setInterval(() => {
                if(this.props.DoneState === true){
                    this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, hanya unlock';")
                    this.props.ChangeDoneState(false);
                    this.setState({DoneRequestButtonDisabled:false, LinkNow:''});
                }
                else{
                    clearInterval(DoneStateMustFalse);
                }
            }, 500)
        }
        else if(this.props.RequestType === 'UNLOCKRESET' && this.props.DoneState === true){
            let DoneStateMustFalse =  setInterval(() => {
                if(this.props.DoneState === true){
                    this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, unlock and reset password : initial';")
                    this.props.ChangeDoneState(false);
                    this.setState({DoneRequestButtonDisabled:false, LinkNow:''});
                }
                else{
                    clearInterval(DoneStateMustFalse);
                }
            }, 500)
        }
        else if(this.props.RequestType === 'EXTEND' && this.props.DoneState === true){
            let DoneStateMustFalse =  setInterval(() => {
                if(this.props.DoneState === true){
                    this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, extend';")
                    this.props.ChangeDoneState(false);
                    this.setState({DoneRequestButtonDisabled:false, LinkNow:''});
                }
                else{
                    clearInterval(DoneStateMustFalse);
                }
            }, 500)
        }
        else if(this.props.RequestType === 'ASSIGNROLE' && this.props.DoneState === true){
            let DoneStateMustFalse =  setInterval(() => {
                if(this.props.DoneState === true || this.props.Valid !== '' || this.props.RoleName !== ''){
                    this.webview.injectJavaScript("document.getElementById('txtSolving').value = 'Done, assign role : "+this.props.RoleName+" "+this.props.Valid+"';")
                    this.props.ChangeDoneState(false);
                    this.props.ChangeValid('');
                    this.props.ChangeRoleName('');
                    this.setState({DoneRequestButtonDisabled:false, LinkNow:''});
                }
                else{
                    clearInterval(DoneStateMustFalse);
                }
            }, 500)
        }
        else{
            if(this.state.CardClicked === true){
                let CardClickValueMustNotNull = setInterval(()=>{
                    if(this.state.CardClickValue === '' || this.state.CardClickValue === null || this.state.CardClickRequest === '' || this.state.CardClickRequest === null){
                    }
                    else{
                        clearInterval(CardClickValueMustNotNull);
                        this.CardClick(this.state.CardClickValue, this.state.CardClickRequest)
                    }
                },500)
            }
            else{
                this.setState({refreshing:false, loading:false, JSScriptState:"window.ReactNativeWebView.postMessage(window.location.href)"}, ()=>{
                    setTimeout(() => {
                        if(this.state.LinkNow === 'https://es.cp.co.id/mybox.php'){
                            this.setState({JSScriptState:JSScriptConstValue, LoadDone:true})
                        }
                        else{
                            this.webview.injectJavaScript("document.getElementById('email_txt').value = '"+this.state.AppUsername+"';")
                            this.webview.injectJavaScript("document.getElementById('pass_txt').value = '"+this.state.EsPassword+"';")
                            this.webview.injectJavaScript("document.getElementById('btnLogin').click();")
                            this.setState({JSScriptState:JSScriptConstValue})
                        }
                    },500)
                })
            }
            
            let DoneStateMustFalse =  setInterval(() => {
                if(this.props.DoneState === true){
                    this.props.ChangeDoneState(false);
                    this.setState({DoneRequestButtonDisabled:true});
                }
                else{
                    this.setState({DoneRequestButtonDisabled:true});
                    clearInterval(DoneStateMustFalse);
                }
            }, 500)
        }
    }

    componentDidUpdate(PrevProps){
        if(PrevProps.Link === this.props.Link){
        }
        else{
            if(this.props.Link === '' || this.props.Link === null){
                ;
                
            }
            else{
                this.setState({WebLink:this.props.Link})
            }
        }
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
        this.GetKey()
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    HandleBackButton = () => {
        Alert.alert(
            'Exit App Confirmation',
            'Are you sure want to exit app??',
            [
                {text:'OK', onPress:() => BackHandler.exitApp()},
                {text:'Cancel', onPress:() => console.log('cancel')}
            ]
        )
        return true;
    }

    ESDoneButton = () => {
        this.webview.injectJavaScript("document.getElementById('Done').click();");
        this.setState({DoneRequestButtonDisabled:true, DoneRequestButtonVisible:false}, () => {
            //this.webview.injectJavaScript("location.replace('https://es.cp.co.id/mybox.php')");
        })
    }

    render(){
        let JSScript = this.state.JSScriptState;
        const screen =() =>{
            switch(this.props.ScreenType){
                case 'HOME' : 
                    return (
                        <View style={styles.Container}>
                            <Animated.View style={{flex:this.state.WebViewSize}}>
                                <WebView 
                                ref={c => this.webview = c}
                                source={{uri:this.state.WebLink}}
                                injectedJavaScript={JSScript}
                                onMessage={(event) => {this.GetHTML(event.nativeEvent.data, this.state.JSScriptState)}}
                                onLoad={() => {this.InjectAutoFill()}}
                                />
                                {
                                    this.state.DoneRequestButtonVisible?
                                    <Button  disabled={this.state.DoneRequestButtonDisabled} onPress={()=>{this.ESDoneButton()}}>
                                        <Text>Done Request</Text>
                                    </Button>
                                    :
                                    false
                                }
                            </Animated.View>

                            <Animated.View style={{flex:this.state.CardSize}}>
                                <Content padder refreshControl={
                                    <RefreshControl 
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.RefreshRequest}
                                    />
                                }>
                                            
                                        
                                    
                                    {
                                        this.state.ListKosong === true && this.state.loading === false && this.state.refreshing === false ?
                                        <Text>There is no request available</Text>
                                        :
                                        (
                                            this.state.ListKosong === true && this.state.loading === true && this.state.refreshing === true ?
                                            <Spinner color='red' /> :
                                            this.state.RequestNumber.map((HTMLElement1) => {
                                                if(typeof(HTMLElement1['childNodes'][0]['childNodes']) !== "undefined")
                                                {
                                                    return(
                                                        <Text>Assigned, Not Accepted</Text>
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <Card>
                                                            <CardItem button onPress={() => this.CardClickStatus(HTMLElement1['childNodes'][3]['childNodes'][0]['rawText'], HTMLElement1['childNodes'][13]['childNodes'][0]['rawText'])} header bordered>
                                                                <Text>Ticket : </Text>
                                                                <Text>{HTMLElement1['childNodes'][3]['childNodes'][0]['rawText']}</Text>
                                                            </CardItem>
                                                            <CardItem bordered>
                                                                <Text>Requester : </Text>
                                                                <Text>{HTMLElement1['childNodes'][9]['childNodes'][0]['rawText']}</Text>
                                                            </CardItem>
                                                            <CardItem bordered>
                                                                <Text>Date : </Text>
                                                                <Text>{HTMLElement1['childNodes'][5]['childNodes'][0]['rawText']}</Text>
                                                            </CardItem>
                                                            <CardItem bordered>
                                                                <Text accessible={true} selectable={true}>{HTMLElement1['childNodes'][13]['childNodes'][0]['rawText']}</Text>
                                                            </CardItem>
                                                            <CardItem footer bordered>
                                                                <Text>Ref Ticket : </Text>
                                                                <Text>{HTMLElement1['childNodes'][17]['childNodes'][0]['rawText']}</Text>
                                                            </CardItem>
                                                        </Card>
                                                );}
                                            })
                                        )
                                        
                                    }
                                <Button onPress={() => {this.RefreshRequest()}}>
                                    <Text>Refresh Request</Text>
                                </Button>
                                </Content>
                            </Animated.View>
                        </View>
                    );
                case 'UNLOCKSAPID' : 
                    return (
                        <UnlockSAPID />
                    );
                case 'REGISTERSAPID' :
                    return(
                        <RegisterSAPID />
                    );
                case 'ASSIGNSAPROLE' :
                    return(
                        <AssignSAPRole />
                    );
                case 'CREATESAPID' :
                    return(
                        <CreateSAPID />
                    );
            }
        }

        return(
            <Root>
                <Drawer ref={(ref) => { this.drawer = ref; }} content={<SideBar navigator={this.navigator} CloseDrawer={this.CloseDrawer} />} onClose={() => this.CloseDrawer()}>
                    <Container>
                        <Header>
                            <Left>
                                <Button transparent onPress={() => this.OpenDrawer()}>
                                    <Icon name='menu' />
                                </Button>
                            </Left>
                            <Body>
                                <View style={{flexDirection:'row'}}>
                                    {
                                        this.props.ScreenType === 'HOME' ?
                                        <Button onPress={()=>this.OnChangeSwitch()} color='#00f7ff' rounded disabled={false}>
                                            <Text>Change View</Text>
                                        </Button>
                                        :
                                        <Button rounded disabled={true}>
                                            <Text>Change View</Text>
                                        </Button>
                                    }
                                    
                                </View>
                            </Body>
                        </Header>
                        {screen()}
                        {this.state.loading === true || this.state.refreshing === true ?
                        <View style={styles.SpinnerOverlay}>
                            <Spinner color='blue' />
                        </View>
                        :
                        null
                        }
                    </Container>
                </Drawer>
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    Container:{
        flex:2
    },
    SpinnerOverlay:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#9C9C9C88',
        
    },
    WebViewContainer:{
        flex:0.5
    },
    CardContainer:{
        flex:0.5
    }
})

const MapStateToProps = (state) => {
    return{
        ScreenType:state.reducer.ScreenType,
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
        },
        ChangeLink : (Link) => {
            dispatch({type:'CHANGE_LINK', payload:Link})
        },
    }
}

const MenuAppRedux = connect(MapStateToProps, MapDispatchToProps)(MenuApp)

export default withNavigation(MenuAppRedux)