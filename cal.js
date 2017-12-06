function netclasschange(){
  var x = document.getElementById("netclass").value;
  var select = document.getElementById("subnet");
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
  for (var i = 32; i >= x; i--) {
    var option = document.createElement("option");
    option.value = i;
    var ip = find_IP(i);
    var node = document.createTextNode( ip + "   /   " + i);
    option.appendChild(node);
    select.appendChild(option);
  }
  return 0;
}

function find_IP(bit) {
  var ip = ""
  // alert(ip +'...'+ bit );
  for (var i = 1; i <= 4; i++) {
    if (bit >= 8) {
      ip += 255;
      bit -= 8;
    } else if (bit > 0) {
      var val = 0;
      for (; bit > 0; bit--) {
        val += Math.pow(2, 8 - bit);
      }
      ip += val;
    } else {
      ip += 0;
    }
    if (i < 4) {
      ip += ".";
    }
  }
  // alert(ip +'...'+ bit );
  return ip;
}
function cal_Broadcast(network_Addr, num) {
   network_Addr = network_Addr.split(".");
  for (var i = 3; i >= 0; i--) {
    network_Addr[i] = parseInt(network_Addr[i]);
    network_Addr[i] += num % 256;
    num = Math.floor(num / 256);
  }
  return network_Addr.join(".");
}

function cal_usable(network_Addr, broadcast_Addr, num_usable) {
  if (num_usable == 0) {
    return "NA";
  }
  network_Addr = network_Addr.split(".");
  broadcast_Addr = broadcast_Addr.split(".");
  network_Addr[3] = parseInt(network_Addr[3]) + 1;
  broadcast_Addr[3] = parseInt(broadcast_Addr[3]) - 1;
  return network_Addr.join(".") + " - " + broadcast_Addr.join(".");
}
function cal_Network_Addr(ip, subnet_mask) {
  ip = ip.split(".");
  subnet_mask = subnet_mask.split(".");
  // alert(subnet_block );
  var network_Addr = [];
  for (var i = 0; i < 4; i++) {
    network_Addr[i] = subnet_mask[i] & ip[i];
  }
  return network_Addr.join(".");
}

function cal_wildcard(subnet_mask) {
  subnet_mask = subnet_mask.split(".");
  for (var i in subnet_mask) {
    subnet_mask[i] = (~(subnet_mask[i]) & 255);
  }
  return subnet_mask.join(".");
}

function binSubnet(dec){
    return ("00000000" + (dec >>> 0).toString(2)).substr(-8);
}

function cal_binSubnet(subnet_mask) {
  subnet_mask = subnet_mask.split(".");
  for (var i in subnet_mask) {
    subnet_mask[i] = binSubnet(subnet_mask[i]);
  }
  return subnet_mask.join(".");
}

function cal_binId(ip) {
  ip = ip.split(".");
  for (var i in ip) {
    ip[i] = binSubnet(ip[i]);
  }
  return ip.join("");
}

function cal_ip_type(ip) {
  ip = ip.split(".");
  if ((ip[0] == 10) || (ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31) || (ip[0] == 192 && ip[1] == 168)) {
    return "Private";
  }
  return "Public";
}

