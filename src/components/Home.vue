
<template>
    
    <div id="home"> 
<el-container style="height:260px;width:1525px;">

    <!-- 顶栏 -->
    <el-header id="v-header" style="height:70px;width:1525px;background:#3597FE;border:1px solid #eee ;" >

      <div id="triangle" style="margin-left: 1080px"></div>
      <div class="mask" style="margin-left: 1108px;margin-top:-50px;"></div>
      <h1 id="title" style="font-family: 华文楷体;font-size:40px;color:#fff">走进非物质文化遗产</h1>
    </el-header>


<el-container >
    <!-- 侧边栏 -->
    <el-aside style="width: 240px;height:628px;" id="aside">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#fff"
      text-color="#000000"
      active-text-color="#409EFF"
      style="height: 100%"
       >
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span  @click="toChange(0)">首页</span>
        </template>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
        <i class="el-icon-menu"></i>
        <span  >行政区</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1" @click="toChange(1)">区域查询</el-menu-item>
          <el-menu-item index="2-2" @click="toChange(2)">统计分析</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span  >文化区</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1" @click="toChange(5)">区域查询</el-menu-item>
          <el-menu-item index="3-2" @click="toChange(6)">统计分析</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="4">
        <template slot="title">
          <i class="el-icon-search"></i>
          <span @click="toChange(4)" >专题展示</span>
        </template>
      </el-menu-item>
      <el-menu-item index="5">
        <template slot="title">
        <i class="el-icon-view"></i>
        <span slot="title" @click="toChange(7)">非遗展览</span>
        </template>

      </el-menu-item>
    </el-menu>

    </el-aside>
        <!-- 地图 -->
    <el-main id="main">
      <components :is="url[i]" :ptempte="ptempte" :esriModules="esriModules" :more02="more02" :more01="more01" :more007="more007" :less007="less007"
      :calculateInheritor0="calculateInheritor0" :calculateInheritor1="calculateInheritor1" :calculateInheritor2="calculateInheritor2" :area="area"
      :calculateInheritor3="calculateInheritor3"
      ></components>
    </el-main>
</el-container>
</el-container>
    </div>
</template>

