define(function(require, exports, module) {
    Array.prototype.remove = function(item) {
        for (var i = 0; i < this.length; i++) {
            if (item == this[i])
                break;
        }
        if (i == this.length)
            return;
        for (var j = i; j < this.length - 1; j++) {
            this[j] = this[j + 1];
        }
        this.length--;
    };

    String.prototype.replaceAll = function(AFindText, ARepText) {
        var raRegExp = new RegExp(AFindText, "g");
        return this.replace(raRegExp, ARepText);
    };

    function getAllChildren(e) {
        return e.all ? e.all : e.getElementsByTagName('*');
    };

    document.getElementsBySelector = function(selector) {
        if (!document.getElementsByTagName) {
            return new Array();
        }

        var tokens = selector.split(' ');
        var currentContext = new Array(document);
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
            var tagName = null;
            var bits = null;
            var found = new Array;
            var foundCount = 0;
            var currentContextIndex = 0;
            var elements = null;
            if (token.indexOf('#') > -1) {

                bits = token.split('#');
                tagName = bits[0];
                var id = bits[1];
                var element = document.getElementById(id);
                if (tagName && element.nodeName.toLowerCase() != tagName) {

                    return new Array();
                }
                currentContext = new Array(element);
                continue;
            }
            if (token.indexOf('.') > -1) {

                bits = token.split('.');
                tagName = bits[0];
                var className = bits[1];
                if (!tagName) {
                    tagName = '*';
                }

                found = new Array;
                foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    if (tagName == '*') {
                        elements = getAllChildren(currentContext[h]);
                    } else {
                        elements = currentContext[h].getElementsByTagName(tagName);
                    }
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = new Array;
                currentContextIndex = 0;
                for (var k = 0; k < found.length; k++) {
                    if (found[k].className && found[k].className.match(new RegExp('\\b' + className + '\\b'))) {
                        currentContext[currentContextIndex++] = found[k];
                    }
                }
                continue;
            }
            if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                tagName = RegExp.$1;
                var attrName = RegExp.$2;
                var attrOperator = RegExp.$3;
                var attrValue = RegExp.$4;
                if (!tagName) {
                    tagName = '*';
                }
                found = new Array;
                foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    if (tagName == '*') {
                        elements = getAllChildren(currentContext[h]);
                    } else {
                        elements = currentContext[h].getElementsByTagName(tagName);
                    }
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = new Array;
                currentContextIndex = 0;
                var checkFunction;
                switch (attrOperator) {
                case '=':
                    checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue); };
                    break;
                case '~':
                    checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b'))); };
                    break;
                case '|':
                    checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?'))); };
                    break;
                case '^':
                    checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
                    break;
                case '$':
                    checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
                    break;
                case '*':
                    checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
                    break;
                default:
                    checkFunction = function(e) { return e.getAttribute(attrName); };
                }
                currentContext = new Array;
                currentContextIndex = 0;
                for (var k = 0; k < found.length; k++) {
                    if (checkFunction(found[k])) {
                        currentContext[currentContextIndex++] = found[k];
                    }
                }
                continue;
            }
            tagName = token;
            found = new Array;
            foundCount = 0;
            for (var h = 0; h < currentContext.length; h++) {
                elements = currentContext[h].getElementsByTagName(tagName);
                for (var j = 0; j < elements.length; j++) {
                    found[foundCount++] = elements[j];
                }
            }
            currentContext = found;
        }
        return currentContext;
    };

    function addEvent(eventType, eventFunc, eventObj) {
        eventObj = eventObj || document;
        if (window.attachEvent) eventObj.attachEvent("on" + eventType, eventFunc);
        if (window.addEventListener) eventObj.addEventListener(eventType, eventFunc, false);
    }

    function clearEventBubble(evt) {
        evt = evt || window.event;
        if (evt.stopPropagation) evt.stopPropagation();
        else evt.cancelBubble = true;
        if (evt.preventDefault) evt.preventDefault();
        else evt.returnValue = false;
    }

    function posXY(event) {
        event = event || window.event;
        var posX = event.pageX || (event.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft));
        var posY = event.pageY || (event.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop));
        return { x: posX, y: posY };
    }

    var selectedRegions = [];

    function RegionSelect(selRegionProp) {
        this.regions = [];
        var regions = document.getElementsBySelector(selRegionProp["region"]);
        if (regions && regions.length > 0) {
            var self = this;
            for (var i = 0; i < regions.length; i++) {
                regions[i].onmousedown = function() {
                    var evt = window.event || arguments[0];
                    if (!evt.shiftKey && !evt.ctrlKey) {
                        // 清空select样式
                        self.clearSelections(regions);
                        this.className += " " + self.selectedClass;
                        // 清空selected数组，并加入当前select中的元素
                        selectedRegions = [];
                        selectedRegions.push(this);
                    } else {
                        if (this.className.indexOf(self.selectedClass) == -1) {
                            this.className += " " + self.selectedClass;
                            selectedRegions.push(this);
                        } else {
                            this.className = this.className.replaceAll(self.selectedClass, "");
                            selectedRegions.remove(this);
                        }
                    }
                    clearEventBubble(evt);
                };
                this.regions.push(regions[i]);
            }
        }
        this.selectedClass = selRegionProp["selectedClass"];
        this.selectedRegion = [];
        this.selectDiv = null;
        this.startX = null;
        this.startY = null;
    }

    RegionSelect.prototype.select = function() {
        var self = this;
        addEvent("mousedown", function() {
            var evt = window.event || arguments[0];
            self.onBeforeSelect(evt);
            clearEventBubble(evt);
        }, document);

        addEvent("mousemove", function() {
            var evt = window.event || arguments[0];
            self.onSelect(evt);
            clearEventBubble(evt);
        }, document);

        addEvent("mouseup", function() {
            self.onEnd();
        }, document);
    };

    RegionSelect.prototype.onBeforeSelect = function(evt) {
        // 创建模拟 选择框
        if (!document.getElementById("selContainer")) {
            this.selectDiv = document.createElement("div");
            this.selectDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
            this.selectDiv.id = "selContainer";
            document.body.appendChild(this.selectDiv);
        } else {
            this.selectDiv = document.getElementById("selContainer");
        }

        this.startX = posXY(evt).x;
        this.startY = posXY(evt).y;
        this.isSelect = true;

    };

    RegionSelect.prototype.onSelect = function(evt) {
        var self = this;
        if (self.isSelect) {
            if (self.selectDiv.style.display == "none") self.selectDiv.style.display = "";

            var posX = posXY(evt).x;
            var poxY = posXY(evt).y;

            self.selectDiv.style.left = Math.min(posX, this.startX);
            self.selectDiv.style.top = Math.min(poxY, this.startY);
            self.selectDiv.style.width = Math.abs(posX - this.startX);
            self.selectDiv.style.height = Math.abs(poxY - this.startY);

            var regionList = self.regions;
            for (var i = 0; i < regionList.length; i++) {
                var r = regionList[i], sr = self.innerRegion(self.selectDiv, r);
                if (sr && r.className.indexOf(self.selectedClass) == -1) {
                    r.className = r.className + " " + self.selectedClass;
                    selectedRegions.push(r);
                } else if (!sr && r.className.indexOf(self.selectedClass) != -1) {
                    r.className = r.className.replaceAll(self.selectedClass, "");
                    selectedRegions.remove(r);
                }

            }
        }
    };

    RegionSelect.prototype.onEnd = function() {
        if (this.selectDiv) {
            this.selectDiv.style.display = "none";
        }
        this.isSelect = false;
        //_selectedRegions = this.selectedRegion;
    };

    // 判断一个区域是否在选择区内
    RegionSelect.prototype.innerRegion = function(selDiv, region) {
        var sTop = parseInt(selDiv.style.top);
        var sLeft = parseInt(selDiv.style.left);
        var sRight = sLeft + parseInt(selDiv.offsetWidth);
        var sBottom = sTop + parseInt(selDiv.offsetHeight);

        var rTop = parseInt(region.offsetTop);
        var rLeft = parseInt(region.offsetLeft);
        var rRight = rLeft + parseInt(region.offsetWidth);
        var rBottom = rTop + parseInt(region.offsetHeight);

        var t = Math.max(sTop, rTop);
        var r = Math.min(sRight, rRight);
        var b = Math.min(sBottom, rBottom);
        var l = Math.max(sLeft, rLeft);

        if (b > t + 5 && r > l + 5) {
            return region;
        } else {
            return null;
        }

    };

    RegionSelect.prototype.clearSelections = function(regions) {
        for (var i = 0; i < regions.length; i++) {
            regions[i].className = regions[i].className.replaceAll(this.selectedClass, "");
        }
    };

    function getSelectedRegions() {
        return selectedRegions;
    }

    function showSelDiv() {
        var selInfo = "";
        var arr = getSelectedRegions();
        for (var i = 0; i < arr.length; i++) {
            selInfo += arr[i].innerHTML + "\n";
        }

        alert("您当前共选择 " + arr.length + " 个文件，它们是：\n" + selInfo);

    };

    return {
        RegionSelect: RegionSelect
    };
});