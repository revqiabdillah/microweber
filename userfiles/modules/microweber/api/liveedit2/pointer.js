import {ObjectService} from './classes/object.service.js';
import {DomService} from './classes/dom.js';

export const GetPointerTargets = function(options)  {

    options = options || {};

    this.tools = DomService;

    var scope = this;

    var defaults = {
        exceptions: ['mw-handle-item']
    };

    this.settings = ObjectService.extend({}, defaults, options);

    if ( this.settings.root.nodeType === 9 ) {
        this.document = this.settings.root;
    } else {
        this.document = this.settings.root.ownerDocument;
    }
    this.body = this.document.body;

    var distanceMax = 20;

    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2-x1, y2-y1);
    }

    function isInRange(el1, el2) {
        return distance(el1, el2) <= distanceMax;
    }

    var validateNode = function (node) {
        return node.type === 1;
    };

    var round5 = function (x){
        return (x % 5) >= 2.5 ? (x / 5) * 5 + 5 : (x / 5) * 5;
    };

    var getNearCoordinates = function (x, y) {
        x = round5(x);
        y = round5(y);
        var res = [];
        var x1 = x - distanceMax;
        var x1Max = x + distanceMax;
        var y1 = y - distanceMax;
        var y1Max = y + distanceMax;
        for ( ; x1 < x1Max; x1 += 5) {
            for ( ; y1 <= y1Max; y1 += 5 ) {
                res.push([x1, y1]);
            }
        }
        return res;
    };

    var addNode = function (el, res) {
        if(el && !!el.parentElement && res.indexOf(el) === -1 && scope.body !== el) {
            res.push(el);
        }
    };

    this.fromEvent = function (e) {
         if(!scope.tools.hasAnyOfClassesOnNodeOrParent(e.target, this.settings.exceptions)) {
             if(!scope.document._test){
                 scope.document._test = document.createElement('div');
                 scope.document._test.style.position = 'absolute';
                 scope.document._test.style.left = '10px';

                 scope.document._test.style.background =  'red';
                 scope.document._test.style.width =  '10px';
                 scope.document._test.style.height =  '10px';
                 scope.document.body.appendChild(scope.document._test);
             }
             scope.document._test.style.top = e.pageY + 'px';
             return this.fromPoint(e.pageX, e.pageY/* + scope.document.defaultView.scrollY*/);
        }
        return []
    }
    this.fromPoint = function (x, y) {
        var res = [];
        if(scope.document.defaultView.frameElement) {
            // y += scope.document.defaultView.frameElement.getBoundingClientRect().y
            y -= scope.document.defaultView.scrollY;
        }

        var el = scope.document.elementFromPoint(x, y);

        if (!el ) return [];
        addNode(el, res);
        var dots = getNearCoordinates(x, y);
        dots.forEach(function (coords){
            addNode(scope.document.elementFromPoint(coords[0], coords[1]), res);
        });
        return res;
    };
};


