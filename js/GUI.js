SYS.GUI = function()
{
    this.elements;
};

SYS.GUI.prototype = function()
{
    this.elements = [];
};

SYS.GUI.Info = function()
{
    this.infoDiv = document.createElement('div');
    this.infoDiv.className = 'infoDiv';
    document.body.appendChild(this.infoDiv);
    this.infoDiv.innerHTML = 'Test';
    SYS.GUI.elements.push(this);
};

SYS.GUI.Info.prototype = 
{
    
    updateInfo: function( speed, objects )
    {
        this.infoDiv.innerHTML = 'simulation speed: ' + speed + '<br>' + 'objects: ' + objects;
    },
    
};

SYS.GUI.Notification = function()
{

};

SYS.GUI.Notification.prototype = 
{

};