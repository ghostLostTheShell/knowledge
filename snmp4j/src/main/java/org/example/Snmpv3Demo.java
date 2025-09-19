package org.example;

import org.snmp4j.PDU;
import org.snmp4j.ScopedPDU;
import org.snmp4j.Snmp;
import org.snmp4j.UserTarget;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.MPv3;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.security.*;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

import java.io.IOException;
import java.util.List;

public class Snmpv3Demo {
    static byte[] bytes = new byte[] {
            (byte) 0x80, (byte) 00, (byte) 0xc7, (byte) 0xbf, 0x03, 0x78, (byte) 0xd8, 0x00, 0x30, 0x53, 0x6e};

    public static void main(String[] args) throws IOException {
        Snmp snmp = new Snmp(new DefaultUdpTransportMapping());

        //snmp.getMessageDispatcher().addMessageProcessingModel(new MPv1());
        //snmp.getMessageDispatcher().addMessageProcessingModel(new MPv2c());
        //snmp.getMessageDispatcher().addMessageProcessingModel(new MPv3());

        USM usm = new USM(
                SecurityProtocols.getInstance(),
                new OctetString(MPv3.createLocalEngineID(new OctetString(bytes))),
                0);
        SecurityModels.getInstance().addSecurityModel(usm);

        snmp.listen();

        UsmUser user = new UsmUser(
                new OctetString("user1"),
                AuthMD5.ID, new OctetString("123456789"),
                null, null);

        snmp.getUSM().addUser(new OctetString("user1"), user);

        UserTarget target = new UserTarget();
        target.setVersion(SnmpConstants.version3);
        target.setAddress(new UdpAddress("192.168.2.45/161"));
        target.setSecurityLevel(SecurityLevel.AUTH_NOPRIV);
        target.setSecurityName(new OctetString("user1"));
        //target.setAuthoritativeEngineID(bytes);
        target.setTimeout(3000);

        target.setRetries(0);


        OctetString contextEngineId = new OctetString(bytes);

        sendRequest(snmp, createGetPdu(contextEngineId), target);
    }


    private static void sendRequest(Snmp snmp, PDU pdu, UserTarget target)
            throws IOException {

        ResponseEvent responseEvent = snmp.send(pdu, target);
        PDU response = responseEvent.getResponse();

        if (response == null) {
            System.out.println("TimeOut...");
        } else {
            if (response.getErrorStatus() == PDU.noError) {
                List<? extends VariableBinding> variableBindings = response.getVariableBindings();
                for (VariableBinding vb : variableBindings) {
                    System.out.println(vb + " ," + vb.getVariable().getSyntaxString());
                }
            } else {
                System.out.println("Error:" + response.getErrorStatusText());
            }
        }
    }
    private static PDU createGetPdu(OctetString contextEngineId) {
        ScopedPDU pdu = new ScopedPDU();

        pdu.setType(PDU.GET);
        //pdu.setContextEngineID(contextEngineId);	//if not set, will be SNMP engine id
        //pdu.setContextName(new OctetString("user1"));  //must be same as SNMP agent
        pdu.setMaxRepetitions(2);
        pdu.setNonRepeaters(1);
        //pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0")));	//sysUpTime
        //pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.5.0")));	//sysName
        //pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.5")));	//expect an no_such_instance error
        pdu.add(new VariableBinding(new OID(".1.6.3.1.2.1.1.1.0")));
        return pdu;
    }
}
