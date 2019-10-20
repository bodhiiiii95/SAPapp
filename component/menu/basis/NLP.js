import React, {Component} from 'react';

export default class NLPS extends React.Component{

    constructor(props){
        super(props)

        //this.PredictSAPID = this.PredictSAPID.bind(this);
    }

    Tokenization(RequestString){
        var SeparateWord1 = RequestString.split(' ')
        const tag = ['extend', 'id', 'sap', 'user'];
        const separator = [':', '='];
        var SAPID;
        let WordPos = 0;

        SeparateWord1.map((word) => {
            var lower = word.toLowerCase();
            tag.map((tags) => {
                if(lower === tags){
                    if(SeparateWord1[WordPos+1].toLowerCase() === tags){
                        ;
                    }
                    else{
                        SAPID = SeparateWord1[WordPos+1];
                    }
                }
                else{
                    ;
                }
            })
            separator.map((separate) => {
                if(SAPID === separate){
                    SAPID = SeparateWord1[WordPos+2]
                }
                else{
                    ;
                }
            })
            
            WordPos++;
        })
        return SAPID;
    }
}