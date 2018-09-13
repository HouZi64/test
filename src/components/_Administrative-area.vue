<template>
    <div id="administrativearea">
      <div id="viewDiv" style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;"></div>
      <template>
        <div id="searchList1">
          <el-table
            :data="areaList"
            height="616"
            border
            style="width: 300px;">
            <el-table-column
              fixed
              prop="attributes.coun_nm"
              label="行政区域"
              width="150"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button  @click="goTo_Search(scope.row)" type="text" size="small">定位检索</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template>
        <div id="searchList2" v-show="searchList2show">
          <el-table
            :data="pointList"
            height="200"
            border
            style="width: 980px;">
            <el-table-column
              fixed
              prop="attributes.名称"
              label="名称"
              width="200"
            >
            </el-table-column>
            <el-table-column
              fixed
              prop="attributes.级别"
              label="级别"
              width="200"
            >
            </el-table-column>
            <el-table-column
              fixed
              prop="attributes.类别"
              label="类型"
              width="200"
            >
            </el-table-column>
            <el-table-column
              fixed
              prop="attributes.区域"
              label="区域"
              width="200"
            >
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button  @click="gotoFeature(scope.row)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template>
        <div id="delete">
          <i class="el-icon-close" @click="deleteTable" v-show="searchList2show"></i>
        </div>
      </template>
      <template>
        <div id="dropmenu">
          <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="administrativeArea(0)">市</el-dropdown-item>
            <el-dropdown-item @click.native="administrativeArea(1)">镇</el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </div>
</template>

<script>
  import Home from './Home.vue'
  import esriLoader from 'esri-loader'
  esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');
    export default {
        name: "Administrative-area",
      data(){
          return{
            areaList:[],
            _test:[],
            pointList:[],
            _pointSubLayer:[],
            searchList2show:false,
            _count:[]
          }
      },components:{
          'v-home':Home
      },methods:{
          administrativeArea:function (index) {
            var _this=this;
            esriLoader.loadModules([
              "esri/Map",
              "esri/views/MapView",
              "esri/layers/MapImageLayer",
              "esri/layers/FeatureLayer",
              "esri/tasks/support/Query",
              "dojo/domReady!"]).then(([Map, MapView,MapImageLayer,FeatureLayer,Query])=>{
              var map = new Map({
                basemap: "oceans",
              });

              var view = new MapView({
                container: "viewDiv",
                map: map,
                center: [118.999, 25.88],
                zoom: 8,
                highlightOptions: {
                  color: [255, 255, 0, 1],
                  haloOpacity: 0.9,
                  fillOpacity: 0.2
                }
              });
              _this._test=view;
              //点图层和弹窗
              var pointUrl="https://localhost:6443/arcgis/rest/services/feiyiPoint1/MapServer";
              var pointLayer = new MapImageLayer({
                url: pointUrl,
                sublayers:[{
                  id:0,
                  visible:true,
                  popupTemplate:this.ptempte
                }],

              });
              var pointsubLayer = pointLayer.findSublayerById(0);
              _this._pointSubLayer=pointsubLayer;
              pointLayer.minScale = 8000000;
              //添加图层
              if(index===0){
                var areaUrl1="https://47.100.37.216:6443/arcgis/rest/services/Mingzheng/XZQ47/FeatureServer/1";
                var areaLayer =new FeatureLayer({
                  url:areaUrl1,
                  opacity:0.7,
                });
              }
              else if (index ===1){
                var areaUrl0="https://47.100.37.216:6443/arcgis/rest/services/XZQ/FeatureServer/0";
                  areaLayer =new FeatureLayer({
                  url:areaUrl0,
                  opacity:0.7,

                });
              }

              map.add(areaLayer);
              map.add(pointLayer);
              //监听updating的时候查询数据
              let graphics ;
              view.whenLayerView(areaLayer).then(function(layerView) {
                var fthis=_this;
                layerView.watch("updating", function(value) {
                  var sthis=fthis;
                  if (!value) {
                    //用要素图层建立查询工作
                    var query = new Query();
                    query = areaLayer.createQuery();
                    query.geometry=view.extent;//视图的范围
                    query.returnGeometry=true;
                    query.outFields=["*"];//查询完成后展示所有的字段
                    areaLayer.queryFeatures(query).then((results)=> {
                      var dthis=sthis;//this的指向
                      graphics = results.features;
                      dthis.areaList=results.features;//添加查询到的数据到数组里面
                    }).catch(function(error) {
                      console.error("query failed: ", error);
                    });
                  }
                });
              });
            })
          },
        //点击行政区跳转并实现该行政区的查询工作
           goTo_Search:function (event) {
          esriLoader.loadModules([
            "esri/tasks/support/Query"]).then(([Query])=>{
            var othis= this;//this的指向
            othis._test.goTo({
              target:event,//这里直接使用传入的参数，该参数里面自带有位置和范围信息
              zoom: 10
            },event).then(function () {
              var query = new Query();
              query =othis._pointSubLayer.createQuery();//在administrativearea里面把pointSubLayer赋给全局变量，这里调用
              query.geometry=event.geometry;//使用实参的geometry属性，查询特定区域内的非遗
              query.spatialRelationship = "contains";
              query.returnGeometry=true;
              query.distance=10;
              query.outFields=["*"];
              othis._pointSubLayer.queryFeatures(query)
                .then((response) =>{
                  othis.pointList=response.features;//将查询到的数据赋给pointList数组
                  othis.searchList2show=true;
                  if (othis.pointList.length===0){
                    alert('所选区域无数据')
                  }
                });

            })
          })
        },gotoFeature:function (point) {
          esriLoader.loadModules(["esri/geometry/Point"]).then(([Point])=>{
            var dthis = this;
            var targetPoint = new Point({
              latitude:point.attributes.x,
              longitude:point.attributes.y
            });
            dthis._test.goTo({
              target:targetPoint,
              zoom:10
            },targetPoint).then(function () {
              dthis._test.popup.open({
                  content:point.attributes.名称,
                  location: targetPoint ,
                }
              )
            })
          })
        },deleteTable(){
          this.searchList2show=!this.searchList2show;
        }
      },props:['ptempte'],
      mounted(){
          this.administrativeArea(0)
      }

    }
</script>

<style scoped>
  #searchList1 {
    background-color: rgba(31, 31,32, 1);
    position: absolute;
    top: 87px;
    left: 1228px;
    padding: 2px;
    opacity: 0.8;

  }
  #searchList2{
    background-color:#f1f1f1;
    position: absolute;
    top: 505px;
    left: 250px;
    padding: 2px;
    opacity: 0.8;

  }
  #delete{
    position:absolute;
    background-color:rgba(0,0,0,0);
    top: 520px;
    left: 1210px;
  }
  #dropmenu{
    position: absolute;
    background-color:rgba(0,0,0,0);
    top:103px;
    left: 1350px;
  }

</style>
