import React, {Component} from 'react';
import {StyleSheet, AsyncStorage, ImageBackground, Picker, Dimensions, BackHandler, Animated, Alert, ScrollView, Text, View, StatusBar, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {Toast, Root} from 'native-base'
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {WebView} from 'react-native-webview';


const BackToHome = StackActions.pop({
    n:1
})
let JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'SourceClient':document.getElementById('sourc_slc').value}))"
let TargetClient = [];
let HTMLText = "";
let MessageArray = [];
let ClientIndex = 0;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
var ArrayClientStatus = [];
var CRArrayPOS = 1;
var CRArray = []
var CRcount;
var CRTransportPos = 0;
var CRTempStatus = [];
var CRFinalStatus = [];
var CRFinalLog = [];
var CRFinalStatusMark = [];

class TransportRoleClass extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            SourceClient:'',
            CR:[],
            SAPUsername:'',
            TargetClient:[],
            OneStep:false,
            TransportStatus:'waiting',
            TransportResponse:'',
            ClientStatus:[],
            CRTempStatus:[],
            CRFinalStatus:[],
            CRFinalLog:[],
        }
    }

    async GetKey(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    this.setState({SAPUsername:ResultParsed.username})
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

    StartSraping = () => {
        JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'SourceClient':document.getElementById('sourc_slc').value}))"
        this.webview.injectJavaScript(JSSCript)
    }

    GetEbasisContent = (event) =>{
        this.webview.injectJavaScript(JSSCript)
        if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'SourceClient':document.getElementById('sourc_slc').value}))")
        {   
            try{
                let SourceClientJSON = JSON.parse(event.nativeEvent.data)
                const SourceClient = SourceClientJSON.SourceClient
                if(SourceClient === ''){
                    ;
                }
                else{
                    this.setState({SourceClient:SourceClient}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('SP_1').checked)"
                        this.webview.injectJavaScript(JSSCript)
                    })
                }
            }
            catch(e){
                console.log("still scrapping")
                JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'SourceClient':document.getElementById('sourc_slc').value}))"
                this.webview.injectJavaScript(JSSCript)
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(document.getElementById('SP_1').checked)"){
            if(this.state.SourceClient == '301' || this.state.SourceClient == '303'){
                if(event.nativeEvent.data === 'false'){
                    JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('tab_main').innerHTML)"
                    this.webview.injectJavaScript(JSSCript)
                }
                else if(event.nativeEvent.data === 'true'){
                    //one step
                    this.setState({OneStep:true}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'401':document.getElementById('QA_401').checked,'402':document.getElementById('QA_402').checked,'100':document.getElementById('PR_100').checked}))"
                        this.webview.injectJavaScript(JSSCript)
                    })
                }
                else{
                    this.webview.injectJavaScript(JSSCript)
                }
            }   
            else if(this.state.SourceClient == '361'){
                if(event.nativeEvent.data === 'false'){
                    JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('tab_main').innerHTML)"
                    this.webview.injectJavaScript(JSSCript)
                }
                else if(event.nativeEvent.data === 'true'){
                    //one step
                    this.setState({OneStep:true}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'461':document.getElementById('QA_461').checked,'462':document.getElementById('QA_462').checked,'160':document.getElementById('PR_160').checked}))"
                        this.webview.injectJavaScript(JSSCript)
                    })
                }
                else{
                    this.webview.injectJavaScript(JSSCript)
                }
            }
            else if(this.state.SourceClient == '341'){
                if(event.nativeEvent.data === 'false'){
                    JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('tab_main').innerHTML)"
                    this.webview.injectJavaScript(JSSCript)
                }
                else if(event.nativeEvent.data === 'true'){
                    //one step
                    this.setState({OneStep:true}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'420':document.getElementById('QA_420').checked,'120':document.getElementById('PR_120').checked}))"
                        this.webview.injectJavaScript(JSSCript)
                    })
                }
                else{
                    this.webview.injectJavaScript(JSSCript)
                }
            }
            else if(this.state.SourceClient == '801'){
                if(event.nativeEvent.data === 'false'){
                    JSSCript = "window.ReactNativeWebView.postMessage(document.getElementById('tab_main').innerHTML)"
                    this.webview.injectJavaScript(JSSCript)
                }
                else if(event.nativeEvent.data === 'true'){
                    //one step
                    this.setState({OneStep:true}, () => {
                        JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'811':document.getElementById('QA_811').checked,'812':document.getElementById('QA_812').checked,'800':document.getElementById('PR_800').checked}))"
                        this.webview.injectJavaScript(JSSCript)
                    })
                }
                else{
                    this.webview.injectJavaScript(JSSCript)
                }
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(document.getElementById('tab_main').innerHTML)"){
            const HTMLParser = require('fast-html-parser');
            HTMLText = event.nativeEvent.data
            var root = HTMLParser.parse(HTMLText);
            let QA = root.querySelector('#table_SAP_CR')
            if(QA === null){
                console.log("masih null")
            }
            else
            {
                var RawAttribute = QA['childNodes'][1]['childNodes'][1]['childNodes'][6]['childNodes'][0]['rawAttrs'].toString().split(" ")
                var SplitSpace = RawAttribute[3]
                var GetValue = SplitSpace.split("=")
                var Value = GetValue[1]
                CRArray = [];
                CRcount = (QA['childNodes'][1]['childNodes'].length) - 1
                for(i = CRArrayPOS; i <= CRcount; i++){
                    var CRRawAttribute = QA['childNodes'][1]['childNodes'][i]['childNodes'][3]['childNodes'][0]['rawAttrs'].toString().split(" ")
                    var CRSplitSpace = CRRawAttribute[4]
                    var CRGetValue = CRSplitSpace.split("=")
                    var CRValue = CRGetValue[1].trim()
                    var CleanCRValue = CRValue.split("\"").join("")
                    CRArray.push(CleanCRValue)
                }
                this.setState({CR:CRArray}, () => {
                    if(this.state.OneStep === true){
                        JSSCript = ""
                        this.webview.injectJavaScript(JSSCript)
                    }
                    else{
                        if((Value === "\"" && this.state.SourceClient === '301') || (Value === "\"" && this.state.SourceClient === '303')){
                            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'401':document.getElementById('QA_401').checked,'402':document.getElementById('QA_402').checked}))"
                            this.webview.injectJavaScript(JSSCript)
                        }
                        else if((Value !== "\"" && this.state.SourceClient === '301') || (Value !== "\"" && this.state.SourceClient === '303')){
                            //next step
                            TargetClient = []
                            TargetClient.push("100");
                            this.setState({TargetClient:[...TargetClient]})
                            JSSCript = ""
                            this.webview.injectJavaScript(JSSCript)
                        }

                        else if(Value === "\"" && this.state.SourceClient === '361'){
                            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'461':document.getElementById('QA_461').checked,'462':document.getElementById('QA_462').checked}))"
                            this.webview.injectJavaScript(JSSCript)
                        }
                        else if(Value !== "\"" && this.state.SourceClient === '361'){
                            //next step
                            TargetClient = []
                            TargetClient.push("160");
                            this.setState({TargetClient:[...TargetClient]})
                            JSSCript = ""
                            this.webview.injectJavaScript(JSSCript)
                        }

                        else if(Value === "\"" && this.state.SourceClient === '341'){
                            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'420':document.getElementById('QA_420').checked}))"
                            this.webview.injectJavaScript(JSSCript)
                        }
                        else if(Value !== "\"" && this.state.SourceClient === '341'){
                            //next step
                            TargetClient = []
                            TargetClient.push("120");
                            this.setState({TargetClient:[...TargetClient]})
                            JSSCript = ""
                            this.webview.injectJavaScript(JSSCript)
                        }

                        else if(Value === "\"" && this.state.SourceClient === '801'){
                            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'811':document.getElementById('QA_811').checked,'812':document.getElementById('QA_812').checked}))"
                            this.webview.injectJavaScript(JSSCript)
                        }
                        else if(Value !== "\"" && this.state.SourceClient === '801'){
                            //next step
                            TargetClient = []
                            TargetClient.push("800");
                            this.setState({TargetClient:[...TargetClient]})
                            JSSCript = ""
                            this.webview.injectJavaScript(JSSCript)
                        }

                        else if(Value === "\"" && this.state.SourceClient === '361'){
                            JSSCript = "window.ReactNativeWebView.postMessage(JSON.stringify({'461':document.getElementById('QA_461').checked,'462':document.getElementById('QA_462').checked}))"
                            this.webview.injectJavaScript(JSSCript)
                        }
                        else if(Value !== "\"" && this.state.SourceClient === '361'){
                            //next step
                            TargetClient = []
                            TargetClient.push("160");
                            this.setState({TargetClient:[...TargetClient]})
                            JSSCript = ""
                            this.webview.injectJavaScript(JSSCript)
                        }
                    }
                })
            }
        }

        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'461':document.getElementById('QA_461').checked,'462':document.getElementById('QA_462').checked}))"){
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["461"] === false && ClientJSON["462"] === false){
                    TargetClient.push("160");
                }
                else{
                    if(ClientJSON["461"] === true){
                        TargetClient.push("461")
                    }
                    else{
                        ;
                    }
    
                    if(ClientJSON["462"] === true){
                        TargetClient.push("462")
                    }
                    else{
                        ;
                    }
                }
                JSSCript = ""
                this.webview.injectJavaScript(JSSCript)
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                console.log(e)
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'461':document.getElementById('QA_461').checked,'462':document.getElementById('QA_462').checked,'160':document.getElementById('PR_160').checked}))"){
            // get 1 step data
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["461"] === true){
                    TargetClient.push("461")
                }
                else{
                    ;
                }

                if(ClientJSON["462"] === true){
                    TargetClient.push("462")
                }
                else{
                    ;
                }

                TargetClient.push("160");
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }

        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'420':document.getElementById('QA_420').checked}))"){
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["420"] === false && ClientJSON["420"] === false){
                    TargetClient.push("120");
                }
                else{
                    if(ClientJSON["420"] === true){
                        TargetClient.push("420")
                    }
                    else{
                        ;
                    }
                }
                JSSCript = ""
                this.webview.injectJavaScript(JSSCript)
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                console.log(e)
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'420':document.getElementById('QA_420').checked,'120':document.getElementById('PR_120').checked}))"){
            // get 1 step data
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["420"] === true){
                    TargetClient.push("420")
                }
                else{
                    ;
                }

                TargetClient.push("120");
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }

        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'811':document.getElementById('QA_811').checked,'812':document.getElementById('QA_812').checked}))"){
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["811"] === false && ClientJSON["812"] === false){
                    TargetClient.push("800");
                }
                else{
                    if(ClientJSON["811"] === true){
                        TargetClient.push("811")
                    }
                    else{
                        ;
                    }
    
                    if(ClientJSON["812"] === true){
                        TargetClient.push("812")
                    }
                    else{
                        ;
                    }
                }
                JSSCript = ""
                this.webview.injectJavaScript(JSSCript)
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                console.log(e)
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'811':document.getElementById('QA_811').checked,'812':document.getElementById('QA_812').checked,'800':document.getElementById('PR_800').checked}))"){
            // get 1 step data
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["811"] === true){
                    TargetClient.push("811")
                }
                else{
                    ;
                }

                if(ClientJSON["812"] === true){
                    TargetClient.push("812")
                }
                else{
                    ;
                }

                TargetClient.push("800");
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }

        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'401':document.getElementById('QA_401').checked,'402':document.getElementById('QA_402').checked}))"){
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["401"] === false && ClientJSON["402"] === false){
                    TargetClient.push("100");
                }
                else{
                    if(ClientJSON["401"] === true){
                        TargetClient.push("401")
                    }
                    else{
                        ;
                    }
    
                    if(ClientJSON["402"] === true){
                        TargetClient.push("402")
                    }
                    else{
                        ;
                    }
                }
                JSSCript = ""
                this.webview.injectJavaScript(JSSCript)
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                console.log(e)
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }
        else if(JSSCript === "window.ReactNativeWebView.postMessage(JSON.stringify({'401':document.getElementById('QA_401').checked,'402':document.getElementById('QA_402').checked,'100':document.getElementById('PR_100').checked}))"){
            // get 1 step data
            try{
                var ClientJSON = JSON.parse(event.nativeEvent.data)
                TargetClient = []
                if(ClientJSON["401"] === true){
                    TargetClient.push("401")
                }
                else{
                    ;
                }

                if(ClientJSON["402"] === true){
                    TargetClient.push("402")
                }
                else{
                    ;
                }

                TargetClient.push("100");
                this.setState({TargetClient:[...TargetClient]})
            }
            catch(e){
                this.webview.injectJavaScript(JSSCript)
            }
            finally{
                this.webview.injectJavaScript(JSSCript)
            }
        }
    }

    TransportRoles = (/*Client, i, TotalReq*/) => {
        if(ClientIndex < this.state.TargetClient.length){
            this.setState({TransportResponse:'Transporting CR : '+this.state.CR[CRTransportPos]+' to '+this.state.TargetClient[ClientIndex]})
            fetch(this.props.APIIP + 'sapapi/basis/transportRole.php', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    SAPUsername:this.state.SAPUsername,
                    CR:this.state.CR[CRTransportPos],
                    Client:this.state.TargetClient[ClientIndex]
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                    responses = responseJson.message
                    if(responses === '1'){
                        this[`TargetClients${ClientIndex}`].setNativeProps({style:{color:'green'}})
                        const unicode = '\u2713';
                        ArrayClientStatus.push(unicode)
                        CRFinalLog.push('transport ' + this.state.CR[CRTransportPos] + ' to client ' + this.state.TargetClient[ClientIndex] + ' success')
                        CRTempStatus.push(1)
                        this.setState({ClientStatus:ArrayClientStatus, CRFinalLog:CRFinalLog})
                    }
                    else if(responses === '0'){
                        this[`TargetClients${ClientIndex}`].setNativeProps({style:{color:'red'}})
                        ArrayClientStatus.push("(error in SAP/CR Not Found)")
                        CRFinalLog.push('transport ' + this.state.CR[CRTransportPos] + ' to client ' + this.state.TargetClient[ClientIndex] + ' error in SAP/CR not found')
                        CRTempStatus.push(0)
                        this.setState({ClientStatus:ArrayClientStatus, CRFinalLog:CRFinalLog})
                    }
                    else{
                        this[`TargetClients${ClientIndex}`].setNativeProps({style:{color:'red'}})
                        ArrayClientStatus.push("(reg SAPID 1st)")
                        CRFinalLog.push('transport ' + this.state.CR[CRTransportPos] + ' to client ' + this.state.TargetClient[ClientIndex] + ' failed (reg SAPID 1st)')
                        CRTempStatus.push(0)
                        this.setState({ClientStatus:ArrayClientStatus, CRFinalLog:CRFinalLog})
                    }
                    ClientIndex++;
                    this.TransportRoles()
            }).catch((error) => {
                Toast.show({
                    text:'jaringan / server bermasalah',
                    buttonText:'Okay',
                    type:'warning',
                    duration:3000
                })
            })
        }
        else{
            let CRStatusValue = 0
            CRTempStatus.map((value) => {
                CRStatusValue = CRStatusValue + value
            })
            console.log("value CR : " + CRStatusValue)
            if(CRStatusValue !== this.state.TargetClient.length){
                if(CRStatusValue === 0){
                    const unicoder = "\u2718"
                    CRFinalStatusMark.push(unicoder)
                    this.setState({CRFinalStatus:CRFinalStatusMark})
                    this[`CR${CRTransportPos}`].setNativeProps({style:{color:'red'}})
                }
                else{
                    const unicoder = "\u0021"
                    CRFinalStatusMark.push(unicoder)
                    this.setState({CRFinalStatus:CRFinalStatusMark})
                    this[`CR${CRTransportPos}`].setNativeProps({style:{color:'orange'}})
                }
            }
            else{
                const unicoder = "\u2713"
                CRFinalStatusMark.push(unicoder)
                this.setState({CRFinalStatus:CRFinalStatusMark})
                this[`CR${CRTransportPos}`].setNativeProps({style:{color:'green'}})
            }

            CRTransportPos++;
            CRTempStatus = [];

            if(CRTransportPos < this.state.CR.length){
                ClientIndex = 0
                this.state.TargetClient.map((value, index) => {
                    this[`TargetClients${index}`].setNativeProps({style:{color:'black'}})
                    ArrayClientStatus = []
                })
                this.setState({ClientStatus:[]}, () => {
                    this.TransportRoles()
                })
            }
            else{
                ClientIndex = 0
                CRTransportPos = 0
                CRFinalLog = []
                this.setState({TransportResponse:'All Transport Done'}, () => {
                    ArrayClientStatus = [];
                })
            }
        }
    }

    /*TransportRoles = () => {
        var FinishedArray = [];
        this.state.TargetClient.forEach(async (Client, index) => {
            await this.TransportRolesFetch(Client, index)
        })
    }*/

    ConfirmHandleBackButton = () => {
        var RequestMustNull = setInterval(() => {
            if(this.props.RequestType !== ''){
                this.props.ChangeRequestType('')
            }
            else{
                clearInterval(RequestMustNull);
                this.props.navigation.dispatch(BackToHome);
            }
        }, 100);
    }

    HandleBackButton = () => {
        this.ConfirmHandleBackButton();
        return true;
    }

    componentDidMount(){
        this.GetKey()
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    render(){
        return(
            <Root>
                <View style={{flex:1}}>
                    <View style={{flex:2}}>
                        <ScrollView style={{flexGrow:1}}>
                            <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                                {
                                    /* 
                                    <Picker
                                        selectedValue={this.state.SourceClient}
                                        onValueChange={(Value, Index) => {
                                            this.setState({SourceClient:Value})
                                        }}
                                    >
                                        <Picker.Item label="301" value="301" />
                                        <Picker.Item label="303" value="303" />
                                        <Picker.Item label="363" value="363" />
                                        <Picker.Item label="801" value="801" />
                                    </Picker>
                                    */
                                }
                                <Text style={{fontWeight:'bold'}}>Transport To : </Text>
                                {
                                    this.state.TargetClient.map((value, i) => {
                                        return(
                                            <Text key={i} ref={refs => {this[`TargetClients${i}`] = refs}}>{value} {this.state.ClientStatus[i]}</Text>
                                        )
                                    })
                                }
                                <Text style={{fontWeight:'bold'}}>with CR : </Text>
                                {
                                    this.state.CR.map((value, index) => {
                                        return(
                                            <Text key={value} ref={refval => {this[`CR${index}`] = refval}}>{value} {this.state.CRFinalStatus[index]}</Text>
                                        )
                                    })
                                }
                                <Text>Status : {this.state.TransportResponse}</Text>
                                <Text style={{fontWeight:'bold'}}>LOG : </Text>
                                {
                                    this.state.CRFinalLog.map((value, index) => {
                                        return(
                                            <Text key={value}>- {value}</Text>
                                        )
                                    })
                                }
                                <View style={{width:width, height:width/10, flexDirection:'row', marginTop:10}}>
                                    <View style={{flex:1}}>
                                        <TouchableHighlight onPress={() => 
                                            {
                                                this.state.TargetClient.map((value, index) => {
                                                    this[`TargetClients${index}`].setNativeProps({style:{color:'black'}})
                                                })
                                                this.state.CR.map((value, index) => {
                                                    this[`CR${index}`].setNativeProps({style:{color:'black'}})
                                                })
                                                this.setState({ClientStatus:[], CRFinalStatus:[], CRFinalLog:[]},() => {
                                                    CRFinalStatusMark = [];
                                                    this.TransportRoles()
                                                })
                                            }} 
                                            style={{backgroundColor:'transparent', height:width/10, borderRadius:100, borderWidth:2, borderColor:'grey', justifyContent:'center', alignItems:'center', marginLeft:10, marginRight:10}}>
                                            <Text>TRANSPORT</Text>
                                        </TouchableHighlight>
                                    </View>
                                    
                                    <View style={{flex:1}}>
                                        <TouchableHighlight onPress={() => 
                                            {
                                                this.state.TargetClient.map((value, index) => {
                                                    this[`TargetClients${index}`].setNativeProps({style:{color:'black'}})
                                                })
                                                this.state.CR.map((value, index) => {
                                                    this[`CR${index}`].setNativeProps({style:{color:'black'}})
                                                })
                                                this.setState({ClientStatus:[], CRFinalStatus:[], CRFinalLog:[]},() => {
                                                    CRFinalStatusMark = [];
                                                    this.StartSraping()
                                                })
                                            }} 
                                            style={{backgroundColor:'transparent', height:width/10, borderRadius:100, borderWidth:2, borderColor:'grey', justifyContent:'center', alignItems:'center', marginLeft:10, marginRight:10}}>
                                            <Text>MANUAL SCRAPPING</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{flex:1}}>
                        <WebView ref={c => this.webview = c} 
                            source={{uri:'https://es.cp.co.id/ebasis.php?ecsno=' + this.props.Link}}
                            injectedJavaScript={JSSCript}
                            onMessage={this.GetEbasisContent}
                            onLoadEnd={() => this.StartSraping()}
                        />
                    </View>
                </View>
            </Root>
        )
    }
}

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

const TransportRole = connect(MapStateToProps, MapDispatchToProps)(TransportRoleClass)

export default withNavigation(TransportRole)