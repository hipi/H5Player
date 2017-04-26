/*导入代码*/
function h5p(model, dom, url) {
    this.model = model;
    this.dom = eval("document.getElementById('" + dom + "')");
    this.url = url;
    this.judge();
};
h5p.prototype = {
    judge: function () {
        if (this.model == "normal") {
            this.normal();

            this.getForm();
        }
        if (this.model == "simple") {
            this.simple();
        }
    },
    normal: function () {
//      TODO 这地方有问题
        this.dom.innerHTML = `
				<div class="h5p h5p-normal">
				<div class="h5p-image">
					<img src="" alt="" />
				</div>
				<div class="h5p-buttons">
					<i data-id="list" class="h5p-button fa fa-list"></i>
				</div>
				<div class="h5p-info">
					<div class="h5p-title">全世界谁倾听你 </div>
					<div class="h5p-artist">林宥嘉</div>
				</div>
				<div class="h5p-control">
					<i data-id="prev" class="h5p-button fa fa-step-backward"></i>
					<i data-id="play" class="h5p-button fa fa-play"></i>
					<i data-id="next" class="h5p-button fa fa-step-forward"></i>
				</div>
				<div class="h5p-progress">
					<div data-id="bar" class="h5p-wrap">
						<div class="h5p-bar">
							<div class="h5p-played"></div>
						</div>
						<div class="h5p-cursor"></div>
						<div class="h5p-time"></div>
					</div>
				</div>
				<div class="h5p-lyric"></div>
				<div class="h5p-playlist"  style="display:none"></div>
			</div>
		
		`; //导入html代码结束
        /*导入样式*/
        (function (doc, cssText) {
            var styleEl = doc.createElement("style");
            doc.getElementsByTagName("head")[0].appendChild(styleEl);
            if (styleEl.styleSheet) {
                if (!styleEl.styleSheet.disabled) {
                    styleEl.styleSheet.cssText = cssText;
                }
            } else {
                try {
                    styleEl.innerHTML = cssText;
                } catch (ignore) {
                    styleEl.innerText = cssText;
                }
            }
        }(document, ".h5p-normal{font-family:Microsoft YaHei;user-select:none;border-radius:10px;min-width:314px;max-width:414px;font-size:16px;background:#fff;box-shadow:0 0 10px grey;position:relative}@keyframes h5p-roll{from{transform:rotate(0)}to{transform:rotate(360deg)}}.h5p-normal .h5p-image{position:absolute;width:130px;height:130px;left:10px;top:10px;animation:h5p-roll 8s linear infinite;-webkit-animation-play-state:paused;animation-play-state:paused}.h5p-normal .h5p-image img{border-radius:50%;width:100%;height:100%}.h5p-normal .h5p-roll{-webkit-animation-play-state: running;animation-play-state: running}.h5p-normal .h5p-buttons{position:absolute;top:10px;right:10px;font-size:20px}.h5p-normal .h5p-info{padding:30px 10px 0 150px;text-align:center;height:32px}.h5p-normal .h5p-info .h5p-title{font-weight:bold}.h5p-normal .h5p-info .h5p-artist{font-size:10px;color:#5f5b5b}.h5p-normal .h5p-control{padding:0 10px 30px 150px;text-align:center}.h5p-normal .h5p-control .h5p-button{margin:10px;font-size:30px}.h5p-button:hover{color: #1e90ff;}.h5p-normal .h5p-progress{padding:5px 10px}.h5p-normal .h5p-wrap{position:relative;padding:4px 0}.h5p-bar{height:2px;background:#c0c0c0;position:relative}.h5p-played{position:absolute;top:0;height:2px;background:#a52a2a}.h5p-normal .h5p-cursor{cursor:pointer;position:absolute;box-sizing:border-box;border:1px solid #c0c0c0;background:#fff;border-radius:50%;width:10px;height:10px;top:0;margin-left:-5px}.h5p-normal .h5p-time{font-size:10px;position:absolute;right:0;top:-20px}.h5p-normal .h5p-lyric{text-align:center;color:brown;font-size:12px;height:24px}.h5p-normal .h5p-lyric{text-align:center;color:brown;font-size:12px;height:24px}.h5p-playlist{max-height:200px;border-top:1px dashed gray;padding:0.5em 1em;overflow-y:auto}.h5p-playlist>div{color:#1a1a1a;cursor:pointer;white-space:nowrap;}.h5p-playlist>div:hover{color:orange;font-weight:bold;}"));
    }, // normal函数结束标志

    getForm: function () {

        /* Fetch异步请求歌单ES6写法*/
        fetch(this.url).then(response => response.json())
            .then(res => {
                data = res;
                /*处理请求的数据*/
                /*console.log(data);*/

                data.forEach(function (song, i) {

                    let div = document.createElement('div');
                    let text = song.name;
                    let textN = document.createTextNode(text);
                    div.appendChild(textN);
                    document.querySelector('.h5p-playlist').appendChild(div);
                });
                
                /*默认显示歌单第一首歌*/
                document.querySelector('.h5p-title').innerHTML = data[0].name;
                document.querySelector('.h5p-image').getElementsByTagName("img")[0].src = data[0].image;

                document.querySelector('.h5p-artist').innerHTML = data[0].artist;
                var audio = new Audio;
                audio.src = data[0].url;

                if (Math.floor(Math.ceil((data[0].duration) / 1000) / 60) < 10) {
                    fenF = "0" + Math.floor(Math.ceil((data[0].duration) / 1000) / 60);
                }
                if (Math.ceil((data[0].duration) / 1000) % 60 < 10) {
                    miaoF = "0" + Math.ceil((data[0].duration) / 1000) % 60;
                }
                document.querySelector('.h5p-time').innerHTML = "00:00/" + fenF + ":" + miaoF;

                var number = 0;
                var upNumber=data.length+1;
                var lrcObj = {}; //定义歌词

                this.event(data, audio, number,upNumber,lrcObj);

            })
            .catch(e => console.log("请求错误", e))
    },
    /*事件*/
    event: function (data, audio, number,upNumber, lrcObj) {
        var listB = document.querySelector('[data-id="list"]');
        var songList = document.querySelector('.h5p-playlist');
        /*显示隐藏歌单*/
        listB.onclick = function () {
            var display = songList.style.display;
            if (display == 'none') {
                songList.style.display = 'block';
            } else
                songList.style.display = 'none';

        };
        /*console.log(lrcObj)*/

        var playB = document.querySelector('[data-id="play"]');
        var nextB = document.querySelector('[data-id="next"]');
        var prevB = document.querySelector('[data-id="prev"]');
        playB.onclick = function () {
            if (audio.paused) {
                audio.play();
                playB.className = "h5p-button fa fa-pause";
                document.querySelector('.h5p-image').className = "h5p-image h5p-roll";
            } else {
                audio.pause();
                playB.className = "h5p-button fa fa-play";
                document.querySelector('.h5p-image').className = "h5p-image";
            }

        };

        /*点击歌曲播放和显示在播放中*/
        var songListDiv = songList.childNodes;
        var fen, miao;

        songList.childNodes.forEach(function (e, i) {
            /*点击歌单中歌曲事件*/
            e.onclick = function () {

                document.querySelector('.h5p-title').innerHTML = e.innerHTML;
                document.querySelector('.h5p-artist').innerHTML = data[i].artist;
                document.querySelector('.h5p-image').getElementsByTagName("img")[0].src = data[i].image;
                document.querySelector('.h5p-image').className = "h5p-image h5p-roll";
                playB.className = "h5p-button fa fa-pause";
                fen = Math.floor(Math.ceil((data[i].duration) / 1000) / 60);
                miao = Math.ceil((data[i].duration) / 1000) % 60;
                if (fen < 10) {
                    fen = "0" + fen;
                }
                if (miao < 10) {
                    miao = "0" + miao;
                }
                document.querySelector('.h5p-time').innerHTML = "00:00/" + fen + ":" + miao;
                audio.src = data[i].url;
                audio.play();
                number = i;

                /*请求歌曲对应的歌词*/

                fetch("lrc/" + data[i].id + ".lrc").then(response => response.text())
                    .then(lrc => {

                        var lyrics = lrc.split("\n");

                        for (var i = 0; i < lyrics.length; i++) {
                            var lyric = decodeURIComponent(lyrics[i]);
                            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                            var timeRegExpArr = lyric.match(timeReg);
                            if (!timeRegExpArr) continue;
                            var clause = lyric.replace(timeReg, '');

                            for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
                                var t = timeRegExpArr[k];
                                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                                var time = min * 60 + sec;

                                lrcObj[time] = clause;
                            }
                        }

                        //							return lrcObj;	

                    })
                    .catch(e => {
                        console.log("歌词请求错误", e)
                    });
                lrcObj = {};
                document.querySelector('.h5p-lyric').innerHTML = "暂时没有歌词";

            }
        }); //点击歌单事件
        /*判断歌曲是否播放完毕 完毕切换下一首*/
        var is_playFinish = setInterval(function () {

            if (audio.ended) {
                number++;

                if(number==upNumber){
                    number=0;
                }

                //模拟点击歌单事件
                songList.childNodes[number].onclick(number);

            }

        }, 1000);

        var nextB = document.querySelector('[data-id="next"]');
        var prevB = document.querySelector('[data-id="prev"]');

        nextB.onclick = function () {
            number++;
            //TODO
            /*if(number==upNumber){
                number=0;
            }*/
            //模拟点击歌单事件
            songList.childNodes[number].onclick(number);
        };
        prevB.onclick = function () {
            number--;
            if(number<0){
                number=0;
            }
            //模拟点击歌单事件
            songList.childNodes[number].onclick(number);
        };

        /*加载歌词 和进度条*/
        setInterval(function () {

            /*console.log(lrcObj[Math.floor(audio.currentTime)]);
					
            console.log(audio.paused);*/

            if (lrcObj[Math.floor(audio.currentTime)] != undefined) {
                document.querySelector('.h5p-lyric').innerHTML = lrcObj[Math.floor(audio.currentTime)];
            }
            var playTime = (audio.currentTime * 100000 / data[number].duration).toFixed(2);
            document.querySelector('.h5p-cursor').style.left = playTime + "%";
            document.querySelector('.h5p-played').style.width = playTime + "%";

            if (number == 0) {
                fen = fenF;
                miao = miaoF;
            }

            var fenD = Math.floor(audio.currentTime / 60);
            var miaoD = Math.floor(audio.currentTime % 60);
            if (fenD < 10) {
                fenD = "0" + fenD;
            }
            if (miaoD < 10) {
                miaoD = "0" + miaoD;
            }
            document.querySelector('.h5p-time').innerHTML = fenD + ":" + miaoD + "/" + fen + ":" + miao;
            if (number > data.length) {
                return number = -1;
            }
        }, 1000);
    } //event事件结束标志

} 
