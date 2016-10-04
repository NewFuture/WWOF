//matrix_mul.js
//计算矩阵乘法
/**
 * 矩阵原型
 */
function Matrix(data) {
  if (typeof data !== "object" || typeof data.length === "undefined" || !data) {
    throw new Error("data's type is error");
  }
  this.data = data;
  this.cols = data.length;
}
var M = {
  findByLocation: function(data, xIndex, yIndex) {
    if (data && data[xIndex]) {
      return data[xIndex][yIndex];
    }
  },
  // 矩阵乘积
  multiply: function(m, n) {
    if (!m instanceof Matrix && !n instanceof Matrix) {
      throw new Error("data's type is error");
    }
    var mData = m.data;
    var nData = n.data;
    if (mData.length == 0 || nData.length == 0) {
      return 0;
    }
    if (mData[0].length != nData.length) {
      throw new Error("the two martrix data is not allowed to dot");
    }
    var result = [];
    for (var i = 0, len = mData.length; i < len; i++) {
      var mRow = mData[i];
      result[i] = [];
      for (var j = 0, jLen = mRow.length; j < jLen; j++) {
        var resultRowCol = 0;

        if (typeof this.findByLocation(nData, 0, j) === "undefined") {
          break;
        }
        for (var k = 0, kLen = jLen; k < kLen; k++) {
          resultRowCol += mRow[k] * this.findByLocation(nData, k, j);
        }
        result[i][j] = resultRowCol;
      }
    }
    return result;
  }
};

function determinant(e) {
  var i, j, s, o, l;
  //计算并判断矩阵的阶数
  switch (l = e.length) {
    case 1:
      return e[0][0];
      //二阶和三阶直接主对角线减副对角线
    case 2:
      return e[0][0] * e[1][1] - e[0][1] * e[1][0];
    case 3:
      return (
        e[0][0] * e[1][1] * e[2][2] + e[0][1] * e[1][2] * e[2][0] + e[0][2] * e[1][1] * e[2][0] -
        e[0][2] * e[1][1] * e[2][0] - e[0][0] * e[1][2] * e[2][1] - e[0][1] * e[1][0] * e[2][2]
      );
      //高阶则需要降阶
    default:
      //取行列式第一行展开
      for (i = s = 0; i < l; i++) {
        //生成展开位置的低阶行列式
        o = new Array();
        for (var j = 1; j < l; j++) {
          o[j - 1] = new Array();
          for (var k = 0; k < l; k++) {
            if (i != k) {
              o[j - 1].push(e[j][k]);
            }
          }

        }
        //计算展开后每个低阶行列式的值，并计算符号来连接
        s += determinant(o) * e[0][i] * (i % 2 ? -1 : 1);
      };
      //返回结果
      return s;
  };
};

function sum(r) {
  // console.log(r);
  var s = 0;
  for (var i = 0; i < r.length; i++) {
    for (var j = 0; j < r[i].length; j++) {
      s += r[i][j];
    }
  }
  return s;
}
onmessage = function(event) {

  // console.log(event.data[0]);
  var r = event.data[0];
  var m = new Matrix(r);
  var times = event.data[1] || 1;
  while (times-- > 1) {
    r = M.multiply(new Matrix(r), m);
  }

  var s = sum(r);
  postMessage(s);

  // var m = new Matrix(event.data);
  // var n = new Matrix(event.data);
  // var r = M.multiply(m, n);
  // var det = determinant(r);
  // postMessage(r);
};