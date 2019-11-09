import React, {Component} from 'react';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {StyleSheet, ImageBackground, Dimensions, BackHandler, Animated, Alert, ScrollView, Text, View, StatusBar, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {Root, Icon} from 'native-base';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { ProgressCircle }  from 'react-native-svg-charts'

class Monitoring extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View>
                <ProgressCircle style={{height:200}} progress={0.6} progressColor={'rgb(134,65,244)'} />
                <Text style={{position:'absolute', transform:[{translateX:150}, {translateY:150}]}}>Hello world</Text>
            </View>
        )
    }
}

export default withNavigation(Monitoring)
