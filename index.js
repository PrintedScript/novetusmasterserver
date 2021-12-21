window.addEventListener('load', function() {
   const ServerObjectTemplate = document.getElementsByClassName("serverobject")[0];
   const ServerListTemplate = document.getElementsByClassName("serverlist")[0];
   document.head.appendChild(ServerObjectTemplate);
   document.head.appendChild(ServerListTemplate);
   $.ajaxSetup({ cache: false });
   
   function clearserverlist(){
        const serverobjects = ServerList.getElementsByClassName("serverobject");
        console.log(serverobjects);
        for(var i = 0;i < serverobjects.length;i++){
            ServerList.removeChild(serverobjects[i]);
        }
   }
   
   function updateserverlist(){
        if (document.body.getElementsByClassName("serverlist").length >= 1){
            document.body.getElementsByClassName("container")[0].removeChild(document.body.getElementsByClassName("serverlist")[0]);
        }
        $.ajax({
            url: '/serverlist.txt',
            type: 'get',
            success: function (message) {
                var ServerList = ServerListTemplate.cloneNode(true);
                document.getElementsByClassName("container")[0].appendChild(ServerList);
                var serverinfo = message.split('\n');
                var servers = 0
                for(var i = 0;i < serverinfo.length;i++){
                    var unparsedinfo = serverinfo[i];
                    var parsedinfo = atob(unparsedinfo).split('|');
                    
                    var newserverobject = ServerObjectTemplate.cloneNode(true);
                    
                    if (parsedinfo.length == 5){
                        var servername = atob(parsedinfo[0]);
                        var serverip = atob(parsedinfo[1]);
                        var serverport = atob(parsedinfo[2]);
                        var serverclient = atob(parsedinfo[3]);
                        var serverversion = atob(parsedinfo[4]);
                        
                        newserverobject.getElementsByClassName("name")[0].textContent = servername;
                        newserverobject.getElementsByClassName("ip")[0].textContent = serverip;
                        newserverobject.getElementsByClassName("port")[0].textContent = serverport;
                        newserverobject.getElementsByClassName("client")[0].textContent = serverclient;
                        newserverobject.getElementsByClassName("version")[0].textContent = serverversion;
                        var temp = btoa(`${parsedinfo[1]}|${parsedinfo[2]}|${parsedinfo[3]}`);
                        var novetuslaunchuri = `novetus://${temp}`;
                        
                        newserverobject.getElementsByClassName("novetuslauncher")[0].setAttribute("data-launchuri",novetuslaunchuri);
                        newserverobject.getElementsByClassName("novetuslauncher")[0].addEventListener("click",function(evt){
                            location.href = evt.currentTarget.getAttribute("data-launchuri");
                        });
                        ServerList.appendChild(newserverobject);
                        servers += 1;
                    }
                }
                
                if (servers <= 0){
                    var InfoTag = document.createElement("p")
                    InfoTag.className = "servernametag"
                    ServerList.appendChild(InfoTag)
                    
                    var Text = document.createElement("b")
                    Text.className = "name"
                    Text.textContent = "No servers are currently connected to this master server."
                    InfoTag.appendChild(Text)
                }
            },
    
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Failed to get serverlist info");
            }
        });
    }
    updateserverlist();
    
    document.getElementsByClassName("refreshbutton")[0].addEventListener("click",function(){
        updateserverlist();
    });
});
