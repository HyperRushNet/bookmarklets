// yt-ad-block.js
(function(){
    if(window.__ytAdSkipLoaded) return;
    window.__ytAdSkipLoaded = true;

    var sKey = 'ytadskip_v1',
        state = JSON.parse(localStorage.getItem(sKey) || '{}'),
        st = {
            enabled: state.enabled !== false,
            modes: state.modes || {length:1, overlay:1, showing:1, url:1},
            threshold: state.threshold || 30
        },
        save = function(){ localStorage.setItem(sKey, JSON.stringify(st)); },
        fs = function(el, stl){ for(var k in stl) el.style.setProperty(k, stl[k], 'important'); };

    // Button en menu
    var btn = document.getElementById('ytas-btn-ugfidif');
    var menu = document.getElementById('ytas-menu-ugfidif');

    if(!btn){
        // Maak button
        btn = document.createElement('div');
        btn.id = 'ytas-btn-ugfidif';
        btn.textContent = 'AdSkip';
        fs(btn,{
            position:'fixed', top:'10px', right:'10px', 'z-index':'2147483647',
            background:'#f00', color:'#fff', padding:'5px 10px', 'border-radius':'4px',
            cursor:'pointer', font:'bold 12px Arial', textAlign:'center', 'user-select':'none'
        });
        document.body.appendChild(btn);

        // Maak menu
        menu = document.createElement('div');
        menu.id = 'ytas-menu-ugfidif';
        fs(menu,{
            position:'fixed', top:'50px', right:'10px', 'z-index':'2147483647',
            background:'#fff', padding:'10px', border:'1px solid #ccc', 'border-radius':'6px',
            width:'240px', font:'12px Arial', textAlign:'left', 'box-sizing':'border-box', display:'none'
        });

        var h4 = document.createElement('h4');
        h4.textContent = 'AdSkip Settings';
        fs(h4,{margin:'0 0 6px 0', fontSize:'16px', fontWeight:'bold'});
        menu.appendChild(h4);

        var sw = document.createElement('div'); menu.appendChild(sw);
        var ms = {length:'Length', overlay:'Overlay', showing:'Showing', url:'URL'};

        Object.keys(ms).forEach(function(k){
            var l = document.createElement('div');
            fs(l,{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'4px 0'});
            var span = document.createElement('span'); span.textContent = ms[k]; fs(span,{flex:'1'});
            var swrapper = document.createElement('div'); fs(swrapper,{position:'relative', width:'40px', height:'20px', cursor:'pointer'});
            var slider = document.createElement('div'); fs(slider,{position:'absolute', top:'0', left:'0', width:'40px', height:'20px', background:'#ccc', borderRadius:'10px', transition:'.3s'});
            var knob = document.createElement('div'); fs(knob,{position:'absolute', top:'1px', left:'1px', width:'18px', height:'18px', background:'#fff', borderRadius:'50%', transition:'.3s'});
            if(st.modes[k]){ knob.style.left='21px'; slider.style.background='#4caf50'; }
            swrapper.appendChild(slider); swrapper.appendChild(knob);
            swrapper.onclick = function(){
                st.modes[k] = !st.modes[k]; save();
                knob.style.left = st.modes[k]?'21px':'1px';
                slider.style.background = st.modes[k]?'#4caf50':'#ccc';
            };
            l.appendChild(span); l.appendChild(swrapper); sw.appendChild(l);
        });

        var thrLabel = document.createElement('label'); fs(thrLabel,{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px'});
        thrLabel.textContent = 'Threshold (s): ';
        var thrInput = document.createElement('input'); thrInput.type='number'; thrInput.min=1; thrInput.value=st.threshold;
        fs(thrInput,{width:'60px'});
        thrInput.onchange = function(){ st.threshold=+thrInput.value||30; save(); };
        thrLabel.appendChild(thrInput); menu.appendChild(thrLabel);

        document.body.appendChild(menu);
        btn.onclick = function(){ menu.style.display = menu.style.display==='none'?'block':'none'; };
    } else { menu.style.display = menu.style.display==='none'?'block':'none'; }

    function detectAd(){
        var v = document.querySelector('video'); if(!v) return false;
        var p = document.querySelector('.html5-video-player');
        return (st.modes.overlay && (document.querySelector('.ytp-ad-player-overlay') || document.querySelector('.ytp-ad-avatar-lockup-card') || document.querySelector('.ytp-ad-overlay-container') || document.querySelector('.ytp-ad-image-overlay')))
            || (st.modes.showing && p && p.classList.contains('ad-showing'))
            || (st.modes.url && v.src && (v.src.includes('doubleclick') || v.src.includes('googleads.g.doubleclick.net') || v.src.includes('/ads/')))
            || (st.modes.length && v.duration && v.duration<st.threshold && v.duration>0);
    }

    function skipAd(){
        var v = document.querySelector('video'); if(!v) return;
        var sb = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
        if(sb) sb.click(); else v.currentTime=v.duration;
    }

    function skipForward(){
        var v=document.querySelector('video'); if(!v || v.paused || v.ended) return;
        detectAd()?skipAd():(v.currentTime+=10, v.currentTime>v.duration&&(v.currentTime=v.duration));
    }

    function startInterval(){
        if(window.ytAdSkipIntr) clearInterval(window.ytAdSkipIntr);
        window.ytAdSkipIntr = setInterval(function(){
            if(!st.enabled) return;
            if(detectAd()) skipAd();
        }, 500);
    }

    window.ytAdSkipStartInterval = startInterval;
    startInterval();

    document.addEventListener('keydown', function(e){
        if(e.key.toLowerCase()==='s' && e.target.tagName!=='INPUT' && e.target.tagName!=='TEXTAREA'){
            e.preventDefault();
            skipForward();
        }
    });

})();
