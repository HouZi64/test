<template>
<div id="EsriMap">
<div id="viewDiv" style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;">
  <div id="topbar">
    <button class="action-button esri-icon-polygon" id="polygonButton" type="button"
            title="多边形框"></button>
  </div>
  <div id="topbar0">
    <button class="action-button esri-icon-trash" id="resetBtn" type="button" title="清除"></button>
  </div>
  <template>
    <!--多边形框检索列表-->
    <div id="searchlist" v-show="searchListshow">
    <el-table
      :data="areaList"
      height="450"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="attributes.名称"
        label="名称"
        width="150"
      >
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button  @click="goToview(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <!--多条件检索列表-->
    <div id="multiConditionList" v-show="multiConditionshow">
      <el-table
        :data="multiConditionList"
        height="450"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="attributes.名称"
          label="名称"
          width="150"
        >
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button  @click="goToview(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="multiCondition1">
      <el-select v-model="value1" filterable placeholder="请选择类别">
        <el-option
          v-for="item in category"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div id="multiCondition2">
      <el-select v-model="value2" filterable placeholder="请选择区域">
        <el-option
          v-for="item in area"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div id="multiConditionButton">
      <el-button @click="multiCondition(value2,value1)">检索</el-button>
    </div>
  </template>
</div>
</div>
</template>

