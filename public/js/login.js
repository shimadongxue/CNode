$(function () {


    $('#submit').off().on('click',function (e) {

        let data = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        $.ajax({
            url: '/login',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function (res) {
                if ( res.code === 0 ) {
                    // location.href = "http://localhost:3001"
                    window.location.href = '/'
                } else {
                    alert(res.msg)
                }

            },
            fail: function (err) {
                console.log(err);
            }
        });
    });

    $('.logout-btn').on('click', function () {
        $.ajax({
            url: '/logout',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            success:  function (res) {
                if ( res.code === 0 ) {
                    // location.href = "http://localhost:3001"
                    window.location.href = '/login'
                } else {
                    alert(res.msg)
                }
            },
            fail: function (err) {
                console.log(err);
            }
        })
    });


    $('.upload-btn').off().on('click', function () {

        upload(0);
    });


    $('.download-btn').off().on('click', function () {

        $.ajax({
            url: 'http://192.168.155.33:12001/fastdfs/file/downloadlargefile',
            // responseType: "blob",
            method: 'post',
            data: JSON.stringify({ id: '1c672136834647ecabc8f888b1769dbf'}),
            contentType:"application/json;",
            success: function(res){
                debugger
                console.log('下载成功');
              if (res.successful) {
                  const link = document.createElement('a');
                  let blob = new Blob([res.data],{type: res.type});
                  link.style.display = 'none';
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute('download', filename);
                  document.body.appendChild(link)
                  link.click();
                  document.body.removeChild(link);
              }
            },
            fail: function(err){
                console.log('上传失败');
                console.log(err);
            }
        })

    });

    function upload(start, fileId, size) {


        var chunkSize=1*1024*1024;//分片大小 2M
        var $big_file = $('#file')[0];
        var file = $big_file.files[0];

        if (!file) {
            alert( fileId ? '请先选择续传的文件' : '您没有上传文件，请先上传文件！');
            return;
        }


        var name = file.name;
        var oriSize = file.size;

        if ( size && oriSize !== oriSize ) {
            alert('您要继续上传的文件与原来的文件非同一个文件，不能续传！');
            return;
        }

        //


        var buff = new FileReader();

        var obj = {
            fileName: name,
            oriSize: oriSize,
            fileId: fileId,
            start: start || 0,
            chunkSize: chunkSize
        }

        buff.readAsArrayBuffer(file);

        buff.onloadend = function () {
          console.log(this.result);
            buffFn(this.result, obj)
        };

    }

    function buffFn(result, obj) {

        var formData = new FormData();
        console.log(result.slice(obj.start, obj.chunkSize))
        formData.append("file",result.slice(obj.start));
        formData.append("fileName", obj.fileName);
        formData.append("fileSize", obj.oriSize);
        formData.append("fileId", obj.fileId || '');

        $.ajax({
            url:'http://192.168.155.33:12001/fastdfs/file/largefile',
            type:'POST',
            dataType: 'json',
            data: formData,
            processData : false, // 使数据不做处理
            contentType : false, // 不要设置Content-Type请求头
            success: function(data){
                console.log('上传成功');
                console.log(data);
            },
            fail: function(response){
                console.log('上传失败');
                console.log(response);
            }
        });
    }
    $('.list').off().on('click','.continue-btn', function () {

       var _this = $(this).parent();

       var id = _this.data('id');
        $.ajax({
            url: 'http://192.168.155.33:12001/fastdfs/file/largedetail',
            type:'post',
            data: JSON.stringify({
                id: id
            }),
            contentType:"application/json;charset=utf-8",
            success: function(res){

                var result = res.successful;

                if ( result ) {
                    var start = Number(res.resultValue.offset)+1;
                    var size = Number( _this.data('size'));
                    upload(start,id, size);
                }
                console.log(res);

            },
            fail: function(err){
                console.log('未上传数据获取失败！')
                console.log(err);
            }
        })
    });

    function fileList() {
        $.ajax({
            url: 'http://192.168.155.33:12001/fastdfs/file/largefilelist',
            type:'post',
            data: JSON.stringify({
                filter:{},
                pageIndex:1,
                pageSize:10
            }),
            contentType:"application/json;charset=utf-8",
            success: function(res){
               console.log('列表获取成功！')
                var result = res.successful;

               var $list = $('.list');


               if ( result ) {
                   var data = res.resultValue.records;

                   var html = '';
                   for (let i=0; i<data.length; i++) {

                       var item = data[i];
                      html += '<li data-id="'+item['fileId']+'" data-size="'+item['fileSize']+'"><span>'+item['fileName']+'</span><span class="fr continue-btn">继续上传</span></li>'
                   }
                   $list.html(html);
               }
            },
            fail: function(err){
                console.log('列表获取失败！')
                console.log(err);
            }
        })
    };

    fileList();

})