function getResult() {
      var IP_Addr = document.getElementById("ipaddress");
          if (IP_Addr.validity.patternMismatch || IP_Addr.value === '') {
            alert("Invalid IP Address" );
          }else{
            document.getElementById("allshow").style.display = "block";
            var message = document.getElementById("ipaddress").value;
            var subnet_mask = find_IP(document.getElementById("subnet").value);
            var networkAddr = cal_Network_Addr(message, subnet_mask);
            var num_host = Math.pow(2, 32 - document.getElementById("subnet").value);
            var num_usable = num_host - 2;
            if (num_usable < 0) {
              num_usable = 0;
            }
            var broadcastAddr = cal_Broadcast(networkAddr, num_host - 1);
            var usable_host = cal_usable(networkAddr, broadcastAddr, num_usable);
            var ipclass ="";
            if (document.getElementById("subnet").value>23 && document.getElementById("subnet").value<33) {
              document.getElementById("result_ipClass").style.display = "block";
              document.getElementById("result_ipClass-L").style.display = "table-cell";
              ipclass = "C";
            }else if (document.getElementById("subnet").value>15) {
              document.getElementById("result_ipClass").style.display = "block";
              document.getElementById("result_ipClass-L").style.display = "table-cell";
              ipclass = "B";
            }else if (document.getElementById("subnet").value>7 && document.getElementById("subnet").value<16){
              document.getElementById("result_ipClass").style.display = "block";
              document.getElementById("result_ipClass-L").style.display = "table-cell";
              ipclass = "A";
            }else {
              document.getElementById("result_ipClass").style.display = "none";
              document.getElementById("result_ipClass-L").style.display = "none";
            }
            var wildcard = cal_wildcard(subnet_mask);
            var CIDR_no = "/" + document.getElementById("subnet").value;
            var binsub = cal_binSubnet(subnet_mask);
            var binid = cal_binId(message);
            var short = message + CIDR_no ;
            var intid = parseInt(binid, 2);
            var hexid = "0x" + intid.toString(16);
            var IP_Type = cal_ip_type(message);
            $("#result_ipAddr").contents()[0].data = message;
            $("#result_networkAddr").contents()[0].data = networkAddr;
            $("#result_ipRange").contents()[0].data = usable_host;
            $("#result_broadcast").contents()[0].data = broadcastAddr;
            $("#result_totalHost").contents()[0].data = num_host;
            $("#result_usableHost").contents()[0].data = num_usable;
            $("#result_subnetMask").contents()[0].data = subnet_mask;
            $("#result_wildcard").contents()[0].data = wildcard;
            $("#result_binarySubnet").contents()[0].data = binsub;
            $("#result_ipClass").contents()[0].data = ipclass;
            $("#result_cidr").contents()[0].data = CIDR_no;
            $("#result_ipType").contents()[0].data = IP_Type;
            $("#result_short").contents()[0].data = short;
            $("#result_binaryId").contents()[0].data = binid;
            $("#result_intId").contents()[0].data = intid;
            $("#result_hexId").contents()[0].data = hexid;
            $("#result_addrArpa").contents()[0].data = message.split(".").reverse().join(".") + ".in-addr.arpa";
            if (document.getElementById("subnet").value != 32 && document.getElementById("subnet").value != 24 && document.getElementById("subnet").value != 16 && document.getElementById("subnet").value != 8) {
              document.getElementById("possible").style.display = "block";
              possible_network(message,document.getElementById("subnet").value, num_host);
            }
            return false;
          }


}
var position = "";
function find_start_IP(ip, subnet, code) {
  ip = ip.split(".");
  ip[3] = code;
  position = 3;
  if (subnet < 24) {
    ip[2] = code;
    position = 2;
  }
  if (subnet < 16) {
    ip[1] = code;
    position = 1;
  }
  if (subnet < 8) {
    ip[0] = code;
    position = 0;
  }
  if (code == "*") {
    if (subnet < 8) {
      return "";
    } else {
      return " for " + ip.join(".");
    }
  } else {
    return ip.join(".");
  }
}

function possible_network(ip, subnet, num_host) {
  var div_table_3 = document.getElementById("div-table-3");
  div_table_3.className = "";
  while (div_table_3.firstChild) {
    div_table_3.removeChild(div_table_3.firstChild);
  }
  div_table_3.className = "mainbox";
  var table = document.createElement("table");
  table.id = "table-3";
  table.className = "table";
  var head = document.createElement("h2");
  head.id = "div3header";
  var start_IP = find_start_IP(ip, subnet, 0);
  var start_IP_star = find_start_IP(ip, subnet, "*");
  head.appendChild(document.createTextNode("All possible /" + subnet + " Networks"));
  // div_table_3.appendChild(head);
  // div_table_3.appendChild(document.createElement("hr"));
  var tr = document.createElement("tr");
  var th_1 = document.createElement("th");
  var th_2 = document.createElement("th");
  var th_3 = document.createElement("th");
  th_1.appendChild(document.createTextNode("Network Address"));
  th_1.id = "all_addr";
  th_2.appendChild(document.createTextNode("Usable Host Range"));
  th_2.id = "all_host";
  th_3.appendChild(document.createTextNode("Broadcast Address"));
  th_3.id = "all_broad";
  tr.appendChild(th_1);
  tr.appendChild(th_2);
  tr.appendChild(th_3);
  table.appendChild(tr);
  var plus_ip = Math.pow(2, subnet % 8)
  start_IP = start_IP.split(".");
  for (var i in start_IP) {
    start_IP[i] = parseInt(start_IP[i]);
  }
  for (var i = 1; i <= plus_ip; i++) {
    var broadcast_Addr = cal_Broadcast(start_IP.join("."), num_host - 1);
    var usable_host = cal_usable(start_IP.join("."), broadcast_Addr, 1);
    var tr = document.createElement("tr");
    var td_1 = document.createElement("td");
    var td_2 = document.createElement("td");
    var td_3 = document.createElement("td");
    td_1.appendChild(document.createTextNode(start_IP.join(".")));
    td_1.id = "all_addr";
    td_2.appendChild(document.createTextNode(usable_host));
    td_2.id = "all_host";
    td_3.appendChild(document.createTextNode(broadcast_Addr));
    td_3.id = "all_broad";
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    tr.appendChild(td_3);
    table.appendChild(tr);
    start_IP[position] += Math.pow(2, 8 - (subnet % 8));
  }
  div_table_3.appendChild(table);
}
