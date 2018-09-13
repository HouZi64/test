<template>
    <div id="cultureAreaStatic">
      <div id="viewDiv" style="position: absolute;width:1280px;height:620px;left: 251px;top: 90px;" ></div>
      <template>
        <div id="searchList1">
          <el-table
            :data="areaList"
            height="616"
            border
            style="width:260px;font-size: 15px"
           >
            <el-table-column
              fixed
              prop="attributes.coun_nm"
              label="文化区"
              width="90"
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
      <div id="compare">
        <el-button type="primary" plain   style="width: 100px" v-show="buttonShow" @click="showCompare">区域对比</el-button>
      </div>
      <template>
        <div id="deleteButton">
          <el-button type="primary" plain @click="turnOff" style="width: 100px" v-show="buttonShow">关闭</el-button>
        </div>
      </template>
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
    </div>
</template>

<script>
    import esriLoader from 'esri-loader';
    import G2 from '@antv/g2';
    esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');
    export default {
      name: "area_static",
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
          graderepair:false,
          Chart:[],
          buttonShow:true,
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
      },methods:{
        staticAnalyse:function () {
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
              var culturalareaUrl="https://localhost:6443/arcgis/rest/services/culture_area/FeatureServer";
              var areaLayer =new FeatureLayer({
                url:culturalareaUrl,
                opacity:0.7,
              });
              _this.areaLayer=areaLayer;
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
        //文化区定位与检索
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
        turnOff(){
          this.classShow=false;
          this.classStatic=[];
          this.Chart.destroy();
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
        //获取这个文化区的geometry
        acquireGeometry(area){
          for(var i =0;i<this.allarea.length;i++){
            var item;
            if (area===this.allarea[i].attributes.coun_nm){
              item=this.allarea[i];
              return item.geometry;
            }
          }
        },
        //分组图表制作
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
        //全省文化区域获取
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
      },
      props:['ptempte','more02','more01','more007','less007','calculateInheritor0','calculateInheritor1',
        'calculateInheritor2','calculateInheritor3'],
      mounted(){
        this.staticAnalyse(0);
        this.allareaAcquire()
      }
    }
</script>

<style scoped>
  #searchList1 {
    background-color: rgba(31, 31,32, 1);
    position: absolute;
    top: 90px;
    left: 1268px;
    padding: 2px;
    opacity: 0.8;

  }
  #deleteButton{
    position: absolute;
    top: 155px;
    left: 1170px;
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
  #compare{
    position: absolute;
    top: 100px;
    left:1170px;
  }
</style>

