lst = [];
curItem = null;
curPage = 1;
totPage = 1;
$(function(){
  getStudents(1);
  $('#txtNgaySinh').datepicker({
    format: "dd/mm/yyyy"
  });
});
//get
function getStudens1(){
  fetch("http://localhost:3000/students")
  .then(res=>{
    return res.json();
  })
  .then(data =>{
    lst = [];
    data.forEach((sv, i) => {
      sv.STT = i + 1;
      lst.push(sv);
    });
    if (lst.length>0)
    {
      $("#tbodySV").html("");
      $("#svTemplate").tmpl(lst).appendTo("#tbodySV");
    }
    else{
      str = "<caption>No data found</caption>";
      $("#tbodySV").html(str);
    }
  })
  .catch(err=>{
    str = "<caption>Error.....</caption>";
    $("#tbodySV").html(str);
  });
}
//
function getStudents(cPage){
  let size = 5;
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/students_mysql",
    data: {
      page: cPage,
      size: 5
    }
  }).done(function(res){
    let data = res.data;
    lst = [];
    data.forEach((sv, i) => {
      sv.STT = (cPage-1)*size + i + 1;
      lst.push(sv);
    });
    if (lst.length>0)
    {
      $("#tbodySV").html("");
      $("#svTemplate").tmpl(lst).appendTo("#tbodySV");
    }
    else{
      str = "<caption>No data found</caption>";
      $("#tbodySV").html(str);
    }
    curPage = cPage;
    n = res.TotalRecord;
    totPage = ((n % size) == 0)?parseInt(n/size): parseInt(n/size)+1;
    $("#spanCurPage").text(cPage);
  }).error(function(err){
    str = "<caption>Error.....</caption>";
    $("#tbodySV").html(str);
  });
}
//thêm sv
function createSV()
{
  console.log("Create");
  gt = "Nam";
  gt = $('input[name="GioiTinh"]:checked').val();
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/students",
    data: {
      "MaSV": $('#txtMSSV').val(),
      "HoTen": $('#txtHoTen').val(),
      "Lop": $('#txtLop').val(),
      "GioiTinh": gt,
      "NgaySinh": $('#txtNgaySinh').val()
    }
  }).done(function(res){
    console.log(res);
    if(res.success)
    {
      alert(res.msg);
      $('#modalSinhVien').modal('toggle');
      getStudens();
    }
    else
    {
      alert(res.msg);
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {console.log(textStatus)});
}

//sửa - cập nhật
function setModal(type)
{
  if(type == "up")
  {
    $("#btnCreate").hide();
    $("#btnUpdate").show();
    $("#txtMSSV").attr("readonly", true);
  }
  else
  {
    $("#btnCreate").show(); 
    $("#btnUpdate").hide();
    $("#txtMSSV").attr("readonly", false);
  }
}

function upStudent(mssv){
  $('#modalSinhVien').modal('toggle');
  setModal("up");
  sv = lst.find(x=>x.MaSV == mssv)
  $("#txtMSSV").val(sv.MaSV);
  $("#txtHoTen").val(sv.HoTen);
  $("#txtLop").val(sv.Lop);
  if(sv.GioiTinh == "Nam")
      $('#radioNam').prop('checked',true);
  else
      $('#radioNu').prop('checked',true);
  $("#txtNgaySinh").val(sv.NgaySinh);
}

function updateSV()
{
  gt = "Nam";
  gt = $('input[name="GioiTinh"]:checked').val();
  $.ajax({
    method: "PUT",
    url: "http://localhost:3000/students",
    data: {
      "MaSV": $('#txtMSSV').val(),
      "HoTen": $('#txtHoTen').val(),
      "Lop": $('#txtLop').val(),
      "GioiTinh": gt,
      "NgaySinh": $('#txtNgaySinh').val()
    }
  }).done(function(res){
    console.log(res);
    if(res.success)
    {
      alert(res.msg);
      $('#modalSinhVien').modal('toggle');
      getStudens();
    }
    else
    {
      alert(res.msg);
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {console.log(textStatus)});
}

//xóa
function delStudent(mssv)
{
  if(confirm("Bạn có muốn xóa?")){
    $.ajax({
      method: "DELETE",
      url: "http://localhost:3000/students",
      data: {
        "MaSV": mssv,
      }
    }).done(function(res){
      console.log(res);
      if(res.success)
      {
        alert(res.msg);
        getStudens();
      }
      else
      {
        alert(res.msg);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {console.log(textStatus)});
  }
}


function goNext(){
  if(curPage == totPage)
  {
    alert("Bạn đang ở trang cuối !!!")
  }
  else
  {
    getStudents(curPage + 1);
  }
}

function goPrev(){
  if(curPage == 1)
  {
    alert("Bạn đang ở trang đầu !!!")
  }
  else
  {
    getStudents(curPage - 1);
  }
}