package org.example.server;

import org.snmp4j.*;
import org.snmp4j.mp.MPv1;
import org.snmp4j.mp.MPv2c;
import org.snmp4j.mp.MPv3;
import org.snmp4j.security.*;
import org.snmp4j.smi.*;
import org.snmp4j.transport.DefaultTcpTransportMapping;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.snmp4j.util.MultiThreadedMessageDispatcher;
import org.snmp4j.util.ThreadPool;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.List;


public class TrapReceiver implements CommandResponder {
    private MultiThreadedMessageDispatcher dispatcher;
    private Snmp snmp = null;
    private Address listenAddress;
    private ThreadPool threadPool;

    public TrapReceiver() {
    }

    private void init() throws UnknownHostException, IOException {
        threadPool = ThreadPool.create("TrapPool", 2);
        dispatcher = new MultiThreadedMessageDispatcher(threadPool,
                new MessageDispatcherImpl());
        listenAddress = GenericAddress.parse(System.getProperty(
                "snmp4j.listenAddress", "udp:192.168.2.100/162"));
        TransportMapping transport;
        if (listenAddress instanceof UdpAddress) {
            transport = new DefaultUdpTransportMapping(
                    (UdpAddress) listenAddress);
        } else {
            transport = new DefaultTcpTransportMapping(
                    (TcpAddress) listenAddress);
        }
        snmp = new Snmp(dispatcher, transport);
        snmp.getMessageDispatcher().addMessageProcessingModel(new MPv1());
        snmp.getMessageDispatcher().addMessageProcessingModel(new MPv2c());
        snmp.getMessageDispatcher().addMessageProcessingModel(new MPv3());

        SecurityProtocols instance = SecurityProtocols.getInstance();
        instance.addAuthenticationProtocol(new AuthMD5());
        USM usm = new USM(SecurityProtocols.getInstance(), new OctetString(
                MPv3.createLocalEngineID()), 0);

        usm.addUser(new OctetString("xxx"),
                new UsmUser(new OctetString("user1"),
                        AuthMD5.ID, new OctetString("123456789"),
                        //PrivDES.ID, new OctetString("MD5DESUserPrivPassword"
                        null, null ));

        SecurityModels.getInstance().addSecurityModel(usm);
        snmp.listen();
    }

    public void run() {
        System.out.println("----> Trap Receiver run ... <----");
        try {
            init();
            snmp.addCommandResponder(this);

            System.out.println("----> 开始监听端口，等待Trap message  <----");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    @Override
    public <A extends Address> void processPdu(CommandResponderEvent<A> event) {
        System.out.println("----> 开始解析ResponderEvent: <----");
        if (event == null || event.getPDU() == null) {
            System.out.println("[Warn] ResponderEvent or PDU is null");
            return;
        }
        List<? extends VariableBinding> variableBindings = event.getPDU().getVariableBindings();
        System.out.println(variableBindings);
        System.out.println("警告IP" + event.getPeerAddress().toString());
        for (VariableBinding vb : variableBindings) {
            System.out.println(vb.getOid() + " = " + vb.getVariable());
        }
        System.out.println("---->  本次ResponderEvent 解析结束 <----");
    }

    public static void main(String[] args) {
        TrapReceiver trapReceiver = new TrapReceiver();
        trapReceiver.run();
    }
}