<script>
 import esriLoader from 'esri-loader'
   esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');

    export default{
        data(){
          return{
            areaList:[],
            _test:[],
            resultId:[],
            _isReset:[],
            index:0,
            category:[{
              value: '传统音乐',
              label: '传统音乐'
            },{
              value: '传统体育、游艺与杂技',
              label: '传统体育、游艺与杂技'
            },{
              value: '民俗',
              label: '民俗'
            },{
              value: '传统技艺',
              label: '传统技艺'
            },{
              value: '传统舞蹈',
              label: '传统舞蹈'
            },{
              value: '传统医药',
              label: '传统医药'
            },{
              value: '传统美术',
              label: '传统美术'
            },{
              value: '曲艺',
              label: '曲艺'
            },{
              value: '传统戏剧',
              label: '传统戏剧'
            },{
              value: '民间文学',
              label: '民间文学'
            }],
            multiConditionList:[],
            searchListshow:false,
            multiConditionshow:false,
            value1: '',value2:'',
          }
        },methods:{
            //地图
            createMap:function(){
              var _this=this;
              const options = {
                url:"http://localhost:8080/arcgis_js_v48_api/init.js"};
              esriLoader.loadModules(this.esriModules).then(([QueryTask,Map, TileLayer, MapView, FeatureLayer, Search,
              SketchViewModel, Graphic, GraphicsLayer,MapImageLayer,Query,ScaleBar,IdentifyTask,IdentifyParameters,arrayUtils,on,geometryEngine])=>{

              let editGraphic;
              // GraphicsLayer 上加载Graphic
              const tempGraphicsLayer = new GraphicsLayer();
              var baseLayer = new TileLayer({
                  url: "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
                  id: "ny-housing",
                  opacity: 0.9
              });//底图，切片图层
                var pointUrl = "https://localhost:6443/arcgis/rest/services/feiyipoint_grade/MapServer";
                var pointLayer = new MapImageLayer({
                  url:pointUrl ,
                  //在mapimagelayer中有个sublayer属性，通过sublayer实现点击弹窗效果
                  sublayers:[{
                    id:0,
                    visible:true,
                  }],
                });
                pointLayer.minScale = 8000000;//设置最小展示尺度
              var sublayers = pointLayer.findSublayerById(0);
              var featurePointURL="https://localhost:6443/arcgis/rest/services/feiyiPoint2/FeatureServer";
              var featureLayer = new FeatureLayer({
                    url:featurePointURL ,
                    outFields: ["*"],
                  });
              _this.featureLayer=featureLayer;

              var map = new Map({
                  layers: [baseLayer, tempGraphicsLayer,featureLayer]
              });
              //通过地图类添加容器并初始化属性
              var view = new MapView({
                  container: "viewDiv",
                  map: map,
                  center: [119.999, 26.88],
                  zoom: 8,
              });

                //属性的检索与弹窗
              view.when(function () {
                on(view,"click",executeIdentifyTask);
              });
              function executeIdentifyTask(event) {
                var  identifyTask = new IdentifyTask(pointUrl);
                // Set the parameters for the Identify
                var  params = new IdentifyParameters();
                params.tolerance = 3;
                params.layerIds = [0];
                params.layerOption = "all";
                params.width = view.width;
                params.height = view.height;
                params.geometry = event.mapPoint;
                params.mapExtent = view.extent;
                identifyTask.execute(params).then((response)=>{
                  var results = response.results['0'].feature.attributes;
                  return results;
                }).then(showPopup);
                function showPopup(results) {
                  if (results){
                    console.log(results);
                    view.popup.open({
                      location:event.mapPoint,
                      title:"非物质文化遗产明细",
                      content:
                        "<br><b>名称：</b>"+results.名称+"<br><b>类别：</b>"+results.类别+"<br><b>区域：</b>"+results.区域+"<br><b>地址：</b>"+results.adress+
                        "<img src='" + results.图片 + "' style='width:100%;height:auto'/>"+"<br><a href='"+results.data+"' target='_blank'>查看更多</a>"
                    })
                  }
                }
              }

              var scaleBar = new ScaleBar({
                view: view,
                unit: "dual" // The scale bar displays both metric and non-metric units.
              });

              // Add the widget to the bottom left corner of the view
              view.ui.add(scaleBar, {
                position: "bottom-left"
              });
              _this._test=view;//view赋给外界的全局变量，以便下个函数调用
              // 建立一个新的sketchmodelview
              view.when(function () {
                    const sketchViewModel = new SketchViewModel({
                        view: view,
                        layer: tempGraphicsLayer,
                        polygonSymbol: {
                            type: "simple-fill", // autocasts as new SimpleFillSymbol()
                            color: "rgba(138,43,226, 0.8)",
                            style: "solid",
                            outline: {
                                color: "white",
                                width: 1
                            }
                        }
                    });
                    setUpClickHandler();
                    //监听create-complete，添加多边形并执行查询
                    sketchViewModel.on("create-complete", addGraphic_Search);
                    // 监听update-complete 并执行更新事件
                    sketchViewModel.on("update-complete", updateGraphic);
                    sketchViewModel.on("update-cancel", updateGraphic);

                    // 当create-complete 事件触发
                    function addGraphic_Search(event) {
                      let my_this=_this;
                        // 建立一个新的Graphic并添加到几何图形
                        const graphic = new Graphic({
                            geometry: event.geometry,
                            symbol: sketchViewModel.graphic.symbol
                        });
                        tempGraphicsLayer.add(graphic);
                      //测量面积
                      var area = geometryEngine.geodesicArea(event.geometry,"acres");
                      labelAreas(event.geometry,area);
                      function labelAreas(geom,area) {
                        var measureGraphic = new Graphic({
                          geometry:geom.centroid,
                          symbol: {
                            type: "text",
                            color: "black",
                            haloColor: "black",
                            haloSize: "1px",
                            text: area.toFixed(2) + "公顷",
                            xoffset: 3,
                            yoffset: 3,
                            font: { // autocast as Font
                              size: 14,
                              family: "sans-serif"
                            }
                          }
                        });
                        tempGraphicsLayer.add(measureGraphic)
                      }
                      // 创建多边形框查询工作\
                      var query = new Query();
                      query = sublayers.createQuery();
                      query.geometry=event.geometry;
                      query.spatialRelationship = "contains";
                      query.returnGeometry=true;
                      query.distance=10;
                      query.outFields=["*"];

                      sublayers.queryFeatures(query)
                        .then((response) =>{
                          _this.areaList=response.features;
                          _this.resultId=response.features;
                          _this.searchListshow=!_this.searchListshow;
                      if (_this.areaList.length===0){
                        alert('所选区域无数据')
                      }
                    });

                    }
                    // 当sketchViewModel的更新完成和取消事件触发
                    function updateGraphic(event) {
                      //事件的graphic是用户点击并且改变了几何图形，更新这个几何图形并添加到图层上
                        event.graphic.geometry = event.geometry;
                        tempGraphicsLayer.add(event.graphic);
                        // set the editGraphic to null update is complete or cancelled.
                        editGraphic = null;
                    }
                    // set up logic to handle geometry update and reflect the update on "tempGraphicsLayer"
                    function setUpClickHandler() {
                        view.on("click", function (event) {
                            view.hitTest(event).then(function (response) {
                                let results = response.results;
                                // Found a valid graphic
                                if (results.length && results[results.length - 1]
                                  .graphic) {
                                    // Check if we're already editing a graphic
                                    if (!editGraphic) {
                                        // Save a reference to the graphic we intend toe update
                                        editGraphic = results[results.length - 1].graphic;
                                        // Remove the graphic from the GraphicsLayer
                                        // Sketch will handle displaying the graphic while being updated
                                        tempGraphicsLayer.remove(editGraphic);
                                        sketchViewModel.update(editGraphic);
                                    }
                                }
                            });
                        });
                    }

                    // 激活sketch画多边形
                    var drawPolygonButton = document.getElementById("polygonButton");
                    drawPolygonButton.onclick = function () {
                        // 让sketchviewmodel画一个多边形
                        sketchViewModel.create("polygon",sublayers);
                        setActiveButton(this);

                    };

                    // 重置按钮
                    document.getElementById("resetBtn").onclick = function () {
                        sketchViewModel.reset();
                        tempGraphicsLayer.removeAll();
                        _this.searchListshow=false;
                        _this.multiConditionshow=false;
                        setActiveButton();

                    };
                    function setActiveButton(selectedButton) {
                        // focus the view to activate keyboard shortcuts for sketching
                        view.focus();
                        var elements = document.getElementsByClassName("active");
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].classList.remove("active");
                        }
                        if (selectedButton) {
                            selectedButton.classList.add("active");
                        }

                    }
                });

                  //搜索框小部件，属性的设置参照官网
              var searchWidget = new Search({
                  view: view,
                  locationEnabled: false,
                  exactMatch: false,
                  includeDefaultSources: false,//设置为false的时候在搜索框中不会出现多选按钮（即不会有自带的那个地理编码服务）
                  sources: [{
                      featureLayer: {
                          url: featurePointURL,
                          outFields: ["*"],
                      },
                      placeholder: "输入非遗名称",//

                  }],
              });
              // ui添加搜索组件
              view.ui.add(searchWidget, {
                  position: "top-right"
              });
              return view
              })
          },
        //跳转
        goToview :function(event){
              esriLoader.loadModules(["esri/geometry/Point"]).then(([Point])=>{
                var othis = this;
                var targetPoint = new Point({
                  latitude:event.attributes.x,
                  longitude:event.attributes.y
                });
                othis._test.goTo({
                  target:targetPoint,
                  zoom: 10
                },targetPoint).then(function () {
                    othis._test.popup.open({
                     content:event.attributes.名称,
                     location: targetPoint ,

                    }
                  )
                })
              })
        },
        //多条件检索
        multiCondition:function (test1,test2) {
              var gthis = this;
              esriLoader.loadModules([
                "esri/tasks/QueryTask",
                "esri/layers/FeatureLayer",
                "esri/layers/MapImageLayer",
                "esri/tasks/support/Query",
              ]).then(([QueryTask,FeatureLayer,MapImageLayer,Query])=>{

                var featureLayer = new FeatureLayer({
                  url: "https://localhost:6443/arcgis/rest/services/feiyiPoint1/FeatureServer",
                  outFields: ["*"],
                });
                var pointUrl = "https://localhost:6443/arcgis/rest/services/feiyiPoint2/MapServer";
                var pointLayer = new MapImageLayer({
                  url:pointUrl ,
                  sublayers: [{
                    id:0,
                    visible:true
                  }]
                });
                var sublayers = pointLayer.findSublayerById(0);
                var queryTask = new QueryTask({
                  url: featureLayer
                });
                var query = new Query();
                query.returnGeometry=true;
                query.outFields=["*"];
                query.where = "区域 = '"+test1 +"'"+" "+"AND"+" "+"类别 = '"+ test2 +"'";
                sublayers.queryFeatures(query).then((results)=>{
                  var hthis=gthis;
                  hthis.multiConditionList=results.features;
                  hthis.multiConditionshow=!hthis.multiConditionshow;
                  if (hthis.multiConditionList.length===0){
                    alert('无满足条件非物质文化遗产')
                  }
                });
              })

        }
        },
      mounted(){
        this.createMap();
      },props:['esriModules','area']
    }