<script>
import EsriMapVue from './EsriMap.vue';
import administrativearea from './_Administrative-area.vue'
import staticanalyse from './Static.vue'
import class_thematic from './Thematic_map/class_thematic.vue'
import cultureAreaSearch from './Culture area/area_search.vue'
import cultureAreaStatic from './Culture area/area_static.vue'
import feiyidata from './feiyi_data.vue'

    export default{
        data(){
            return{
              i:0,
              url:['v-esrimap','v-administrativearea','v-static',,'v-class_thematic','v-cultureAreaSearch','v-cultureAreaStatic','v-feiyidata'],
              ptempte: {
                title:"非物质文化遗产",
                content: [{
                  type: "fields",
                  fieldInfos: [{//对象的一个数组，定义了数据库中的字段如何在弹窗中显示，每个对象包含有这个字段的属性
                    fieldName: "名称",
                    label: "名称",
                    visible: true
                  }, {
                    fieldName: "区域",
                    label: "区域",
                    visible: true,
                    format: {//与数字或日期字段一起使用的对象，用于提供有关如何在弹出窗口中显示值的更多详细信息。
                      //格式化数字字段时，必须设置格式digitSeparator和places属性才能使格式生效。
                      digitSeparator: true,
                      places: 0
                    }
                  }, {
                    fieldName: "级别",
                    label: "级别",
                    visible: true,
                    format: {
                      digitSeparator: true,
                      places: 0
                    }
                  }, {
                    fieldName: "类别",
                    label: "类别",
                    visible: true,
                    format: {
                      digitSeparator: true,
                      places: 0
                    }
                  }, {
                    fieldName: "adress",
                    label: "地址",
                    visible: true,
                    format: {
                      digitSeparator: true,
                      places: 0
                    }
                  }]
                }]
              },
              esriModules:[
                "esri/tasks/QueryTask",
                "esri/Map",
                "esri/layers/TileLayer",
                "esri/views/MapView",
                "esri/layers/FeatureLayer",
                "esri/widgets/Search",
                "esri/widgets/Sketch/SketchViewModel",
                "esri/Graphic",
                "esri/layers/GraphicsLayer",
                "esri/layers/MapImageLayer",
                "esri/tasks/support/Query",
                "esri/widgets/ScaleBar",
                "esri/tasks/IdentifyTask",
                "esri/tasks/support/IdentifyParameters",
                "dojo/_base/array",
                "dojo/on",
                "esri/geometry/geometryEngine",
                "dojo/domReady!"],
              more02:{
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#00FF00",
                style: "solid",
                outline: {
                  width: 0.5,
                  color: "white"
                }
              },
              more01:{
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#ADFF2F",
                style: "solid",
                outline: {
                  width: 0.5,
                  color: "white"
                }
              },
              more007:{
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#FFD700",
                style: "solid",
                outline: {
                  width: 0.5,
                  color: "white"
                }
              },
              less007:{
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#FF0000",
                style: "solid",
                outline: {
                  width: 0.5,
                  color: "white"
                }
              },
              area:[
                {
                  value:'福州',
                  label:'福州'
                },
                {
                  value:'厦门',
                  label:'厦门'
                },{
                  value:'宁德',
                  label:'宁德'
                },{
                  value:'莆田',
                  label:'莆田'
                },{
                  value:'泉州',
                  label:'泉州'
                },{
                  value:'漳州',
                  label:'漳州'
                },{
                  value:'龙岩',
                  label:'龙岩'
                },{
                  value:'三明',
                  label:'三明'
                },{
                  value:'南平',
                  label:'南平'
                },{
                  value:'省直',
                  label:'省直'
                }],
            }
        },components:{
            'v-esrimap':EsriMapVue,
            'v-administrativearea':administrativearea,
            'v-static':staticanalyse,
            'v-class_thematic':class_thematic,
            'v-cultureAreaSearch':cultureAreaSearch,
            'v-cultureAreaStatic':cultureAreaStatic,
            'v-feiyidata':feiyidata
        },methods:{
            toChange:function (index) {
              if (index ===0){
                this.i=0;
              }
              else if (index ===1){
                this.i=1
              }
              else if (index===2){
                this.i=2;
              }
              else if (index===3){
                this.i=3
              }
              else if (index===4){
                this.i=4
              }
              else if (index===5){
                this.i=5
              }
              else if (index===6){
                this.i=6
              }
              else if (index===7){
                this.i=7
              }
            },
        calculateInheritor0: function(features) {
  var peo88=Math.round(features.attributes.f88peop);
  var inheritorpeo=features.attributes.ccr;
  var  results=inheritorpeo/peo88;
  return results
},
        calculateInheritor1: function(features) {
  var peo00=Math.round(features.attributes.f00peop);
  var inheritorpeo=features.attributes.ccr;
  var  results=inheritorpeo/peo00;
  return results
},
        calculateInheritor2: function (features) {
  var peo12=Math.round(features.attributes.f12peop);
  var inheritorpeo=features.attributes.ccr;
  var  results=inheritorpeo/peo12;
  return results
},
        calculateInheritor3: function (features) {
  var peo16=Math.round(features.attributes.f16peop);
  var inheritorpeo=features.attributes.ccr;
  var  results=inheritorpeo/peo16;
  return results
}
      }
    }
</script>

<style scoped>
#home *{
    box-sizing:border-box;

}
#home {
    margin:20px auto;

}
#headerfont {
    color: #0994df;
    position: absolute;
    top:-15px;
    left:10px
}

#v-header{
  position:absolute;
  top:18px;
}
#aside{
  position: absolute;
  top:90px;
}
#title{
    position: absolute;
    top:-25px;
    left:1px;
  }
#triangle
{
  width: 0;
  height:0;
  border:50px solid red;
  border-top-color:#3e58c9;
  border-bottom: none;
  border-left-color: transparent;
  border-right-color: transparent;
}
.mask
{
  width:395px;
  height:0;
  border-bottom:68px solid #3448a1;
  border-left:68px solid transparent;
  margin-left: -30px;
}

</style>

