import React, { Component } from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {Container, Thumbnail, View, List, ListItem, Left, Right, Text, Icon, Toast} from 'native-base';
import {ImageBackground, Dimensions, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

var timeout = null;
const PreventBack = StackActions.reset({
    index: 0,
    actions:[NavigationActions.navigate({routeName:'Login'})],
});

class Sidebar extends React.Component{
    state={
        ScreenType:'',
        Basis:false,
        NetworkAdmin:false,
        UserSupport:false,
        SystemAdmin:false,
    }

    
    async DeleteKey() {
        try{
            await AsyncStorage.removeItem('user');
        }
        catch(error){
            console.log(error)
        }
    }

    Logout = () => {
        this.DeleteKey();
        this.props.navigation.dispatch(PreventBack);
    }

    async CheckUserType(){
        try{
            const value = await AsyncStorage.getItem('user', (err, result) => {
                if(result){
                    let ResultParsed = JSON.parse(result);
                    fetch(this.props.APIIP + 'dcoappapi/check_user_type', {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                        username: ResultParsed.username
                        }),
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                    var Basis = responseJson.basis
                    var NetworkAdmin = responseJson.network_admin
                    var UserSupport = responseJson.user_support
                    var SystemAdmin = responseJson.system_admin
                    clearInterval(timeout);
                    if(Basis === '1'){
                        this.setState({Basis:true})
                    }
                    if(NetworkAdmin === '1'){
                        this.setState({NetworkAdmin:true})
                    }
                    if(UserSupport === '1'){
                        this.setState({UserSupport:true})
                    }
                    if(SystemAdmin === '1'){
                        this.setState({SystemAdmin:true})
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
                else{
                    Toast.show({
                        text:'please restart aplication can\'t receive data ',
                        buttonText:'Okay',
                        type:'warning',
                        duration:3000
                    })
                }
            })
        }
        catch(error){
            Toast.show({
                text:'please restart aplication',
                buttonText:'Okay',
                type:'warning',
                duration:3000
            })
        }
    }

    HandleClick(value){
        let ClearRequestMessage = setInterval(() => {
            if(this.props.Request !== '' && this.props.Link !== 'https://es.cp.co.id/mybox.php'){
                this.props.MessageSend('');
                this.props.ChangeLink('https://es.cp.co.id/mybox.php');
            }
            else{
                clearInterval(ClearRequestMessage)
                let ClearRequestType = setInterval(() => {
                    if(this.props.Request !== '' || this.props.RequestType !== '' || this.props.SAPID !== '' || this.props.Client !== '' || this.props.ResetState !== ''){
                        this.props.ChangeRequestType('');
                        this.props.ChangeSAPID('');
                        this.props.ChangeClient('');
                        this.props.ChangeResetState('');
                        this.props.MessageSend('');
                        console.log(this.props.Request)
                    }
                    else{
                        clearInterval(ClearRequestType)
                        this.props.SelectMenuType(value);
                        this.props.CloseDrawer();
                    }
                },500)
            }
        },500)
    }

    componentDidMount(){
        timeout = setInterval(()=> {this.CheckUserType()}, 2000);
    }

    render(){

        return(
            <Container>
                <ImageBackground source={require('./src/img/ProfileBackground.jpg')} style={styles.ProfileContainer}>
                    <Thumbnail large source={require('./src/img/Profile.jpg')} />
                </ImageBackground>
                <View style={styles.MenuContainer}>
                    <List>
                        <ListItem onPress={()=>{this.HandleClick('HOME')}}>
                            <Left><Text>Home</Text></Left>
                            <Right><Icon name="arrow-forward" /></Right>
                        </ListItem>
                        {
                            this.state.Basis ?
                            <ListItem onPress={()=>{this.HandleClick('UNLOCKSAPID')}}>
                                <Left><Text>Unlock / Lock SAP ID</Text></Left>
                                <Right><Icon name="arrow-forward" /></Right>
                            </ListItem>
                            :
                            null
                        }
                        {
                            this.state.Basis ?
                            <ListItem onPress={()=>{this.HandleClick('CREATESAPID')}}>
                                <Left><Text>Create/Delete SAP ID</Text></Left>
                                <Right><Icon name="arrow-forward" /></Right>
                            </ListItem>
                            :
                            null
                        }
                        {
                            this.state.Basis ?
                            <ListItem onPress={()=>{this.HandleClick('REGISTERSAPID')}}>
                                <Left><Text>Register SAP ID</Text></Left>
                                <Right><Icon name="arrow-forward" /></Right>
                            </ListItem>
                            :
                            null
                        }
                        {
                            this.state.Basis ?
                            <ListItem onPress={()=>{this.HandleClick('ASSIGNSAPROLE')}}>
                                <Left><Text>Assign SAP ROLE</Text></Left>
                                <Right><Icon name="arrow-forward" /></Right>
                            </ListItem>
                            :
                            null
                        }
                        <ListItem onPress={() => this.Logout()}>
                            <Left><Text>Logout</Text></Left>
                            <Right><Icon name="arrow-forward" /></Right>
                        </ListItem>
                    </List>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    ProfileContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    MenuContainer:{
        flex:3,
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
        Link:state.reducer.Link
    }
}

const MapDispatchToProps = (dispatch) =>{
    return{
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


const SidebarRedux = connect(MapStateToProps, MapDispatchToProps)(Sidebar)

export default withNavigation(SidebarRedux)