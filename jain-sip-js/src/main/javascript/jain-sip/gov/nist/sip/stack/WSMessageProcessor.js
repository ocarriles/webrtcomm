/*
 * TeleStax, Open Source Cloud Communications  Copyright 2012. 
 * and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

/*
 *  Implementation of the JAIN-SIP WSMessageProcessor .
 *  @author Yuemin Qin (yuemin.qin@orange.com)
 *  @author Laurent STRULLU (laurent.strullu@orange.com)
 *  @version 1.0 
 *   
 */
function WSMessageProcessor(sipStack, wsUrl) {
    if(logger!=undefined) logger.debug("WSMessageProcessor:WSMessageProcessor()");
    this.classname="WSMessageProcessor";
    this.sipStack=sipStack;
    this.wsMessageChannel=new WSMessageChannel(this, wsUrl);
    this.sentByHostPort=new HostPort();
    this.sentByHostPort.setHost(new Host(this.sipStack.getHostAddress()));
    this.sentBy=null;
    this.sentBySet=null;
}

WSMessageProcessor.prototype.getTransport =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getTransport()");
    return this.wsMessageChannel.getTransport();
}

WSMessageProcessor.prototype.getMessageChannel =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getMessageChannel()");
    return this.wsMessageChannel;
}

WSMessageProcessor.prototype.getSIPStack =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getSIPStack()");
    return this.sipStack;
}

WSMessageProcessor.prototype.getInfoApp =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getInfoApp()");
    return this.infoApp;
}

WSMessageProcessor.prototype.stop =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:stop()");
    this.isRunning = false;
    this.wsMessageChannels.close();
}

WSMessageProcessor.prototype.getMaximumMessageSize =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getMaximumMessageSize()");
    return 0x7fffffff;
}

WSMessageProcessor.prototype.getViaHeader =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getViaHeader()");
    var via = new Via();
    if (this.sentByHostPort != null) {
        via.setSentBy(this.sentByHostPort);
        via.setTransport(this.getTransport());
    } else {
        var host = new Host();
        host.setHostname(this.sipStack.getHostAddress());
        via.setHost(host);
        via.setTransport(this.getTransport());
    }
    via.setBranch(Utils.prototype.generateBranchId());
    return via;
}

WSMessageProcessor.prototype.getDefaultTargetPort =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getDefaultTargetPort()");
    return 5060;
}

WSMessageProcessor.prototype.isSecure =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:isSecure()");
    return false;
}

WSMessageProcessor.prototype.getListeningPoint =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getListeningPoint()");
    return this.listeningPoint;
}

WSMessageProcessor.prototype.setListeningPoint =function(lp){
    if(logger!=undefined) logger.debug("WSMessageProcessor:setListeningPoint():lp:"+lp);
    this.listeningPoint = lp;
}

WSMessageProcessor.prototype.initialize =function(infoApp,transactionStack){
    if(logger!=undefined) logger.debug("WSMessageProcessor:initialize():infoApp="+infoApp+", transactionStack="+transactionStack);
    this.sipStack = transactionStack;
    this.infoApp=infoApp;
}

WSMessageProcessor.prototype.setSentBy =function(sentBy){
    if(logger!=undefined) logger.debug("WSMessageProcessor:setSentBy():sentBy="+sentBy);
    var ind = sentBy.indexOf(":");
    if (ind == -1) {
        this.sentByHostPort = new HostPort();
        this.sentByHostPort.setHost(new Host(sentBy));
    } else {
        this.sentByHostPort = new HostPort();
        this.sentByHostPort.setHost(new Host(sentBy.substring(0, ind)));
        var portStr = sentBy.substring(ind + 1);
        try {
            var port = portStr;
            this.sentByHostPort.setPort(port);
        } catch (ex) {
            console.error("WSMessageProcessor:setSentBy(): bad format encountered at ", ind);
            throw "WSMessageProcessor:setSentBy(): bad format encountered at "+ ind;
        }
    }
    this.sentBySet = true;
    this.sentBy = sentBy;
}

WSMessageProcessor.prototype.getSentBy =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getSentBy()");
    if (this.sentBy == null && this.sentByHostPort != null) {
        this.sentBy = this.sentByHostPort.toString();
    }
    return this.sentBy;
}

WSMessageProcessor.prototype.getPort =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getPort()");
    return this.port;
}

WSMessageProcessor.prototype.getDefaultPort =function(){
    if(logger!=undefined) logger.debug("WSMessageProcessor:getDefaultPort()");
    var retval=5060
    return retval;
}