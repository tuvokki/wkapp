var rp = require('request-promise'),
    gui = require("nw.gui"),
    fs = require("fs"),
    settings  = require(process.cwd() + '/settings.json');

// Extend application menu for Mac OS
if (process.platform == "darwin") {
  var menu = new gui.Menu({type: "menubar"});
  menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
  gui.Window.get().menu = menu;
}

window.onfocus = function() { 
  console.log("focus");
  focusTitlebars(true);
};

window.onblur = function() { 
  console.log("blur");
  focusTitlebars(false);
};

window.onresize = function() {
  updateContentStyle();
};

function get_projects(url, auth) {
    return rp.get({
        url : url,
        headers : {
            "Authorization" : auth,
            "Content-Type"  : "application/json"
        },
        followAllRedirects: true
      }
    );
}

window.onload = function() {
  var auth = "Basic " + new Buffer(settings.jira.client.basic_auth.username + ":" + settings.jira.client.basic_auth.password).toString("base64");
  var url = 'https://'+settings.jira.client.host+'/rest/api/2/project';
  var logfile = process.cwd() + '/output.log'
  //clear the logfile
  if (fs.existsSync(logfile)) {
    fs.unlinkSync(logfile);
  }

  // addTitlebar("top-titlebar", "top-titlebar.png", "Top Titlebar");
  // addTitlebar("bottom-titlebar", "bottom-titlebar.png", "Bottom Titlebar");
  addTitlebar("left-titlebar", "left-titlebar.png", "Left Titlebar");
  // addTitlebar("right-titlebar", "right-titlebar.png", "Right Titlebar");

  // document.getElementById("close-window-button").onclick = function() {
  //   window.close();
  // };

  // document.querySelector('#minimize-window-button').onclick = function () {
  //   gui.Window.get().minimize();
  // };

  // document.querySelector('#maximize-window-button').onclick = function () {
  //   gui.Window.get().maximize();
  // };

  document.querySelector('#open-inspector-button').onclick = function () {
    var win = gui.Window.get();
    if (win.isDevToolsOpen()) {
      win.closeDevTools();
      this.innerText = "Open Developer Tools";
    } else {
      win.showDevTools();
      this.innerText = "Close Developer Tools";
    }
  };

  document.querySelector('#testbutton').onclick = function testbutton_onclick () {
    document.querySelector('#testspan').innerText = "Test: " + settings.jira.projects;
    get_projects(url, auth).then(function(res) {
      // res is now the result filled with projects
      console.log('success', res);
      
    }, function(err){
      console.log('error', err);
    });
  }

  updateContentStyle();
  gui.Window.get().show();
};
