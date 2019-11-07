import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {StyleSheet, ImageBackground, Dimensions, BackHandler, Animated, Alert, ScrollView, Text, View, StatusBar, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {Root, Icon} from 'native-base';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import SideBar from './drawer.js';
import {connect} from 'react-redux';
import UnlockSAPID from './basis/unlocksapid.js';

import AssignSAPRole from './basis/assignsaprole.js';

import BlurOverlay,{closeOverlay,openOverlay} from 'react-native-blur-overlay';

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

let JSSCript = "window.ReactNativeWebView.postMessage(document.body.innerHTML);";
let HTMLText = "";
let EDCO = "";
let EDCOReject = "";
let EBASIS = "";
let IconType = "angle-double-up";
let ReqPackage = [];
let ReqType = "";
let Client = "";
let SAPID = "";
let EBASISSourceClient = "";
let EBASISClient = [];
//let CardWidth = 0;
//let CardHeight = 0;
const PreventBack = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Login'})],
});

class MenuApp extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            AppUsername:'',
            EsPassword:'',
            CardWidth:0,
            CardHeight:0,
            ReqContainer:[],
            EbasisContainer:[],
            ScrapState:true,
            CardMode:false,
            CardContainer:new Animated.Value(height),
            AtHome:true,
            Username:'',
            WebViewDisplay:true,
            ViewRef:null,
            MenuSize:0,
            LoadingRequest:false,
            MenuMode:false,
            MenuShowDisabled:false,
        }
    }

    AutoLogin = () => {
        this.webview.injectJavaScript("document.getElementById('email_txt').value = '"+this.state.AppUsername+"';");
        this.webview.injectJavaScript("document.getElementById('pass_txt').value = '"+this.state.EsPassword+"';");
        this.webview.injectJavaScript("document.getElementById('btnLogin').click();");

        this.setState({ScrapState:false});
        
    }

    GetHTML = (event) => {
        this.webview.injectJavaScript(JSSCript);
        if(JSSCript === "window.ReactNativeWebView.postMessage(document.body.innerHTML);"){
            HTMLText = event.nativeEvent.data
        }
        else if(JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'RequestType':document.getElementById('act_slc').value,'Client':document.getElementById('txtSAPClient').value, 'UnlockSAPID':document.getElementById('txtSAPID1').value,'UnlockResetVal':document.getElementById('cbReset').checked.toString(), 'ExtendSAPID':document.getElementById('txtSAPID').value}));"){
            try{
                let All = JSON.parse(event.nativeEvent.data)
                ReqPackage = [];
                ReqPackage.push(All.RequestType)
                ReqPackage.push(All.Client)
                ReqPackage.push(All.UnlockSAPID)
                ReqPackage.push(All.UnlockResetVal)
                ReqPackage.push(All.ExtendSAPID)
            }
            catch(e){
                console.log(e)
            }
        }
        //console.log(HTMLText);
    }
    
    GetRequestDetail = () => {
        this.webview.injectJavaScript("window.ReactNativeWebView.postMessage(window.location.replace('https://es.cp.co.id/edco.php?ecsno=HBAY-1910281114-SLT'));");
        //JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('content_form').innerHTML);";
        JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('content_form').innerHTML);";
    }

    GetESHTMLMenu = () => {
        this.setState({MenuShowDisabled:true}, () => {
            try{
                if(this.state.AtHome === true){
                    if(this.state.CardMode == true){
                        IconType="angle-double-up"
                        this.setState({CardMode:false}, () => {
                            this.HandleCardContainerAnimationDown();
                        })
                    }
                    else if(this.state.CardMode == false){
                        
                        this.HandleCardContainerAnimationUp();
                        IconType="times"
                        this.setState({CardMode:true}, () => {
                            if(this.state.ScrapState === true){
                                ;
                            }
                            else{
                                const HTMLParser = require('fast-html-parser');
                                var root = HTMLParser.parse(HTMLText);
                                EDCO = root.querySelector('#content_edco');
                                EBASIS = root.querySelector('#content_ebasis')
                                let ReqPos = 4;
    
                                if(EDCO['childNodes'].length !== 0){
                                    let ArrayRequest = EDCO['childNodes'][1]['childNodes'][1]['childNodes'];
                                    let TotalRequest = ArrayRequest.length - 4;
                                    let i = 0;
                                    let Request = [];
    
                                    this.setState({ReqContainer:[]}, () => {
                                        for(i = 4; i < ReqPos+TotalRequest; i++){
                                            Request.push(ArrayRequest[i]);
                                        }
                                        //console.log(Ebasis)
                                        this.setState({ReqContainer:[...Request]})
                                    });
    
                                }
                                else{
                                    ;
                                }
    
                                if(EBASIS['childNodes'].length != 0){
                                    let ArrayEbasis = EBASIS['childNodes'][3]['childNodes'][1]['childNodes'];
                                    let TotalEbasis = ArrayEbasis.length - 4;
                                    let j = 0;
                                    let Ebasis = [];
    
                                    this.setState({ReqContainer:[], EbasisContainer:[]}, () => {
                                        for(j = 4; j < ReqPos+TotalEbasis; j++){
                                            Ebasis.push(ArrayEbasis[j]);
                                            
                                        }
                                        //console.log(Ebasis)
                                        this.setState({EbasisContainer:[...Ebasis]})
                                    });
                                }
                                else{
                                    ;
                                }
                            }
                        })
                    }
                }
                else{
                    this.setState({AtHome:true}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(document.body.innerHTML);"
                        this.webview.injectJavaScript("window.location.href='https://es.cp.co.id/mybox.php'")
    
                        if(this.state.CardMode === true){
                            IconType="angle-double-up"
                            this.setState({CardMode:false}, () => {
                                this.HandleCardContainerAnimationDown();
                            })
                        }
                        else if(this.state.CardMode === false){
                            
                            this.HandleCardContainerAnimationUp();
                            IconType="times"
                            this.setState({CardMode:true}, () => {
                                if(this.state.ScrapState === true){
                                    ;
                                }
                                else{
                                    const HTMLParser = require('fast-html-parser');
                                    var root = HTMLParser.parse(HTMLText);
                                    EDCO = root.querySelector('#content_edco');
                                    EBASIS = root.querySelector('#content_ebasis')
                                    let ReqPos = 4;
                                    if(EDCO['childNodes'].length !== 0){
                                        let ArrayRequest = EDCO['childNodes'][1]['childNodes'][1]['childNodes'];
                                        let TotalRequest = ArrayRequest.length - 4;
                                        let i = 0;
                                        let Request = [];
        
                                        this.setState({ReqContainer:[]}, () => {
                                            for(i = 4; i < ReqPos+TotalRequest; i++){
                                                Request.push(ArrayRequest[i]);
                                            }
                                            //console.log(Ebasis)
                                            this.setState({ReqContainer:[...Request]})
                                        });
        
                                    }
                                    else{
                                        ;
                                    }
        
                                    if(EBASIS['childNodes'].length != 0){
                                        let ArrayEbasis = EBASIS['childNodes'][3]['childNodes'][1]['childNodes'];
                                        let TotalEbasis = ArrayEbasis.length - 4;
                                        let j = 0;
                                        let Ebasis = [];
        
                                        this.setState({ReqContainer:[], EbasisContainer:[]}, () => {
                                            for(j = 4; j < ReqPos+TotalEbasis; j++){
                                                Ebasis.push(ArrayEbasis[j]);
                                                
                                            }
                                            //console.log(Ebasis)
                                            this.setState({EbasisContainer:[...Ebasis]})
                                        });
                                    }
                                    else{
                                        ;
                                    }
                                }
                            })
                        }
                    })
                }
            }
            catch(e){
                console.log(e)
            }
        })
    }

    RefreshRequest = () => {
        var GetRequestRefreshed;
        clearInterval(GetRequestRefreshed)
        this.webview.injectJavaScript("window.location.href='https://es.cp.co.id/mybox.php'")
        JSSCript = "window.ReactNativeWebView.postMessage(document.body.innerHTML);";
        this.webview.injectJavaScript("window.ReactNativeWebView.postMessage(document.body.innerHTML);")
        const HTMLParser = require('fast-html-parser');
        var root = HTMLParser.parse(HTMLText);
        this.setState({ReqContainer:[], ScrapState:true}, () => {
            GetRequestRefreshed = setInterval(()=> {
                if(this.state.ScrapState === true || root.querySelector('#content_edco') === undefined){
                    ;//console.log(root.querySelector('#content_edco'))
                }
                else{
                    EDCO = root.querySelector('#content_edco');
                    let ArrayRequest = EDCO['childNodes'][1]['childNodes'][1]['childNodes'];
                    
                    let TotalRequest = ArrayRequest.length - 4
                    let ReqPos = 4;
                    let i = 0
                    let Request = [];

                    for(i = 4; i < ReqPos+TotalRequest; i++){
                        Request.push(ArrayRequest[i]);
                    }
                    this.setState({ReqContainer:[...Request]})
                    clearInterval(GetRequestRefreshed);
                }
            },500)
            
        })
    }

    GetCardSize = (cwidth, cheight) => {
        this.setState({CardWidth:cwidth})
    }

    HandleCardContainerAnimationUp = () => {
        Animated.decay(this.state.CardContainer,{
            velocity:-height/202,
            deceleration:0.995
        }).start(() => this.setState({MenuShowDisabled:false}))
    }

    HandleCardContainerAnimationDown = () => {
        Animated.decay(this.state.CardContainer,{
            velocity:height/202,
            deceleration:0.995
        }).start(() => this.setState({MenuShowDisabled:false}))
    }

    RequestCardClicked = (value, EsMessage) => {
        console.log(ReqPackage)
        this.setState({LoadingRequest:true}, ()=> {
            let Timeout = 0;
            this.webview.injectJavaScript("window.location.replace('https://es.cp.co.id/edco.php?ecsno="+value+"')");
            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'RequestType':document.getElementById('act_slc').value,'Client':document.getElementById('txtSAPClient').value, 'UnlockSAPID':document.getElementById('txtSAPID1').value,'UnlockResetVal':document.getElementById('cbReset').checked.toString(), 'ExtendSAPID':document.getElementById('txtSAPID').value}));";
            var ParaMustNotNull  = setInterval(() => {
                if(ReqPackage.length === 0){
                    console.log(this.props.Link)
                }
                else{
                    if(ReqPackage[0] === "DA105"){
                        this.props.ChangeClient(ReqPackage[1]);
                        this.props.ChangeSAPID(ReqPackage[2]);
                        this.props.ChangeLink(value);
                        this.props.MessageSend(EsMessage);
                        if(ReqPackage[3] === "true"){
                            this.props.ChangeRequestType("UNLOCKRESET");
                            this.props.ChangeResetState("true")
                        }
                        else{
                            this.props.ChangeRequestType("UNLOCK");
                            this.props.ChangeResetState("false")
                        }
                        this.props.navigation.navigate('UnlockSAPID');
                        clearInterval(ParaMustNotNull)
                        this.setState({AtHome:false, LoadingRequest:false})
                    }
                    else if(ReqPackage[0] === "DA104"){
                        this.props.ChangeClient(ReqPackage[1]);
                        this.props.ChangeSAPID(ReqPackage[4]);
                        this.props.ChangeLink(value);
                        this.props.MessageSend(EsMessage);
                        this.props.ChangeRequestType("UNLOCKRESET");
                        this.props.ChangeResetState("true")
                        this.props.navigation.navigate('UnlockSAPID');
                        clearInterval(ParaMustNotNull)
                        this.setState({AtHome:false, LoadingRequest:false})
                    }
                    else if(ReqPackage[0] === "DA101"){
                        this.props.ChangeClient(ReqPackage[1]);
                        this.props.MessageSend(EsMessage);
                        this.props.ChangeLink(value);
                        this.props.ChangeRequestType("CREATESAPID");
                        this.props.navigation.navigate('CreateSAPID');
                        clearInterval(ParaMustNotNull)
                        this.setState({AtHome:false, LoadingRequest:false})
                    }
                    else if(ReqPackage[0] === "DA106"){
                        this.props.ChangeClient(ReqPackage[1]);
                        this.props.ChangeSAPID(ReqPackage[4]);
                        this.props.ChangeLink(value);
                        this.props.MessageSend(EsMessage);
                        this.props.ChangeRequestType("EXTEND");
                        this.props.ChangeResetState("false")
                        this.props.navigation.navigate('UnlockSAPID');
                        clearInterval(ParaMustNotNull)
                        this.setState({AtHome:false, LoadingRequest:false})
                    }
                    else if(ReqPackage[0] === "DA204"){
                        this.props.ChangeClient(ReqPackage[1]);
                        this.props.ChangeLink(value);
                        this.props.MessageSend(EsMessage);
                        this.props.ChangeRequestType("ASSIGNROLE");
                        this.props.navigation.navigate('AssignSAPRole');
                        clearInterval(ParaMustNotNull)
                        this.setState({AtHome:false, LoadingRequest:false})
                    }
                    else{
                        Timeout = Timeout + 1
                        if(Timeout === 6){
                            Alert.alert(
                                "Request Status",
                                "Request is not supported or crawling not complete",
                                [
                                    {text:'Okay'}
                                ]
                            )
                            clearInterval(ParaMustNotNull)
                            Timeout = 0
                            this.setState({LoadingRequest:false})
                        }
                        else{
                            ;
                        }
                    }
                }
            }, 1000)
        })
    }

    BasisRequestCardClick = (value) => {
        this.props.ChangeLink(value)
        this.props.ChangeRequestType("TRANSPORT");
        this.props.navigation.navigate('TransportRole');
    }

    GetMenuSize = (WidthHeight) =>{
        this.setState({MenuSize:WidthHeight})
    }

    MenuClickControler = (event) =>{
        this.setState({MenuMode:true}, () => {
            let ClearRequestType = setInterval(() => {
                if(this.props.Request !== '' || this.props.RequestType !== '' || this.props.SAPID !== '' || this.props.Client !== '' || this.props.ResetState !== '' || this.props.Link !== ''){
                    this.props.ChangeRequestType('');
                    this.props.ChangeSAPID('');
                    this.props.ChangeClient('');
                    this.props.ChangeResetState('');
                    this.props.MessageSend('');
                    this.props.ChangeLink('');
                    console.log(this.props.Request)
                }
                else{
                    clearInterval(ClearRequestType)
                    if(event === '1'){
                        this.props.navigation.navigate('UnlockSAPID');
                    }
                    else if(event === '2'){
                        this.props.navigation.navigate('RegisterSAPID');
                    }
                    else if(event === '3'){
                        this.props.navigation.navigate('CreateSAPID');
                    }
                    else if(event === '4'){
                        this.props.navigation.navigate('AssignSAPRole');
                    }
                    else if(event === '5'){
                        this.props.navigation.navigate('TransportRole');
                    }
                }
            },500)
        })
    }

    CloseMenu = () => {
        this.setState({MenuMode:false}, () => {
            closeOverlay();
        })
    }

    OpenMenu = () => {
        this.setState({MenuMode:true}, () => {
            openOverlay();
        })
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

    async GetKey() {
        try{
            var GetKey = AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result)
                    let DecryptedPassword = this.DecryptSendPassword(ResultParsed.password)
                    this.setState({AppUsername:ResultParsed.username, EsPassword:this.DecryptSendPassword(ResultParsed.espassword)})
                }
            })
        }
        catch(e){
            console.log(e)
        }
    }

    async DeleteKey() {
        try{
            await AsyncStorage.removeItem('user');
            this.webview.injectJavaScript("window.location.href='https://es.cp.co.id/logout.php'")
        }
        catch(error){
            console.log(error)
        }
    }

    Logout = () => {
        this.DeleteKey();
        this.props.navigation.dispatch(PreventBack);
    }

    HandleBackButton = () => {
        if(this.state.CardMode === true){
            IconType="angle-double-up"
            this.setState({CardMode:false}, () => {
                this.HandleCardContainerAnimationDown();
            })
        }
        else if(this.state.MenuMode === true){
            this.CloseMenu()
        }
        else{
            Alert.alert(
                'Exit App Confirmation',
                'Are you sure want to exit app??',
                [
                    {text:'OK', onPress:() => BackHandler.exitApp()},
                    {text:'Cancel', onPress:() => console.log('cancel')}
                ]
            )
        }
        return true;
    }

    componentDidMount(){
        this.GetKey();
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    BlurChild(){
        return(
            <View style={{right:0, left:0, top:0, bottom:0, zIndex:4}}>
                <View style={{height:width/1.1, width:width/1.2, backgroundColor:'transparent'}}>
                    <View style={{flex:1, backgroundColor:'transparent', flexDirection:'row'}}>
                        <View onLayout={(event)=>this.GetMenuSize(event.nativeEvent.layout.width)} style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.MenuClickControler('1')} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="unlock" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Unlock SAP ID</Text>
                        </View>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.MenuClickControler('2')} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="address-book" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Register SAP ID</Text>
                        </View>
                    </View>
                    <View style={{flex:1, backgroundColor:'transparent', flexDirection:'row'}}>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.MenuClickControler('3')} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="user-plus" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Create SAP ID</Text>
                        </View>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.MenuClickControler('4')} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="gears" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Assign SAP Role</Text>
                        </View>
                    </View>
                    <View style={{flex:1, backgroundColor:'transparent', flexDirection:'row'}}>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.Logout()} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="power-off" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Logout</Text>
                        </View>
                    </View>
                    {
                        /* 
                    <View style={{flex:1, backgroundColor:'transparent', flexDirection:'row'}}>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.MenuClickControler('5')} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="truck" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Transport</Text>
                        </View>
                        <View style={{flex:1, backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.Logout()} style={{borderRadius:100, borderColor:'white', borderWidth:2, width:this.state.MenuSize/2, height:this.state.MenuSize/2, justifyContent:'center', alignItems:'center'}}>
                                <Icon type='FontAwesome' name="power-off" style={{color:'white'}} />
                            </TouchableHighlight>
                            <Text style={{color:'white'}} >Logout</Text>
                        </View>
                    </View>
                        */
                    }
                   
                </View>
            </View>
        )  
    }

    render(){
        return(
            <Root>
                <View style={{flex:1}}>
                    <StatusBar backgroundColor='grey' barStyle='light-content' />
                    <ImageBackground source={require("./src/img/BannerBackground.jpg")} style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableHighlight onPress={()=>this.OpenMenu()} style={{position:'absolute', width:width/6, height:width/6, alignItems:'center', justifyContent:'center', transform:[{translateX:-width/2.5},{translateY:-height/8.5}] }} >
                            <Icon type='FontAwesome' name='align-justify' />
                        </TouchableHighlight>
                        <TouchableHighlight>
                            <ImageBackground source={require('./src/img/Profile.jpg')} style={{width:width/4, height:width/4, borderRadius:100}} imageStyle={{borderRadius:100}}>
                            
                            </ImageBackground>
                        </TouchableHighlight>
                        <Text style={{marginTop:25, fontSize:24, fontWeight:'bold'}}>WELCOME</Text>
                        <Text>{this.props.AppUser}</Text>
                    </ImageBackground>
                    <View style={{flex:1.5}}>
                        <WebView ref={c => this.webview = c} source={{uri:'https://es.cp.co.id/mybox.php'}} 
                            injectedJavaScript={JSSCript}
                            onMessage={this.GetHTML}
                            onLoadEnd={() => this.AutoLogin()}
                        />
                    </View>
                    <View style={{flex:0.5}}>

                    </View>
                    <Animated.View onLayout={(e) => this.GetCardSize(e.nativeEvent.layout.width, e.nativeEvent.layout.height)} style={{backgroundColor:'#dedede', position:'absolute', height:height/1.25, width:width, alignItems:'center', transform:[{translateY:this.state.CardContainer}] }}>
                        <ScrollView style={{width:this.state.CardWidth - 20}} contentContainerStyle={{flexGrow:1, alignItems:'center'}}>
                            {
                                this.state.ReqContainer.map((value, i) => {
                                    try{
                                        return(
                                            <TouchableWithoutFeedback key={i}  onPress={()=>this.RequestCardClicked(value['childNodes'][3]['childNodes'][0]['rawText'], value['childNodes'][13]['childNodes'][0]['rawText'])}>
                                                <View style={{width:this.state.CardWidth - 40, elevation:10, backgroundColor:'white', marginBottom:15, marginTop:15, borderRadius:15}}>
                                                        <Text style={{marginLeft:15, marginTop:15, marginRight:15}}>{value['childNodes'][3]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginTop:15, marginRight:15}}>Requester : {value['childNodes'][9]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginTop:15, marginRight:15}}>Date : {value['childNodes'][5]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginRight:15}} accessible={true} selectable={true}>{value['childNodes'][13]['childNodes'][0]['rawText']}</Text>
                                                
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    }
                                    catch(e){
                                        console.log(value)
                                    }
                                })
                            }
                            <Text>E-Basis</Text>
                            {
                                this.state.EbasisContainer.map((value,i) => {
                                    try{
                                        if(value['childNodes'][3] === undefined){
                                            return(
                                                <View></View>
                                            )
                                        }
                                        else{
                                            return(
                                                <TouchableHighlight onPress={() => this.BasisRequestCardClick(value['childNodes'][3]['childNodes'][0]['rawText'])}>
                                                    <View key={i} style={{width:this.state.CardWidth - 40, elevation:10, backgroundColor:'#e6e6e6', marginBottom:15, marginTop:15, borderRadius:15}}>
                                                        <Text style={{marginLeft:15, marginTop:15, marginRight:15}}>{value['childNodes'][3]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginTop:15, marginRight:15}}>Requester : {value['childNodes'][7]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginTop:15, marginRight:15}}>Date : {value['childNodes'][5]['childNodes'][0]['rawText']}</Text>
                                                        <Text style={{marginLeft:15, marginBottom:15, marginTop:15, marginRight:15}}>Client : {value['childNodes'][11]['childNodes'][0]['rawText']}</Text>
                                                        {
                                                            value['childNodes'][13]['childNodes'].length === 0 ?
                                                            <Text style={{marginLeft:15, marginBottom:15, marginRight:15, color:'red'}} accessible={true} selectable={true}>{"<NO DESCRIPTION>"}</Text>
                                                            :
                                                            <Text style={{marginLeft:15, marginBottom:15, marginRight:15}} accessible={true} selectable={true}>{value['childNodes'][13]['childNodes'][0]['rawText']}</Text>
                                                        }
                                                        
                                                    </View>
                                                </TouchableHighlight>
                                                
                                            )
                                        }
                                    }
                                    catch(e){
                                        console.log(value)
                                    }
                                })
                            }
                        </ScrollView>
                    </Animated.View>
                    <Animated.View style={{width:width/5.5, height:width/5.5, position:'absolute', borderWidth:20, borderColor:'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center', borderRadius:100, transform:[{translateX:width/2.3},{translateY:height/1.2}]}}>
                        <TouchableHighlight  style={{width:width/6, height:width/6, backgroundColor:'white', justifyContent:'center', alignItems:'center', position:'absolute', borderRadius:200, }} onPress={()=>this.GetESHTMLMenu()} disabled={this.state.MenuShowDisabled}>
                            <Icon type='FontAwesome' name={IconType}/>
                        </TouchableHighlight>
                    </Animated.View>
                    
                    <BlurOverlay radus={14} downsampling={1} brightness={-200} onPress={()=> {this.CloseMenu()}} blurStyle="dark" children={this.BlurChild()} customStyles={{alignItems: 'center', justifyContent: 'center'}} />
                </View>
                {
                    this.state.LoadingRequest ?
                        <ImageBackground source={require('./src/img/loading.gif')} style={{position:'absolute', height:height, width:width, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center'}}>
                            
                        </ImageBackground>
                    :
                        null
                }
            </Root>
        )
    }
}

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
        RoleName:state.reducer.RoleName,
        AppUser:state.reducer.AppUser
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