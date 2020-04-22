const AWS = require('aws-sdk')
const flat = require('flat')
const unflatten = require('flat').unflatten
  

function handler(event){
    var reported = event.reported
    var thingname = (event.topic).split('/')[2]
    var thingendpoint = "a2w9ms3po56adk-ats.iot.us-west-2.amazonaws.com"
    AWS.config.region = "us-west-2"
    var params = {
        'thingName': thingname
    }
    if(reported!=null){
        var shadow = new AWS.IotData({endpoint: thingendpoint});
        shadow.getThingShadow(params, function(err, res){
            if (err){
                console.log(err)
            }
            else{
                let shadowdata = res.payload
                shadowdata = JSON.parse(shadowdata)
                let desiredstatedata = flat(shadowdata.state.desired)
                let reportedstatedata = flat(shadowdata.state.reported)
                let desiredstatedatakeys = Object.keys(desiredstatedata)
                let arraylength = desiredstatedatakeys.length
                let payload = {}
                let flag = 0
                while(arraylength>0)
                {
                    let key = desiredstatedatakeys[arraylength-1]
                    if(reportedstatedata[key] != desiredstatedata[key]){
                        desiredstatedatakeys.splice(arraylength-1,1)
                    }
                    else{
                        payload['state.desired.'+key] = null
                        flag = 1
                    }
                    arraylength --;
                }
                if(flag==1)
                {
                    payload = JSON.stringify(unflatten(payload))
                    console.log(desiredstatedatakeys)
                    console.log(payload)
                    updatethingshadowparams = {
                        'thingName': thingname,
                        'payload': payload
                    }
                    shadow.updateThingShadow(updatethingshadowparams, function(err, res){
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log(res)
                        }
                    })
                }
            }
        })
    }
};

var eventparam = {
    topic: "$aws/things/RaspberryPi/shadow/update/accepted",
    reported: { "state": "logs"}
}
handler(eventparam)
exports.handler = handler