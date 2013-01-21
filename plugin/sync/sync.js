var sync = new function() {
    var CHECK_MS = 500;

    this.tid = null;
    this.lastH = -1;
    this.lastV = -1;
    this.lastF = 0;
    this.ignoreNext = false;

    this.init = function() {
        var indices = Reveal.getIndices();
        this.lastH = indices.indexh;
        this.lastV = indices.indexv;

        this.tid = setTimeout(this.check, CHECK_MS);
        Reveal.addEventListener( 'slidechanged', this.onSlideChanged);
        Reveal.addEventListener( 'fragmentshown', this.onFragmentShown);
        Reveal.addEventListener( 'fragmenthidden', this.onFragmentHidden);
    }

    this.check = function() {

        var req = new XMLHttpRequest();
        req.onreadystatechange=function(){
            if (req.readyState==4 && (req.status==200 || window.location.href.indexOf("http")==-1)) {
                var tokens = req.responseText.split(" ");
                var pos = new Array();
                for(var i = 0; i < 3; ++i) {
                    pos[i] = parseInt(tokens[i]);
                    if(isNaN(pos[i]) || pos[i] < 0)
                        return;
                }

                var indices = Reveal.getIndices();
                if(indices.h != pos[0] || indices.v != pos[1] || sync.lastF != pos[2]) {
                    sync.ignoreNext = true;
                    Reveal.slide(pos[0], pos[1], pos[2]);
                }
           }
        }
        req.open("GET", "controller.php?get=1", true);
        req.send(null);
        sync.tid = setTimeout(sync.check, CHECK_MS);
    }

    function writePos(indexh, indexv, indexf) {
        if(sync.ignoreNext) {
            sync.ignoreNext = false;
            return;
        }

        clearInterval(sync.tid);
        sync.tid = setTimeout(sync.check, 2000);

        var req = new XMLHttpRequest();
        var h = encodeURIComponent(indexh);
        var v = encodeURIComponent(indexv);
        var f = encodeURIComponent(indexf);
        req.open("GET", "controller.php?indexh="+h+"&indexv="+v+"&indexf="+f, true);
        req.send(null);
    }

    this.onSlideChanged = function(event) {
        if(event.indexh == sync.lastH && event.indexv == sync.lastV)
            return;

        sync.lastH = event.indexh;
        sync.lastV = event.indexv;
        sync.lastF = 0;

        writePos(event.indexh, event.indexv, 0);
    }

    this.onFragmentShown = function(event) {
        sync.lastF++;
        writePos(sync.lastH, sync.lastV, sync.lastF);
    }

    this.onFragmentHidden = function(event) {
        sync.lastF--;
        writePos(sync.lastH, sync.lastV, sync.lastF);
    }

}
