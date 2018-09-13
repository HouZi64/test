<template>
    <div id="staticanalyse">
        <div id="viewDiv1" style="position: absolute;width:645px;height:620px;left: 251px;top: 90px;" v-show="doublescreenshow"></div>
        <div id="viewDiv2" style="position: absolute;width:635px;height:620px;left: 895px;top: 90px;"  v-show="doublescreenshow"></div>
      <div id="viewDiv" style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;" v-show="tableshow"></div>
      <template>
        <div id="searchList1">
          <el-table
            :data="areaList"
            height="616"
            border
            style="width:249px;font-size: 15px"
            v-show="tableshow">
            <el-table-column
              fixed
              prop="attributes.coun_nm"
              label="行政区"
              width="80"
            >
            </el-table-column>

            <el-table-column
              fixed="right"
              label="定位"
              width="55">
              <template slot-scope="scope" style="font-size: 15px">
                <el-button  @click="goTo_Search(scope.row)" type="text" size="small">定位</el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed
              label="  统计"
              width="115">
              <template slot-scope="scope">
                  <el-cascader
                    :options="test"
                    expand-trigger="hover"
                    v-model="val"
                    size="small"
                    @change="Static(scope.row,1,val[1],val[0])"
                   >
                  </el-cascader>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <div id="c1"  style="position: absolute; top:160px;left:450px"></div>
      <div id="c2" v-show="classShow" style="position: absolute; top:160px;left:450px"></div>
      <template>
        <div id="dropmenu">
          <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="staticAnalyse(0)">市</el-dropdown-item>
              <el-dropdown-item @click.native="staticAnalyse(1)">镇</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div id="deleteButton">
          <el-button type="primary" plain @click="turnOff" style="width: 100px" v-show="buttonShow">关闭</el-button>
        </div>
        <div id="shuangping">
          <el-button type="primary" plain style="width: 100px" disabled:shuangpingUse @click="doubleScreen" v-show="buttonShow">双屏对比</el-button>
        </div>
        <div id="allcount">
          <el-button type="primary" plain @click="allStatic(2)" style="width: 100px" v-show="buttonShow">全省统计</el-button>
        </div>
        <div id="inheritor">
          <el-button type="primary" plain @click="inheritorAnalyse(yearvalue)" style="width: 100px" v-show="buttonShow">传承分析</el-button>
        </div>
        <div id="back">
          <el-button type="primary" plain @click="staticAnalyse(0)" style="width: 100px" v-show="buttonShow">原始图层</el-button>
        </div>
        <div id="compare">
          <el-button type="primary" plain   style="width: 100px" v-show="buttonShow" @click="showCompare">区域对比</el-button>
        </div>
        <div id="back2">
          <el-button type="primary" plain @click="goBack" style="width: 100px" v-show="!buttonShow">返回</el-button>
        </div>
        <div id="year">
            <el-select v-model="yearvalue" placeholder="选择年份" v-show="yearshow" >
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click.native="inheritorAnalyse(yearvalue)"
               >
              </el-option>
            </el-select>
        </div>
        <div id="doublescreenyear1">
          <el-select v-model="doublescreenyearvalue1" placeholder="选择年份" v-show="doublescreenshow" >
            <el-option
              v-for="item in years"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="doubleScreen(0,doublescreenyearvalue1)"
            >
            </el-option>
          </el-select>
        </div>
        <div id="doublescreenyear2">
          <el-select v-model="doublescreenyearvalue2" placeholder="选择年份" v-show="doublescreenshow" >
            <el-option
              v-for="item in years"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="doubleScreen(1,doublescreenyearvalue2)"
            >
            </el-option>
          </el-select>
        </div>
        <div id="area1">
          <el-select v-model="area1" v-show="compareShow" placeholder="选择区域"   >
            <el-option
              v-for="item in allarea"
              :key="item.attributes.coun_nm"
              :label="item.attributes.coun_nm"
              :value="item.attributes.coun_nm"
              @click.native="areaCompare(area1,1)"
            >
            </el-option>
          </el-select>
        </div>
        <div id="area2">
          <el-select v-model="area2" v-show="compareShow" placeholder="选择区域"  >
            <el-option
              v-for="item in allarea"
              :key="item.attributes.coun_nm"
              :label="item.attributes.coun_nm"
              :value="item.attributes.coun_nm"
              @click.native="areaCompare(area2,2)"
            >
            </el-option>
          </el-select>
        </div>
      </template>
    </div>
