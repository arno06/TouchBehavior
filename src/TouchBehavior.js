/**
 * @author Arnoob NICOLAS - arno06@gmail.com
 */
if (NodeList.prototype.forEach === undefined)
    NodeList.prototype.forEach = Array.prototype.forEach || function(pHandler){for(var i = 0, max = this.length; i<max; i++){pHandler(this[i], i);}};
var TouchBehavior =
{
    clickEvent:(function(){return ("ontouchend" in document)?"touchend":"click";})(),
    downEvent:(function(){return ("ontouchend" in document)?"touchstart":"mousedown";})(),
    upEvent:(function(){return ("ontouchend" in document)?"touchend":"mouseup";})(),
    moveEvent:(function(){return ("ontouchend" in document)?"touchmove":"mousedown";})(),
    applyTo:function(pSelector, pClassName, pDistance)
    {
        pClassName = pClassName||'active';
        pDistance = pDistance||5;

        document.querySelectorAll(pSelector).forEach(function(pElement)
        {
            var handler = function(e)
            {
                var p = {x:e.pageX, y:e.pageY};
                var t = e.currentTarget;
                var todo;
                switch(e.type.toLowerCase())
                {
                    case TouchBehavior.downEvent:
                        if(e.type.toLowerCase().indexOf("touch")>-1)
                            p = {x: e.touches[0].pageX, y: e.touches[0].pageY};
                        t.setAttribute("mouse-start", p.x+","+ p.y);
                        t.setAttribute("mouse-end", p.x+","+ p.y);
                        todo = "add";
                        break;
                    case TouchBehavior.upEvent:
                        if (t.getAttribute("mouse-start"))
                        {
                            var start = t.getAttribute("mouse-start").split(",");
                            var last = t.getAttribute("mouse-end").split(",");
                            var distanceX = (last[0] - start[0]);
                            var distanceY = (last[1] - start[1]);
                            var distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
                            if(distance>pDistance)
                            {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                            }
                            todo = "remove";
                        }
                        break;
                    case TouchBehavior.moveEvent:
                    default:
                        if(e.type.toLowerCase().indexOf("touch")>-1)
                            p = {x: e.touches[0].pageX, y: e.touches[0].pageY};
                        t.setAttribute("mouse-end", p.x+","+ p.y);
                        todo = "remove";
                        break;
                }
                if (todo)
                    t.classList[todo](pClassName);
            };
            pElement.addEventListener(TouchBehavior.downEvent, handler);
            pElement.addEventListener(TouchBehavior.moveEvent, handler);
            pElement.addEventListener(TouchBehavior.upEvent, handler);
        });
    }
};