</script>

<style    scoped>
#topbar {
              background: #fff;
              position: absolute;
              top: 120px;
              left: 10px;
              padding: 2px;
          }

          .action-button {
              font-size: 16px;
              background-color: transparent;
              border: 1px solid #D3D3D3;
              color: #6e6e6e;
              height: 32px;
              width: 32px;
              text-align: center;
              box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
          }

              .action-button:hover,
              .action-button:focus {
                  background: #0079c1;
                  color: #e4e4e4;
              }

          .active {
              background: #0079c1;
              color: #e4e4e4;
          }

</style>
<style>
#topbar0 {
              background: #fff;
              position: absolute;
              top: 152px;
              left: 10px;
              padding: 2px;
          }

          .action-button {
              font-size: 16px;
              background-color: transparent;
              border: 1px solid #D3D3D3;
              color: #6e6e6e;
              height: 32px;
              width: 32px;
              text-align: center;
              box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
          }

              .action-button:hover,
              .action-button:focus {
                  background: #0079c1;
                  color: #e4e4e4;
              }

          .active {
              background: #0079c1;
              color: #e4e4e4;
          }
</style>
<style>
  #searchlist {
    background-color: rgba(197, 235,255, 1);
    position: absolute;
    top: 100px;
    left: 1020px;
    padding: 2px;
    opacity: 1;

  }
  #multiCondition1{
    position: absolute;
    top: -56px;
    left: 420px;
  }
  #multiCondition2{
    position: absolute;
    top: -56px;
    left:160px;
  }
  #multiConditionList{
    position: absolute;
    top: 100px;
    left: 1020px;
  }
  #multiConditionButton{
    position: absolute;
    top: -56px;
    left: 680px;
  }
</style>