</template>

<script>
  import esriLoader from 'esri-loader';
  import G2 from '@antv/g2';
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/polar'
  esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');
    export default {
        name: "Static",
      data(){
          return{
            _view:[],
            _pointSubLayer:[],
            pointList:[],
            areaList:[],
            areaName:[],
            areaNumber:[],
            areaStatic:[],
            className:['传统音乐','传统体育、游艺与杂技','民俗','传统技艺','传统舞蹈','传统医药','传统美术','曲艺','传统戏剧','民间文学'],
            classNumber:[],
            classStatic:[],
            classShow:true,
            gradeName:['世界级','国家级','省级'],
            gradeNumber:[],
            gradeStatic:[],
            gradeTableShow:false,
            gradeChart:[],
            graderepair:false,
            Chart:[],
            allareaChart:[],
            morestatic:[],
            tableshow:true,
            shuangpingUse:false,
            years: [
              {
              value: '1990',
              label: '1990年'
            },
              {
              value: '1991',
              label: '1991年'
            },
              {
              value: '1992',
              label: '1992年'
            },
              {
              value: '1993',
              label: '1993年'
            },
              {
              value: '1994',
              label: '1994年'
            },
              {
              value: '1995',
              label: '1995年'
            },
              {
              value: '1996',
              label: '1996年'
            },
              {
              value: '1997',
              label: '1997年'
            },
              {
              value: '1998',
              label: '1998年'
            },
              {
              value: '1999',
              label: '1999年'
            },
              {
                value: '2000',
                label: '2000年'
              },
              {
              value: '2001',
              label: '2001年'
            },
              {
              value: '2002',
              label: '2002年'
            },
              {
              value: '2003',
              label: '2003年'
            },
              {
              value: '2004',
              label: '2004年'
            },
              {
              value: '2005',
              label: '2005年'
            },
              {
              value: '2006',
              label: '2006年'
            },
              {
              value: '2007',
              label: '2007年'
            },
              {
              value: '2008',
              label: '2008年'
            },
              {
              value: '2009',
              label: '2009年'
            },
              {
              value: '2010',
              label: '2010年'
            }, {
              value: '2011',
              label: '2011年'
            }, {
              value: '2012',
              label: '2012年'
            }, {
              value: '2013',
              label: '2013年'
            }, {
              value: '2014',
              label: '2014年'
            }, {
              value: '2015',
              label: '2015年'
            }, {
              value: '2016',
              label: '2016年'
            }],
            yearshow:false,
            yearvalue:'',
            doublescreenyearvalue1:'',
            doublescreenyearvalue2:'',
            buttonShow:true,
            doublescreenshow:false,
            doublescreenyearshow:false,
            areaUrl:"https://localhost:6443/arcgis/rest/services/XZQ/FeatureServer/1",
            areaLayer1:[],
            areaLayer2:[],
            test:[
              {
              value: 1,
              label: '类别统计',
              children:[{
                value: 1,
                label: '柱状图'
              }, {
                value: 2,
                label: '饼状图'
              }]
            }, {
              value: 2,
              label: '级别统计',
              children:[{
                value: 1,
                label: '柱状图'
              }, {
                value:2,
                label: '饼状图'
              }]
            },],
            val: [],
            area1:[],
            area2:[],
            allarea:[],
            areaLayer:[],
            areanumber1:[],
            areanumber2:[],
            raderTableData:[],
            compareArea1:[],
            compareArea2:[],
            compareShow:false
          }
      },
      methods:{
          staticAnalyse:function (index) {
            this.shuangpingUse=false;
            this.yearshow=false;
            var _this=this;
            esriLoader.loadModules([
              "esri/Map",
              "esri/views/MapView",
              "esri/layers/MapImageLayer",
              "esri/layers/FeatureLayer",
              "esri/tasks/support/Query",
              "dojo/domReady!"]).then(([Map, MapView,MapImageLayer,FeatureLayer,Query])=>{
              var pointUrl="https://localhost:6443/arcgis/rest/services/feiyiPoint1/MapServer";
              var pointLayer = new MapImageLayer({
                url: pointUrl,
                sublayers:[{
                  id:0,
                  visible:true,
                  popupTemplate:this.ptempte
                }],

              });
              pointLayer.minScale = 8000000;//设置最小展示尺度
              var pointsubLayer = pointLayer.findSublayerById(0);
              _this._pointSubLayer=pointsubLayer;
              if(index===0){
                var sjareaUrl="https://localhost:6443/arcgis/rest/services/XZQ/FeatureServer/1";
                var areaLayer =new FeatureLayer({
                  url:sjareaUrl,
                  opacity:0.7,
                });
                _this.morestatic=0,
                _this.areaLayer=areaLayer
              }
              else if (index ===1){
                var xjareaUrl="https://localhost:6443/arcgis/rest/services/XZQ/FeatureServer/0";
                areaLayer =new FeatureLayer({
                  url:xjareaUrl,
                  opacity:0.7,
                });
                _this.morestatic=1
              }
              var map = new Map({
                basemap: "oceans",
                layers:[areaLayer,pointLayer]
              });
              var view = new MapView({
                container: "viewDiv",
                map: map,
                center: [118.999, 25.88],
                zoom:8,
              });
              _this._view=view;

              //监听updating的时候查询数据
              let graphics ;
              view.whenLayerView(areaLayer).then(function(layerView) {
                //this的指向
                var athis=_this;
                layerView.watch("updating", function(value) {
                  //this的指向
                  var bthis=athis;
                  if (!value) {
                    //用要素图层建立查询工作
                    var query = new Query();
                    query = areaLayer.createQuery();
                    query.geometry=view.extent;//视图的范围
                    query.returnGeometry=true;
                    query.outFields=["*"];//查询完成后展示所有的字段
                    areaLayer.queryFeatures(query).then((results)=> {
                    var cthis=bthis;//this的指向
                    graphics = results.features;
                    cthis.areaList=results.features;//添加查询到的数据到数组里面
                    }).catch(function(error) {
                      console.error("query failed: ", error);
                    });
                  }
                });
              });
            });
          },
        //行政区定位检索
        goTo_Search:function (event) {
          esriLoader.loadModules([
            "esri/tasks/support/Query"]).then(([Query])=>{
            var othis= this;//this的指向
            othis._view.goTo({
              target:event,//这里直接使用传入的参数，该参数里面自带有位置和范围信息
              zoom: 10
            },event).then(function () {
              var query = new Query();
              query =othis._pointSubLayer.createQuery();
              query.geometry=event.geometry;//使用实参的geometry属性，查询特定区域内的非遗
              query.spatialRelationship = "contains";
              query.returnGeometry=true;
              query.distance=10;
              query.outFields=["*"];
              othis._pointSubLayer.queryFeatures(query)
                .then((response) =>{
                  othis.pointList=response.features;//将查询到的数据赋给pointList数组
                  if (othis.pointList.length===0){
                    alert('所选区域无数据')
                  }
                });
            })
          })
        },
        //分类统计
        Static:function (event,index1,index2,index3) {
            esriLoader.loadModules([
              "esri/tasks/support/Query"]).then(([Query])=>{
               var dthis=this;
              var coutness = {
                onStatisticField: "级别",  // service field for 2015 population
                outStatisticFieldName: "number",
                statisticType: "count"
              };
              //类别统计
              for (var a=0;a<dthis.className.length;a++){
                  var query = new Query();
                  query.geometry=event.geometry;
                  query.outStatistics=[ coutness];
                  if(index3===1) {
                    query.where = "类别 = '" + dthis.className[a] + "'";//从className中获取各个类别的名字然后作为验证
                  }
                 else if (index3===2){
                    query.where= "grade='"+ dthis.gradeName[a]+"'";
                  }
                  dthis._pointSubLayer.queryFeatures(query).then(
                    (response)=> {
                      var stats = response.features[0].attributes;
                      if (index3===1){
                        dthis.classNumber.push(stats.number);
                        if (dthis.classNumber.length===dthis.className.length) {//当classNumber的长度为10（即全部注完以后）时才制作表格
                          dthis.taleMaking(dthis.classNumber,index1,index2);
                        }
                      }
                      else if (index3===2){
                          dthis.gradeNumber.push(stats.number);
                          if (dthis.gradeNumber.length===3&&!dthis.graderepair){
                            dthis.taleMaking(dthis.gradeNumber,3,index2)
                          }
                      }
                    }
                  );
              }
        });
            this.classShow=true;
            this.gradeTableShow=true;
        },
        //全省行政区非遗统计方法
        allStatic:function (index1){
             this.yearshow=false;
             esriLoader.loadModules([
              "esri/tasks/support/Query"]).then(([Query])=>{
              //创建统计字段和方法
              var coutness = {
                onStatisticField: "级别",  // service field for 2015 population
                outStatisticFieldName: "number",
                statisticType: "count"
              };
              //遍历areaList并导入_allstatic空数组
                for(var i=0;i<this.areaList.length; i++){
                  ((i)=>{
                    var query = new Query();
                    query.geometry=this.areaList[i].geometry;
                    query.outStatistics=[coutness];
                    this.areaName.push(this.areaList[i].attributes.coun_nm);
                    this._pointSubLayer.queryFeatures(query).then(
                      (response) => {
                        var stats = response.features[0].attributes;
                        this.areaNumber.push(stats.number);
                        if (this.areaNumber.length===this.areaList.length){
                          this.taleMaking(this.areaNumber,index1);
                        }
                      });
                  })(i)
             }
            });
        },
        //统计图表制作
        taleMaking:function(results,index1,index2){
          var Chart = new G2.Chart({
              container: 'c2', // 指定图表容器 ID
              width: 700, // 指定图表宽度
              height: 420,// 指定图表高度
              padding: [10, 10, 200, 20],
              background: {
                fill: '#ffffff', // 图表背景色
              }
            });
          Chart.axis('name', {
            label: {
              textStyle: {
                textAlign: 'middle', // 文本对齐方向，可取值为： start middle end
                fill: '#8c8c8c', // 文本的颜色
                fontSize: '10', // 文本大小
                fontWeight: 'normal', // 文本粗细
                rotate: 30,
                textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
              }
            },
          });
          Chart.axis('number', {
            label: {
              textStyle: {
                textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#8c8c8c', // 文本的颜色
                fontSize: '10', // 文本大小
                fontWeight: 'normal', // 文本粗细
                rotate: 30,
                textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
              }
            },
            grid: {
              lineStyle: {
                stroke: '#d9d9d9',
                lineWidth: 1,
                lineDash: [2, 2]
              }
            }
          });
          this.Chart=Chart;
          //分类统计图表
          if (index1===1){
            this.classNumber=[];
            for (var m =0;m<results.length;m++){
              var temp = {name:this.className[m],number:results[m]};
              this.classStatic.push(temp)
            }
            //柱状图
          if(index2===1){
            Chart.source(this.classStatic);
            Chart.scale('number', {
              tickInterval: 5
            });
            Chart.interval().position('name*number').color('name');
          }
            //饼状图
          else if (index2===2){
            Chart.source(this.classStatic);
            Chart.coord('theta', {
              radius: 0.75
            });
            Chart.tooltip({
              showTitle: false,
              itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            Chart.intervalStack().position('number').color('name').label('number', {
              formatter: function formatter(val, item) {
                return item.point.name + ': ' + val;
              },textStyle: {
                fill: '#8c8c8c', // 文本的颜色
              }
            }).style({
              lineWidth:1,
              stroke: '#fff'
            });
          }
         }
          //全省统计图表
          else if(index1===2) {
            this.areaNumber = [];
            for (var n = 0; n < results.length; n++) {
              temp = {name: this.areaName[n], number: results[n]};
              this.areaStatic.push(temp);
            }
              Chart.axis('name', {
                label: {
                  textStyle: {
                    textAlign: 'middle', // 文本对齐方向，可取值为： start middle end
                    fill: '#ffffff', // 文本的颜色
                    fontSize: '10', // 文本大小
                    fontWeight: 'normal', // 文本粗细
                    rotate: 30,
                    textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
                  }
                },
              });
              Chart.axis('number', {
                label: {
                  textStyle: {
                    textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                    fill: '#ffffff', // 文本的颜色
                    fontSize: '10', // 文本大小
                    fontWeight: 'normal', // 文本粗细
                    rotate: 30,
                    textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
                  }
                },
                grid: {
                  lineStyle: {
                    stroke: '#d9d9d9',
                    lineWidth: 1,
                    lineDash: [2, 2]
                  }
                }
              });
              Chart.source(this.areaStatic);
              Chart.scale('number', {
                tickInterval: 10
              });
              Chart.interval().position('name*number').color('name');
          }
          //级别图表
          else if (index1===3){
            this.gradeNumber=[];
            this.graderepair=!this.graderepair;
            for (var i = 0; i < results.length; i++) {
              temp = {name:this.gradeName[i],number: results[i]};
              this.gradeStatic.push(temp)
            }
            if (index2===1){
              console.log(this.gradeStatic);
              Chart.source(this.gradeStatic);
              Chart.scale('sales', {
                tickInterval: 20
              });
              Chart.interval().position('name*number');
            }
            if (index2===2){
              Chart.source(this.gradeStatic);
              Chart.coord('theta', {
                radius: 0.75
              });
              Chart.tooltip({
                showTitle: false,
                itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              });
              Chart.intervalStack().position('number').color('name').label('number', {
                formatter: function formatter(val, item) {
                  return item.point.name + ': ' + val;
                },textStyle: {
                  fill: '#ffffff', // 文本的颜色
                }
              }).style({
                lineWidth:1,
                stroke: '#fff'
              });
            }
          }
          Chart.render();
        },
        //传承分析
        inheritorAnalyse(index){
            this.shuangpingUse=true;
            this.yearshow=true;
            esriLoader.loadModules([
              "esri/Map",
              "esri/views/MapView",
              "esri/layers/FeatureLayer",
              "dojo/domReady!"]).then(([Map, MapView,FeatureLayer])=>{
              var classInfo=[
                {
                minValue:0,
                maxValue:0.007,
                symbol:this.less007,
                label: "< 0.007"
              },{
                minValue:0.007001,
                maxValue:0.1,
                symbol:this.more007,
                label: " 0.007-0.1"
              },{
                minValue:0.1001,
                maxValue:0.2,
                symbol:this.more01,
                label: "0.1-0.2"
              },{
                minValue:0.2001,
                maxValue:1,
                symbol:this.more02,
                label: ">0.2"
              }];
              var renderer0 = {
                type:"class-breaks",
                field:this.calculateInheritor0,
                classBreakInfos:classInfo
              };
              var renderer1 = {
                type:"class-breaks",
                field:this.calculateInheritor1,
                classBreakInfos:classInfo
              };
              var renderer2= {
                type:"class-breaks",
                field:this.calculateInheritor2,
                classBreakInfos:classInfo
              };
              var renderer3 = {
                type:"class-breaks",
                field:this.calculateInheritor3,
                classBreakInfos:classInfo
              };
              var areaLayer = new FeatureLayer({
                url:this.areaUrl,
                opacity:0.7,
                outFields:["*"]
              });
              if (index<=1999){
                areaLayer.renderer=renderer0
              }
              else if (index<=2000){
                areaLayer.renderer=renderer1
              }
              else if(index<=2012){
                areaLayer.renderer=renderer2
              }
              else if(index<=2016){
                areaLayer.renderer=renderer3
              }

              var map = new Map({
                basemap: "oceans",
                layers:[areaLayer]
              });
              var view = new MapView({
                container: "viewDiv",
                map: map,
                center: [118.999, 25.88],
                zoom:8,
              });
            })

        },
        //双屏对比
        doubleScreen(index0,index1,index2){
          this.tableshow=false;
          this.yearshow=false;
          this.buttonShow=false;
          this.doublescreenshow=true;
          this.doublescreenyearshow=true;
          esriLoader.loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/core/watchUtils",
            "esri/layers/FeatureLayer",
            "dojo/domReady!"]).then(([Map,MapView,watchUtils,FeatureLayer])=>{
            var classInfo=[
              {
                minValue:0,
                maxValue:0.007,
                symbol:this.less007,
                label: "< 0.007"
              },{
                minValue:0.007001,
                maxValue:0.1,
                symbol:this.more007,
                label: " 0.007-0.1"
              },{
                minValue:0.1001,
                maxValue:0.2,
                symbol:this.more01,
                label: "0.1-0.2"
              },{
                minValue:0.2001,
                maxValue:1,
                symbol:this.more02,
                label: ">0.2"
              }];
            var renderer0 = {
              type:"class-breaks",
              field:this.calculateInheritor0,
              classBreakInfos:classInfo
            };
            var renderer1 = {
              type:"class-breaks",
              field:this.calculateInheritor1,
              classBreakInfos:classInfo
            };
            var renderer2= {
              type:"class-breaks",
              field:this.calculateInheritor2,
              classBreakInfos:classInfo
            };
            var renderer3 = {
              type:"class-breaks",
              field:this.calculateInheritor3,
              classBreakInfos:classInfo
            };
            var areaLayer1 = new FeatureLayer({
              url:this.areaUrl,
              opacity:0.7,
              outFields:["*"]
            });
            var areaLayer2 = new FeatureLayer({
              url:this.areaUrl,
              opacity:0.7,
              outFields:["*"]
            });
            if (index0===0&&index1<=1999){
              areaLayer1.renderer=renderer0;
              this.areaLayer1=areaLayer1;
            }
            else if (index0===0&&index1<=2000){
              areaLayer1.renderer=renderer1;
              this.areaLayer1=areaLayer1;
            }
            else if (index0===0&&index1<=2012){
              areaLayer1.renderer=renderer2;
              this.areaLayer1=areaLayer1;
            }
            else if (index0===0&&index1<=2016){
              areaLayer1.renderer=renderer3;
              this.areaLayer1=areaLayer1;
            }
            if (index0===1&&index1<=1999){
              areaLayer2.renderer=renderer0;
              this.areaLayer2=areaLayer2;
            }
            else if (index0===1&&index1<=2000){
              areaLayer2.renderer=renderer1;
              this.areaLayer2=areaLayer2;
            }
            else if (index0===1&&index1<=2012){
              areaLayer2.renderer=renderer2;
              this.areaLayer2=areaLayer2;
            }
            else if (index0===1&&index1<=2016){
              areaLayer2.renderer=renderer3;
              this.areaLayer2=areaLayer2;
            }
            var map1 = new Map({
              basemap: "oceans",
              layers:[this.areaLayer1]
            });
            var view1 = new MapView({
              container: "viewDiv1",
              map: map1,
              center: [118.999, 25.88],
              zoom:8,
            });
            var map2 = new Map({
              basemap: "oceans",
              layers:[this.areaLayer2]
            });
            var view2 = new MapView({
              container: "viewDiv2",
              map: map2,
              center: [118.999, 25.88],
              zoom:8,
              constraints: {
                // Disable zoom snapping to get the best synchonization
                snapToZoom: false
              }
            });
            var synchronizeView = function(view, others) {
              others = Array.isArray(others) ? others : [others];
              var viewpointWatchHandle;
              var viewStationaryHandle;
              var otherInteractHandlers;
              var scheduleId;
              var clear = function() {
                if (otherInteractHandlers) {
                  otherInteractHandlers.forEach(function(handle) {
                    handle.remove();
                  });
                }
                viewpointWatchHandle && viewpointWatchHandle.remove();
                viewStationaryHandle && viewStationaryHandle.remove();
                scheduleId && clearTimeout(scheduleId);
                otherInteractHandlers = viewpointWatchHandle =
                  viewStationaryHandle = scheduleId = null;
              };

              var interactWatcher = view.watch('interacting,animation',
                function(newValue) {
                  if (!newValue) {
                    return;
                  }
                  if (viewpointWatchHandle || scheduleId) {
                    return;
                  }

                  // start updating the other views at the next frame
                  scheduleId = setTimeout(function() {
                    scheduleId = null;
                    viewpointWatchHandle = view.watch('viewpoint',
                      function(newValue) {
                        others.forEach(function(otherView) {
                          otherView.viewpoint = newValue;
                        });
                      });
                  }, 0);

                  // stop as soon as another view starts interacting, like if the user starts panning
                  otherInteractHandlers = others.map(function(otherView) {
                    return watchUtils.watch(otherView,
                      'interacting,animation',
                      function(
                        value) {
                        if (value) {
                          clear();
                        }
                      });
                  });

                  // or stop when the view is stationary again
                  viewStationaryHandle = watchUtils.whenTrue(view,
                    'stationary', clear);
                });

              return {
                remove: function() {
                  this.remove = function() {};
                  clear();
                  interactWatcher.remove();
                }
              }
            };

            /**
             * utility method that synchronizes the viewpoints of multiple views
             */
            var synchronizeViews = function(views) {
              var handles = views.map(function(view, idx, views) {
                var others = views.concat();
                others.splice(idx, 1);
                return synchronizeView(view, others);
              });

              return {
                remove: function() {
                  this.remove = function() {};
                  handles.forEach(function(h) {
                    h.remove();
                  });
                  handles = null;
                }
              }
            };
            // bind the views
            synchronizeViews([view1, view2]);
          })
        },
        //区域类别对比
        areaCompare(areaname,index){
            var ethis=this;
            esriLoader.loadModules([
            "esri/tasks/support/Query",
            "esri/layers/FeatureLayer",]).then(([Query,FeatureLayer])=>{
            var coutness = {
              onStatisticField: "类别",  // service field for 2015 population
              outStatisticFieldName: "number",
              statisticType: "count"
            };
            var featureLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/feiyiPoint1/FeatureServer",
              outFields: ["*"],
            });
            for (var a=0;a<ethis.className.length;a++){
              var query = new Query();
              query.geometry= ethis.acquireGeometry(areaname);
              query.outStatistics=[ coutness];
              query.where = "类别 = '" + ethis.className[a] + "'";//从className中获取各个类别的名字然后作为验证
              featureLayer.queryFeatures(query).then(
                (response)=> {
                    var stats = response.features[0].attributes;
                    if(index===1){
                      ethis.areanumber1.push(stats.number);
                      ethis.compareArea1=areaname
                    }
                    else if (index===2){
                      ethis.areanumber2.push(stats.number);
                      ethis.compareArea2=areaname
                    }
                  if (ethis.areanumber1.length===10&&ethis.areanumber2.length===10){
                    console.log(ethis.areanumber1);
                    console.log(ethis.areanumber2);
                    ethis.compareTableMaking(ethis.areanumber1,ethis.areanumber2)
                  }
                }
              );
            }
          });
        },
        //获取这个行政区的geometry
        acquireGeometry(area){

            for(var i =0;i<this.allarea.length;i++){
              var item;
              if (area===this.allarea[i].attributes.coun_nm){
                item=this.allarea[i];
                return item.geometry;
              }

            }
        },
        //分组柱状图表制作
        compareTableMaking(number1,number2){
            var temp={};
            //判断数据长度小于10的时候添加第一个行政区的信息
            if (this.raderTableData.length<=10){
              for (var i = 0;i<this.className.length;i++){
                temp = {classname:this.className[i],name:this.compareArea1,number:number1[i]};
                this.raderTableData.push(temp)
              }
            }
            //当第一个行政区得信息加完后数据长度为10，这时候添加第二个行政区得信息
           if (this.raderTableData.length===10){
              for (var j = 0;j<this.className.length;j++){
                temp = {classname:this.className[j],name:this.compareArea2,number:number2[j]};
                this.raderTableData.push(temp)
              }
            }
            console.log(this.raderTableData);
          var Chart = new G2.Chart({
            container: 'c1', // 指定图表容器 ID
            width: 700, // 指定图表宽度
            height: 420,// 指定图表高度
            padding: [10, 10, 200, 20],
            background: {
              fill: '#ffffff', // 图表背景色
            }
          });
          Chart.axis('classname', {
            label: {
              textStyle: {
                textAlign: 'middle', // 文本对齐方向，可取值为： start middle end
                fill: '#8c8c8c', // 文本的颜色
                fontSize: '10', // 文本大小
                fontWeight: 'normal', // 文本粗细
                rotate: 30,
                textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
              }
            },
          });
          Chart.axis('number', {
            label: {
              textStyle: {
                textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#8c8c8c', // 文本的颜色
                fontSize: '10', // 文本大小
                fontWeight: 'normal', // 文本粗细
                rotate: 30,
                textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
              }
            },
            grid: {
              lineStyle: {
                stroke: '#d9d9d9',
                lineWidth: 1,
                lineDash: [2, 2]
              }
            }
          });
          Chart.source(this.raderTableData);
          this.Chart=Chart;
          Chart.interval().position('classname*number').color('name').adjust([{
            type: 'dodge',
            marginRatio: 1 / 32
          }]);
          Chart.render();
        },
        //全省行政区域获取
        allareaAcquire(){
            var athis=this;
          esriLoader.loadModules([
            "esri/tasks/support/Query"]).then(([Query])=>{
              let graphics;
            athis._view.whenLayerView(athis.areaLayer).then(function(layerView) {
              var bthis=athis;
              layerView.watch("updating", function(value) {
                var cthis=bthis;
                if (!value) {
                  //用要素图层建立查询工作
                  var query = new Query();
                  query = athis.areaLayer.createQuery();
                  query.geometry=athis._view.extent;//视图的范围
                  query.returnGeometry=true;
                  query.outFields=["*"];//查询完成后展示所有的字段
                  athis.areaLayer.queryFeatures(query).then((results)=> {
                    var dthis=cthis;//this的指向
                    graphics = results.features;
                    dthis.allarea=results.features;//添加查询到的数据到数组里面
                    console.log(dthis.allarea)
                  }).catch(function(error) {
                    console.error("query failed: ", error);
                  });
                }
              });
            });
          });
        },
        showCompare(){
            this.compareShow=true;
            this.staticAnalyse(0)
        },
        turnOff(){
         this.compareShow=false;
        this.classShow=false;
        this.classStatic=[];
        this.Chart.destroy();
        this.yearshow=false;
        },
        goBack(){
            this.tableshow=true;
            this.doublescreenshow=false;
            this.buttonShow=true;
            this.yearshow=true;
        },
      },
      props:['ptempte','more02','more01','more007','less007','calculateInheritor0','calculateInheritor1',
             'calculateInheritor2','calculateInheritor3'],
      mounted(){
          this.staticAnalyse(0);
          this.allareaAcquire()
      },components:{

      }
    }
