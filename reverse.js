/**
 * Created by suparngupta on 2/1/16.
 */

var _ = require("lodash");
var fs = require("fs");
var exchangesSuffixes = {
    A: "AMEX",
    O: "NASDAQ",
    N: "NYSE"
};

var reverse = function (rics) {
    var symbols = [];
    _.each(rics, function (ric) {
        var tokens = ric.split('.');
        var prefix = tokens[0];
        if(_.includes(prefix, "_p")){
            prefix = prefix.replace("_p", "^");
        }
        symbols.push(exchangesSuffixes[tokens[1]] + ':' + prefix.toUpperCase().trim());
    });
    console.log(symbols.join(","));
};

var input = "TRQ.N KLDX.A CDE.N SAND.A EGO.N VALE.N NGD.A FSM.N PPP.N NSU.A DRD.N AG.N MDM.O AGI.N PGLC.O " +
    "GFI.N RIC.A NG.A BVN.N MSB.N SSRI.O PVG.N FCX.N SA.N MVG.A SWC.N PAAS.O TAHO.N AU.N SBGL.N ABX.N DDC.N " +
    "GG.N SLW.N CCJ.N NEM.N BHP.N RIO.N SCCO.N AEM.N RGLD.O FNV.N GOLD.O";

var rics = input.split(/\s/i);
reverse(rics);