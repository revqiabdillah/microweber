export const Handles = function (handles) {

    this.handles = handles;
    this.dragging = false;
    var scope = this;

    this.get = function (handle) {
        return this.handles[handle];
    }

    this.set = function (handle, target){
         this.get(handle).set(target)
    }

    this.hide = function(handle) {
        if(handle && this.handles[handle]) {
            this.handles[handle].hide();
        } else {
            this.each(function (name, h){
                h.hide()
            });
        }
    };

    this.hideAllBut = function(handle) {
        this.each(function (name, h){
            if(name !== handle) {
                h.hide()
            }
        });
    };

    this.show = function(handle) {
        if (handle && this.handles[handle]) {
            this.handles[handle].show();
        } else {
            this.each(function (name, handle){
                handle.show();
            });
        }
    };

    this.each = function (c) {
        if(!c) return;
        var i;
        for (i in this.handles) {
            c.call(scope, i, this.handles[i]);
        }
    };

    this.init = function (){
        this.each(function (name, handle){
            handle.draggable.on('dragStart', function (){
                scope.dragging = true;
                scope.hideAllBut(name)
            })
            handle.draggable.on('dragEnd', function (){
                scope.dragging = false;
                handle.show()
            })
        })
    }

    this.init();
};
