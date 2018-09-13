<template>
    <div class="feiyishow" id="feiyidata"  >

      <img src="../assets/背景.png" id="background"/>
      <a href="http://www.fjfyw.net/daibiaozuo/2015-01-13/1120.html" target="_blank"><img src="../assets/yuanxiao.jpg" id="yuanxiao"/></a>
      <img src="../assets/white.jpg" id="white1"/>
      <div id="yuanxiaoIntroduce">
       <p>
         泉州闹元宵习俗源于中原，以闹花灯为主,包括挂灯、送灯、观灯（赏灯）、点灯、游灯，古代还有抢灯。灯会还有猜灯谜、妆人等文艺活动。踩街古称"妆人"，有民间民俗表演阵头、花灯、彩车和各种文艺表演、南少林武术等项目，遇到有人放鞭炮，就要停下表演，表示感谢。还有"敬公"（祭祖）、"听香"等祈福习俗。
       </p>
      </div>
      <a href="http://www.fjfyw.net/daibiaozuo/2015-01-16/1200.html" target="_blank"><img src="../assets/南音.jpg" id="nanyin"/></a>
      <img src="../assets/white.jpg" id="white2"/>
      <p id="nanyinIntroduce">南音也称“弦管”、“泉州南音”，是中国现存历史最悠久的古音乐。两汉、晋、唐、两宋等朝代的中原移民把音乐文化带入以泉州为中心的闽南地区，并与当地民间音乐融合，形成了具有中原古乐遗韵的文化表现形式--南音</p>
      <a href="http://www.fjfyw.net/daibiaozuo/2015-02-03/2027.html" target="_blank"><img src="../assets/木拱桥.jpg" id="mugongBridge"/></a>
      <img src="../assets/white.jpg" id="white3"/>
      <p id="bridgeIntroduce">中国木拱桥传统营造技艺是采用原木材料，使用传统木建筑工具及手工技法，运用“编梁”等核心技术，以榫卯连接并构筑成极其稳固的拱架桥梁技艺体系。</p>
      <a href="http://www.fjfyw.net/daibiaozuo/2015-01-13/1120.html" target="_blank"><img src="../assets/中国剪纸.jpg" id="jianzhi"/></a>
      <img src="../assets/white.jpg" id="white4"/>
      <p id="jianzhiIntroduce">中国剪纸是一种用剪刀或刻刀在纸上剪刻花纹，用于装点生活或配合其他民俗活动的民间艺术。在中国，剪纸具有广泛的群众基础，交融于各族人民的社会生活，是各种民俗活动的重要组成部分。其传承赓续的视觉形象和造型格式，蕴涵了丰富的文化历史信息,具有认知、教化、表意、抒情、娱乐、交往等多重社会价值</p>
    </div>
</template>

<script>
    export default {
        name: "feiyi_data",
      data(){
          return{
            feiyiImage:[
              {
                name:"img1",src:require('../assets/木拱桥.jpg'),href:"http://www.fjfyw.net/daibiaozuo/2015-02-03/2027.html"
              },
              {
                name:"img2",src:require('../assets/南音.jpg'),href:'http://www.fjfyw.net/daibiaozuo/2015-01-16/1200.html'
              },
              {
                name:"img3",src:require('../assets/造船.jpg'),href:'http://www.fjfyw.net/daibiaozuo/2015-01-16/1406.html'
              },
              {
                name:"img4",src:require('../assets/剪纸.jpg'),href:'http://www.fjfyw.net/daibiaozuo/2015-01-13/1120.html'
              },
            ],
            _backgroud:{
              backgroundImage:"url("+require('../assets/背景.png')+")",
              backgroundPosition:"center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            },
            back_img:require('../assets/背景.png'),
            url_back_img:"url("+require('../assets/背景.png')+")"

          }
      }
    }
</script>

<style scoped>
#background{
  position:absolute;
  height: 628px;
  width:1280px;
  top:89px;
  left: 249px;
}
#yuanxiao{
  position:absolute;
 width: 300px;
  top:89px;
  left:350px;
}
  #white1{
    position:absolute;
    width: 300px;
    height:180px;
    top:520px;
    left:350px;
  }
  #yuanxiaoIntroduce{
    position:absolute;
    width: 300px;
    height:180px;
    top:510px;
    left:355px;
  }
  #nanyin{
    position:absolute;
    width:300px;
    height:200px;
    top:90px;
    left:730px;
  }
#white2{
  position:absolute;
  width: 300px;
  height:140px;
  top:290px;
  left:730px;
}
#nanyinIntroduce{
  position:absolute;
  width: 300px;
  height:180px;
  top:280px;
  left:735px;
}
#mugongBridge{
  position:absolute;
  width: 300px;
  height:180px;
  top:450px;
  left:730px;
}
#white3{
  position:absolute;
  width: 300px;
  height:120px;
  top:600px;
  left:730px;
}
#bridgeIntroduce{
  position:absolute;
  width: 300px;
  height:109px;
  top:600px;
  left:735px;
}
#jianzhi{
  position:absolute;
  width: 300px;
  top:89px;
  left:1120px;
}
#white4{
  position:absolute;
  width: 300px;
  height:180px;
  top:520px;
  left:1120px;
}
  #jianzhiIntroduce{
    position:absolute;
    width: 300px;
    height:180px;
    top:510px;
    left:1125px;
  }
</style>
