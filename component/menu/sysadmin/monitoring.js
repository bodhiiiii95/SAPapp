import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {StyleSheet, ImageBackground, Dimensions, BackHandler, Animated, Alert, ScrollView, Text, View, StatusBar, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {Root, Tab, Toast, Container, Header, Tabs} from 'native-base';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { ProgressCircle }  from 'react-native-svg-charts'

const height = Dimensions.get("screen").height
const width = Dimensions.get("screen").width
const BackToHome = StackActions.pop({
    n:1
})

class Monitoring extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            CPUPerentage:0,
            CPUPercentageSymbol:'0%',
            VmemUsagePercentage:0,
            VmemUsageSymbol:'0%',
            VmemTotal:0,
            VmemUsageMB:0,
            ExitStatus:1
        }
    }

    GetCPUUsagePercentage = () => {
        fetch(this.props.APIIP + 'dcoappapi/cpu_percentage', {
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
            var response = responseJson.cpu
            var FloatingNum = (parseFloat(response) / 100).toFixed(3)
            var PercentageSymbol = response
            this.setState({CPUPerentage:FloatingNum, CPUPercentageSymbol:PercentageSymbol+'%'}, () => {
                var WaitOneSecond = setTimeout(() => {
                    this.GetCPUUsagePercentage()
                }, 3000)
        })
        }).catch((error) => {
            console.log(this.props.APIIP + 'dcoappapi/cpu_percentage')
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    GetVmemUsage = () => {
        fetch(this.props.APIIP + 'dcoappapi/vmem_usage', {
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
            var response = responseJson.vmem
            var TotalVmem = parseInt(responseJson.TotalVmem)
            var UsedVmem = parseInt(responseJson.UsedVmem)
            var FloatingNum = (parseFloat(response) / 100).toFixed(2)
            var PercentageSymbol = response
            this.setState({VmemUsagePercentage:FloatingNum, VmemUsageSymbol:PercentageSymbol+'%', VmemTotal:TotalVmem, VmemUsageMB:UsedVmem}, () => {
                var WaitOneSecond = setTimeout(() => {
                    this.GetVmemUsage()
                }, 3000)
        })
        }).catch((error) => {
            console.log(this.props.APIIP + 'dcoappapi/cpu_percentage')
            Toast.show({
                text:'tidak terhubung ke jaringan / server bermasalah',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        })
    }

    componentDidMount(){
        this.GetCPUUsagePercentage()
        this.GetVmemUsage()
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton);
    }

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

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.HandleBackButton);
    }

    render(){
        return(
            <Root>
                <View style={{flex:1}}>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold'}}>INTERNAL SERVER STATUS</Text>
                    </View>
                    <View style={{flex:4, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text>CPU Usage : </Text>
                            </View>
                            <View style={{flex:6, justifyContent:'center', alignContent:'center'}}>
                                <ProgressCircle style={{height:width/3}} progress={this.state.CPUPerentage} progressColor={'rgb(134,65,244)'}/>
                                <View style={{position:'absolute', width:width/2, justifyContent:'center', alignItems:'center'}}>
                                    <Text>{this.state.CPUPercentageSymbol}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:1 , justifyContent:'center', alignContent:'center'}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text>Virtual Memory Usage : </Text>
                                <Text>{this.state.VmemUsageMB}/{this.state.VmemTotal} MB</Text>
                            </View>
                            <View style={{flex:6, justifyContent:'center', alignContent:'center'}}>
                                <ProgressCircle style={{height:width/3}} progress={this.state.VmemUsagePercentage} progressColor={'rgb(134,65,244)'}/>
                                <View style={{position:'absolute', width:width/2, justifyContent:'center', alignItems:'center'}}>
                                    <Text>{this.state.VmemUsageSymbol}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flex:7}}>
                        
                    </View>
                </View>
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

const MenuAppRedux = connect(MapStateToProps, MapDispatchToProps)(Monitoring)
export default withNavigation(MenuAppRedux)
