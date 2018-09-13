<template>
    <div id="class_thematic">

      <div id="viewDiv2"  style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;"></div>

      <div id="viewDiv1"  style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;"></div>
      <img src="http://47.100.37.216:8080/Mingzheng/heatmap4.png" id="heatmapImg" v-show="heatmapShow">
      <div id="legend">
        <img src="http://47.100.37.216:8080/Mingzheng/class.png" style="width:200px;height:300px" v-show="classLegend"/>
        <img src="http://47.100.37.216:8080/Mingzheng/grade.png" style="width:200px;height:300px" v-show="gradeLegend"/>
      </div>

      <el-button type="primary" plain @click="thematic(0)" id="orginal" >原始图层</el-button>
      <el-button type="primary" plain @click="thematic(1)" id="class">类别专题</el-button>
      <el-button type="primary" plain @click="thematic(2)" id="grade">级别专题</el-button>
      <el-button type="primary" plain @click="thematic(4)" id="heatmap">热力图</el-button>


  <div id="block">
    <el-slider
      :show-tooltip="false"
      vertical
      v-model="blockvalue"
      v-show="blockShow"
      @change="clipMap"
      height="620px">
    </el-slider>
  </div>
    </div>
</template>

<script>
  import esriLoader from 'esri-loader'
  import  $ from 'jquery'
  esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');
    export default {
        name: "class_thematic",
      data(){
          return{
              classShow:false,
              gradePointList:[],
              view:[],
              classLegend:false,
              gradeLegend:false,
              blockvalue:50,
              classMap:[],
              gradeMap:[],
              blockShow:false,
              heatmapShow:false
          }
      },methods:{
        thematic:function (index){
          this.classShow=!this.classShow;
          this.blockShow=false;
            esriLoader.loadModules([
              "esri/Map",
              "esri/layers/CSVLayer",
              "esri/views/MapView",
              "esri/layers/FeatureLayer",
              "esri/layers/MapImageLayer",
              "esri/config",
              "dojo/domReady!"
            ]).then(([Map,CSVLayer,MapView,FeatureLayer,MapImageLayer,esriConfig])=>{
              var _this=this;
              var map = new Map({
                basemap: "oceans",
              });
              var view = new MapView({
                container: "viewDiv1",
                map: map,
                center: [118.999, 25.88],
                zoom:7,
              });
              _this.view=view;
              var ptemplate=this.ptempte;
              var pointUrl = "https://localhost:6443/arcgis/rest/services/feiyiPoint1/MapServer";
              var pointLayer = new MapImageLayer({
                url:pointUrl ,
                sublayers:[{
                  id:0,
                  visible:true,
                  popupTemplate:ptemplate,
                }],
              });
              //类别专题
              var asym = {
                type:"simple-marker",
                color:"#00BFFF",
                size:7,
                style:"solid"
              };
              var bsym = {
                type:"simple-marker",
                color:"#00CED1",
                size:7,
                style:"solid"
              };
              var csym = {
                type:"simple-marker",
                color:"#4B0082",
                size:7,
                style:"solid"
              };
              var dsym = {
                type:"simple-marker",
                color:"#654875",
                size:7,
                style:"solid"
              };
              var esym = {
                type:"simple-marker",
                color:"#7FFFD4",
                size:7,
                style:"solid"
              };
              var fsym = {
                type:"simple-marker",
                color:"#8A2BE2",
                size:7,
                style:"solid"
              };
              var gsym = {
                type:"simple-marker",
                color:"#ADFF2F",
                size:7,
                style:"solid"
              };
              var hsym = {
                type:"simple-marker",
                color:"#C71585",
                size:7,
                style:"solid"
              };
              var isym = {
                type:"simple-marker",
                color:"#EE82EE",
                size:7,
                style:"solid"
              };
              var jsym = {
                type:"simple-marker",
                color:"#FFD700",
                size:7,
                style:"solid"
              };

              var classrender = {
                type:'unique-value',
                defaultSymbol:fsym,
                field:'类别',
                uniqueValueInfos:[{
                  value: "传统音乐",
                  symbol: asym,
                  label:"传统音乐"
                },{
                  value: "传统体育、游艺与杂技",
                  symbol: bsym,
                  label:"传统体育、游艺与杂技"
                },{
                  value: "民俗",
                  symbol: csym,
                  label:"民俗"
                },{
                  value: "传统技艺",
                  symbol: dsym,
                  label:"传统技艺"
                },{
                  value: "传统舞蹈",
                  symbol: esym,
                  label:"传统舞蹈"
                },{
                  value: "传统医药",
                  symbol: fsym,
                  label:"传统医药"
                },{
                  value: "传统美术",
                  symbol: gsym,
                  label:"传统美术"
                },{
                  value: "曲艺",
                  symbol: hsym,
                  label:"曲艺"
                },{
                  value: "传统戏剧",
                  symbol: isym,
                  label:"传统戏剧"
                },{
                  value: "民间文学",
                  symbol: jsym,
                  label:"民间文学"
                }]
              };

              var classpointLayer= new FeatureLayer({
                url: "https://localhost:6443/arcgis/rest/services/feiyiPoint1/FeatureServer",
                outFields: ["*"],
                renderer:classrender,
                popupTemplate:ptemplate,
              });

              //级别专题
              var sym1 = {
                type:"simple-marker",
                color:"#8cfffb",
                size:30,
                outline: {  // autocasts as new SimpleLineSymbol()
                  color:"#00BFFF",
                  width:1
                }
              };
              var sym2 = {
                type:"simple-marker",
                color:"#8cfffb",
                size:15,outline: {  // autocasts as new SimpleLineSymbol()
                  color:"#00BFFF",
                  width:1
                }
              };
              var sym3 = {
                type:"simple-marker",
                color:"#8cfffb",
                size:5,outline: {  // autocasts as new SimpleLineSymbol()
                  color:"#00BFFF",
                  width:1
                }
              };
              var graderender={
                type:"unique-value",
                field:rankBygrade,
                legendOptions: {
                  title: "级别"
                },
                stops: [
                  {
                    value: "世界级",
                    symbol: sym1,
                    label:"世界级"
                  }, {
                    value: "国家级",
                    symbol: sym2 ,
                    label:"国家级"
                  }, {
                    value: "省级",
                    symbol: sym3,
                    label:"省级"
                  }
                ],
                uniqueValueInfos: [
                  {
                    value: "世界级",
                    symbol: sym1,
                    label:"世界级"
                  }, {
                    value: "国家级",
                    symbol: sym2 ,
                    label:"国家级"
                  }, {
                    value: "省级",
                    symbol: sym3,
                    label:"省级"
                  }
                ]
              };
              var gradepointLayer = new FeatureLayer({
                url: "https://localhost:6443/arcgis/rest/services/feiyiPoint1/FeatureServer/0",
                outFields: ["*"],
                renderer:graderender,
                popupTemplate:ptemplate
              });
              if (index===2){
                _this.classShow=true;
                _this.gradeLegend=true;
                _this.classLegend=false;
                _this.heatmapShow=false;
                _this.gradeMap=gradepointLayer;
                map.add(gradepointLayer);
              }
              function rankBygrade(features) {
                var grade = features.attributes.级别;
                var rank;
                if(grade==='非物质文化遗产优秀实践名册|福建木偶戏人才培养计划'||grade==='国家第二批||省级第二批||市级||急需保护的非物质文化遗产名录|中国水密隔舱福船制造技艺'||grade==='急需保护的非物质文化遗产名录|中国木拱桥营造技艺'||grade==='人类非物质文化遗产代表作名录'||grade==='省级第一批||市级||人类非物质文化遗产代表作名录|妈祖信俗'){
                  rank='世界级'
                }else if (grade==='国家第二批||省级第二批||市级'||grade==='国家第二批||省级第三批||市级'||grade==='国家第二批||省级第四批'||grade==='国家第二批||省级第一批||市级'||grade==='国家第三批||省级第三批'||grade==='国家第三批||省级第一批||市级'||grade==='国家第三批||省级第三批||市级'||grade==='国家第四批||省级第二批||市级'||grade==='国家第四批||省级第三批||市级'||grade==='国家第四批||省级第四批||市级'||grade==='国家第四批||省级第一批||市级'||grade==='国家第一批||省级第二批'||grade==='国家第一批||省级第二批||市级'||grade==='国家第一批||省级第三批||市级'||grade==='国家第一批||省级第三批||市级'||grade==='国家第一批||省级第四批||市级'||grade==='国家第一批||省级第一批'||grade==='国家第一批||省级第一批||市级'||grade==='国家第一批||市级'){
                  rank='国家级'
                }else if (grade==='省级第二批||市级'||grade==='省级第二批'||grade==='省级第三批||市级'||grade==='省级第三批'||grade==='省级第四批||市级'||grade==='省级第四批'||grade==='省级第一批||市级'||grade==='省级第一批'){
                  rank='省级'
                }
                return rank;
              }


              //根据按钮传入设置渲染图层
              if (index===0){
                map.add(pointLayer);
                _this.classShow=true;
                _this.classLegend=false;
                _this.gradeLegend=false;
                _this.heatmapShow=false;
              }
              else if (index===1){
                _this.classShow=true;
                _this.classLegend=true;
                _this.gradeLegend=false;
                _this.classMap=classpointLayer;
                _this.heatmapShow=false;
                map.add(classpointLayer)
              }
              else if (index===4){
                _this.gradeLegend=false;
                _this.classLegend=false;
                _this.heatmapShow=true;
              }
            })
          }
      },mounted(){
          this.thematic(0);
      },props:['ptempte']
    }
</script>

<style scoped>
  #classthematic{
    position: absolute;
    width: 500px;
    height:20px;
    top: 650px;
    left: 250px;
  }
  #legend{
    position: absolute;
    top: 370px;
    left:1320px;
  }

  #orginal{
    position: absolute;
    left:1420px;
    top: 100px;
  }
  #class{
    position: absolute;
    left:1410px;
    top:155px;
  }
  #grade{
    position: absolute;
    left:1410px;
    top:210px;
  }
  #heatmap{
    position: absolute;
    left:1410px;
    top:265px;
    width:98px;
  }
  #heatmapImg{
    position: absolute;
    height:85%;
    width:80%;
    left:200px;
    top:90px;
  }
  #block{
    position: absolute;
    top:90px;
    left:230px;
  }
</style>
