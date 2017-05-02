
注：本代码用了ES6的语法 ，低版本浏览器不适用，尽量用chrome浏览器
用法 在html 用id定义一个DIV   例子可进入 http://chenyeah.cn/dev/p1/player/

例如`<div id="Player"></div>` id名可以随意取

导入js文件和font-awesome css文件

接下来只要在script标签内 new一个函数 `new h5p("normal", "Player", "songs.json");`

第一参数normal 不变 以后会增添其他
第二参数是上面取得id名
第三个参数是歌单的json文件

歌单文件参数如下
```
[
  {
    "artist": "CrossGear",
    "name": "千年幻想郷~月ノ都~",
    "url": "2.mp3",
    "duration": 60000,
    "image": "1.jpg"
  }
]
```


`artist：//艺术家名称`<br />
`name：//歌曲名`<br />
`url：//歌曲地址`<br />
`duration：//歌曲时间 （ms为单位）`<br />
`image：//专辑图片地址`<br />