</script>

<style scoped>
  #searchList1 {
    background-color: rgba(31, 31,32, 1);
    position: absolute;
    top: 90px;
    left: 1280px;
    padding: 2px;
    opacity: 0.8;

  }
  #allcount{
    position: absolute;
    top:155px;
    left: 1180px;
  }
  #inheritor{
    position: absolute;
    top: 210px;
    left: 1180px;
  }
  #back{
    position: absolute;
    top:105px;
    left: 1180px;
  }
  #back2{
    position: absolute;
    top:105px;
    left: 1380px;
  }
  #deleteButton{
    position: absolute;
    top: 375px;
    left: 1180px;
  }
  #compare{
    position: absolute;
    top: 320px;
    left: 1180px;
  }
  #shuangping{
    position: absolute;
    top: 265px;
    left: 1180px;

  }
  #dropmenu{
    position: absolute;
    background-color:rgba(0,0,0,0);
    top:105px;
    left: 1340px;
  }
  #year{
    position: absolute;
    top: 103px;
    left: 300px;
  }
  #doublescreenyear1{
       position: absolute;
       top: 103px;
       left: 300px;
     }
  #doublescreenyear2{
    position: absolute;
    top: 103px;
    left:943px;
  }
  #area1{
    position: absolute;
    top: 103px;
    left: 300px;
  }
  #area2{
    position: absolute;
    top: 103px;
    left:543px;
  }


</style>
