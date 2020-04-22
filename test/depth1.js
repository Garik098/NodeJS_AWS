let chai = require('chai');
let expect = chai.expect;
let testcases = require('../local')
const AWS = require('aws-sdk')


depth1result = {
    
}

function deviceshadow(){
    var thingendpoint = "a2w9ms3po56adk-ats.iot.us-west-2.amazonaws.com"
    AWS.config.region = "us-west-2"
}

describe('testcases', () => {
    it('Test depth1 scenario', (done) => {
        testcases.handler(event).then(function(result){
            expect(result).to.equal(depth1result);
            done();
        })
    });
});