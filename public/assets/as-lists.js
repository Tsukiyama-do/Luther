$(document).ready(function(){

    var set_tran = function() { // to create json text of transaction
      var s_tran = '';
      var tran_obj = new Object();
        tran_obj.value_date = $('#value_date').val();
        tran_obj.amount = $('#tran_amount').val();
        tran_obj.currency = $('#currency').val();
        tran_obj.tran_name = $('#tran_name').val();
        tran_obj.fromAddress = $('#account_from').val();
        tran_obj.toAddress = $('#account_to').val();
        tran_obj.remarks = $('#textarea-1').val();
        tran_obj.email = $('#emailad').val();

      var myobj = new Object();
      myobj.tag = 'tran';
      myobj.rst = tran_obj;
      s_tran = JSON.stringify(myobj);
        //      console.log("conversion : " + JSON.stringify(myobj));
      return JSON.stringify(myobj);
    }

    $("#btn-get-account").on('click', function() {    //  When clicking on select button on Account form.
        socket.on('disconnect', () => {
          socket.open();
        });
        var json_msg = '{ "tag": "acclst", "rst" : ""}';
        socket.emit("client_to_server", json_msg);
      });

    $("#btn-get-balance").on('click', function() {    //  When clicking on select button on Account form.
          socket.on('disconnect', () => {
            socket.open();
          });
          var json_msg = '{ "tag": "accbalance", "rst" : "' + $("#acclst").val() + '" }';
          socket.emit("client_to_server", json_msg);
        });

    $("#btn-get-account2").on('click', function() {    //  When clicking on get accoun button from transaction
            socket.on('disconnect', () => {
              socket.open();
            });
            var json_msg = '{ "tag": "acclst2", "rst" : ""}';
            socket.emit("client_to_server", json_msg);
       });   //  EOF of btn-get-account2
    $("#btn-tran-submit").on('click', function() {    //  When clicking on get accoun button from transaction
                    socket.on('disconnect', () => {
                      socket.open();
                    });
                    var json_msg =  set_tran();   // that creates string of transaction message.
                    socket.emit("client_to_server", json_msg);
      });    //  EOF of btn-tran-submit

});   //  End of document ready
